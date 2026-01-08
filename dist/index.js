#!/usr/bin/env node
import { getTheme, getSeasonalTheme, getAllThemes, } from './themes/index.js';
import { loadClawdConfig, setTheme, setAutoSeasonal, } from './utils/config.js';
import { renderClawdWithMessage, renderAllThemes, } from './utils/renderer.js';
import { runTui } from './tui/index.js';
const VALID_THEMES = [
    'normal',
    'winter',
    'halloween',
    'valentines',
    'spring',
    'summer',
];
function showWelcome() {
    const config = loadClawdConfig();
    const theme = config.autoSeasonal
        ? getSeasonalTheme()
        : getTheme(config.theme);
    const message = config.autoSeasonal
        ? '(Auto-seasonal mode enabled)'
        : undefined;
    console.log(renderClawdWithMessage(theme, message));
}
function showCurrentTheme() {
    const config = loadClawdConfig();
    const themes = getAllThemes();
    console.log('\nClawd Theme Customizer');
    console.log('======================\n');
    if (config.autoSeasonal) {
        const seasonal = getSeasonalTheme();
        console.log(`Auto-seasonal mode: ON (current: ${seasonal.displayName})\n`);
    }
    else {
        console.log(`Current theme: ${config.theme}\n`);
    }
    console.log('Available themes:');
    console.log(renderAllThemes(themes, config.theme));
    console.log('\nCommands:');
    console.log('  /clawd <theme>  - Switch to a theme');
    console.log('  /clawd auto     - Toggle auto-seasonal mode');
    console.log('  /clawd config   - Open configuration TUI\n');
}
function switchTheme(themeName) {
    const normalized = themeName.toLowerCase();
    if (!VALID_THEMES.includes(normalized)) {
        console.error(`Unknown theme: ${themeName}`);
        console.log(`Valid themes: ${VALID_THEMES.join(', ')}`);
        process.exit(1);
    }
    setTheme(normalized);
    const theme = getTheme(normalized);
    console.log(renderClawdWithMessage(theme, 'Theme updated!'));
}
function toggleAutoSeasonal() {
    const config = loadClawdConfig();
    const newValue = !config.autoSeasonal;
    setAutoSeasonal(newValue);
    if (newValue) {
        const seasonal = getSeasonalTheme();
        console.log(renderClawdWithMessage(seasonal, `Auto-seasonal mode enabled! Current season: ${seasonal.displayName}`));
    }
    else {
        const theme = getTheme(config.theme);
        console.log(renderClawdWithMessage(theme, 'Auto-seasonal mode disabled.'));
    }
}
async function openConfigTui() {
    await runTui();
}
async function main() {
    const args = process.argv.slice(2);
    const command = args[0]?.toLowerCase();
    switch (command) {
        case '--welcome':
        case '-w':
            showWelcome();
            break;
        case 'auto':
            toggleAutoSeasonal();
            break;
        case 'config':
        case '--config':
        case '-c':
            await openConfigTui();
            break;
        case undefined:
        case '':
            showCurrentTheme();
            break;
        default:
            if (VALID_THEMES.includes(command)) {
                switchTheme(command);
            }
            else {
                console.error(`Unknown command or theme: ${command}`);
                showCurrentTheme();
                process.exit(1);
            }
    }
}
main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
});
