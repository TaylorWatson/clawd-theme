import * as readline from 'readline';
import { getAllThemes, getTheme } from './themes/index.js';
import { loadClawdConfig, saveClawdConfig } from './utils/config.js';
import { renderClawd } from './utils/renderer.js';
const THEMES = ['normal', 'winter', 'halloween', 'valentines', 'spring', 'summer'];
function clearScreen() {
    process.stdout.write('\x1b[2J\x1b[H');
}
function hideCursor() {
    process.stdout.write('\x1b[?25l');
}
function showCursor() {
    process.stdout.write('\x1b[?25h');
}
function renderPicker(selectedIndex, autoSeasonal) {
    clearScreen();
    const themes = getAllThemes();
    const selectedTheme = themes[selectedIndex];
    console.log('\x1b[1;36mClawd Theme Customizer\x1b[0m');
    console.log('─'.repeat(40));
    console.log();
    // Preview
    console.log(renderClawd(selectedTheme));
    console.log();
    console.log(`  \x1b[1m${selectedTheme.displayName}\x1b[0m - ${selectedTheme.description}`);
    console.log();
    console.log('─'.repeat(40));
    console.log();
    // Theme list
    themes.forEach((theme, i) => {
        const marker = i === selectedIndex ? '\x1b[36m❯\x1b[0m' : ' ';
        const name = i === selectedIndex
            ? `\x1b[1;36m${theme.displayName}\x1b[0m`
            : theme.displayName;
        console.log(`  ${marker} ${i + 1}. ${name}`);
    });
    console.log();
    const autoMarker = autoSeasonal ? '\x1b[32m✓\x1b[0m' : ' ';
    console.log(`  [${autoMarker}] Auto-seasonal mode`);
    console.log();
    console.log('\x1b[90m↑↓ Navigate  Enter Save  a Toggle auto  q Quit\x1b[0m');
}
export async function runPicker() {
    const config = loadClawdConfig();
    let selectedIndex = THEMES.indexOf(config.theme);
    if (selectedIndex === -1)
        selectedIndex = 0;
    let autoSeasonal = config.autoSeasonal;
    // Check if we have a TTY
    if (!process.stdin.isTTY) {
        console.log('Interactive mode requires a terminal.');
        return;
    }
    hideCursor();
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    renderPicker(selectedIndex, autoSeasonal);
    return new Promise((resolve) => {
        const cleanup = () => {
            showCursor();
            process.stdin.setRawMode(false);
            process.stdin.removeListener('keypress', onKeypress);
            console.log();
        };
        const onKeypress = (_str, key) => {
            if (key.name === 'up' || key.name === 'k') {
                selectedIndex = (selectedIndex - 1 + THEMES.length) % THEMES.length;
                renderPicker(selectedIndex, autoSeasonal);
            }
            else if (key.name === 'down' || key.name === 'j') {
                selectedIndex = (selectedIndex + 1) % THEMES.length;
                renderPicker(selectedIndex, autoSeasonal);
            }
            else if (key.name === 'a') {
                autoSeasonal = !autoSeasonal;
                renderPicker(selectedIndex, autoSeasonal);
            }
            else if (key.name === 'return') {
                saveClawdConfig({
                    theme: THEMES[selectedIndex],
                    autoSeasonal,
                });
                cleanup();
                clearScreen();
                const theme = getTheme(THEMES[selectedIndex]);
                console.log(renderClawd(theme));
                console.log(`\n  \x1b[32m✓\x1b[0m Theme saved: ${theme.displayName}`);
                if (autoSeasonal) {
                    console.log('    Auto-seasonal mode enabled');
                }
                console.log();
                resolve();
            }
            else if (key.name === 'q' || key.name === 'escape' || (key.ctrl && key.name === 'c')) {
                cleanup();
                clearScreen();
                console.log('Cancelled');
                resolve();
            }
        };
        process.stdin.on('keypress', onKeypress);
    });
}
