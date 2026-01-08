#!/usr/bin/env node
import { getTheme, getSeasonalTheme, getAllThemes, } from './themes/index.js';
import { loadClawdConfig, setTheme, setAutoSeasonal, } from './utils/config.js';
import { renderClawdWithMessage, renderAllThemes, } from './utils/renderer.js';
// ANSI escape codes for cursor manipulation
const ESC = '\x1b';
const moveUp = (n) => `${ESC}[${n}A`;
const moveDown = (n) => `${ESC}[${n}B`;
const moveRight = (n) => `${ESC}[${n}C`;
const moveToColumn = (n) => `${ESC}[${n}G`;
const moveTo = (row, col) => `${ESC}[${row};${col}H`; // Absolute positioning
const saveCursor = `${ESC}[s`;
const restoreCursor = `${ESC}[u`;
const clearLine = `${ESC}[K`;
const hideCursor = `${ESC}[?25l`;
const showCursor = `${ESC}[?25h`;
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
// Render just the base Clawd with colors (no decorations) for clean overwrite
function renderBaseClawdWithColors(theme) {
    const baseArt = [
        ' ▐▛███▜▌',
        '▝▜█████▛▘',
        '  ▘▘ ▝▝',
    ];
    const hex = theme.colors.primary;
    const rgb = hexToRgb(hex);
    if (!rgb)
        return baseArt;
    return baseArt.map(line => `\x1b[38;2;${rgb.r};${rgb.g};${rgb.b}m${line}\x1b[0m`);
}
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}
// Attempt to overwrite the Claude Code welcome screen Clawd
async function overwriteWelcomeClawd() {
    const config = loadClawdConfig();
    const theme = config.autoSeasonal
        ? getSeasonalTheme()
        : getTheme(config.theme);
    // Use base Clawd without decorations for exact positioning
    const clawdLines = renderBaseClawdWithColors(theme);
    // Use ABSOLUTE positioning - row 7 is roughly where Clawd is in welcome box
    const clawdRow = 7;
    const clawdCol = 24;
    let output = '';
    output += saveCursor;
    for (let i = 0; i < clawdLines.length; i++) {
        output += moveTo(clawdRow + i, clawdCol);
        output += clawdLines[i];
    }
    output += restoreCursor;
    output += '\x1b[0m'; // Reset colors
    // Write to temp file, then spawn a TRULY detached background process
    const fs = await import('fs');
    const { spawn } = await import('child_process');
    const tmpFile = `/tmp/clawd-theme-${process.pid}.txt`;
    fs.writeFileSync(tmpFile, output);
    // Fully detach background process that writes to TTY multiple times
    // Staggered writes ensure one happens after welcome screen renders
    const child = spawn('/bin/sh', [
        '-c',
        `(
      sleep 0.3; cat "${tmpFile}" > /dev/tty 2>/dev/null;
      sleep 0.5; cat "${tmpFile}" > /dev/tty 2>/dev/null;
      sleep 0.7; cat "${tmpFile}" > /dev/tty 2>/dev/null;
      rm -f "${tmpFile}"
    ) &`
    ], {
        detached: true,
        stdio: 'ignore',
        shell: false
    });
    child.unref();
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
    console.log('  /clawd auto     - Toggle auto-seasonal mode\n');
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
async function main() {
    const args = process.argv.slice(2);
    const command = args[0]?.toLowerCase();
    switch (command) {
        case '--welcome':
        case '-w':
            showWelcome();
            break;
        case '--overwrite':
        case '-o':
            // Attempt to overwrite the Claude Code welcome Clawd
            await overwriteWelcomeClawd();
            break;
        case 'auto':
            toggleAutoSeasonal();
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
main().catch(console.error);
