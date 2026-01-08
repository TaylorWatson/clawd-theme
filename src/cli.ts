#!/usr/bin/env node

import {
  getTheme,
  getSeasonalTheme,
  getAllThemes,
  type ThemeName,
} from './themes/index.js';
import {
  loadClawdConfig,
  setTheme,
  setAutoSeasonal,
} from './utils/config.js';
import {
  renderClawdWithMessage,
  renderAllThemes,
  renderClawd,
} from './utils/renderer.js';

// ANSI escape codes for cursor manipulation
const ESC = '\x1b';
const moveUp = (n: number) => `${ESC}[${n}A`;
const moveDown = (n: number) => `${ESC}[${n}B`;
const moveRight = (n: number) => `${ESC}[${n}C`;
const moveToColumn = (n: number) => `${ESC}[${n}G`;
const saveCursor = `${ESC}[s`;
const restoreCursor = `${ESC}[u`;
const clearLine = `${ESC}[K`;
const hideCursor = `${ESC}[?25l`;
const showCursor = `${ESC}[?25h`;

const VALID_THEMES: ThemeName[] = [
  'normal',
  'winter',
  'halloween',
  'valentines',
  'spring',
  'summer',
];

function showWelcome(): void {
  const config = loadClawdConfig();
  const theme = config.autoSeasonal
    ? getSeasonalTheme()
    : getTheme(config.theme);

  const message = config.autoSeasonal
    ? '(Auto-seasonal mode enabled)'
    : undefined;

  console.log(renderClawdWithMessage(theme, message));
}

// Attempt to overwrite the Claude Code welcome screen Clawd
function overwriteWelcomeClawd(): void {
  const config = loadClawdConfig();
  const theme = config.autoSeasonal
    ? getSeasonalTheme()
    : getTheme(config.theme);

  // The welcome box Clawd is approximately:
  // - 8-10 lines up from where hook output starts
  // - Column 24 (roughly centered in left half of ~50 char wide left panel)
  //
  // Welcome box structure (approximate):
  // Line -10: ╭─── Claude Code v2.1.1 ──────...
  // Line -9:  │              ...               │
  // Line -8:  │    Welcome back Taylor!        │
  // Line -7:  │              ...               │
  // Line -6:  │           ▐▛███▜▌              │  <- Clawd line 1
  // Line -5:  │          ▝▜█████▛▘             │  <- Clawd line 2
  // Line -4:  │            ▘▘ ▝▝               │  <- Clawd line 3
  // Line -3:  │              ...               │
  // Line -2:  │  Opus 4.5 · Claude Max...      │
  // Line -1:  ╰────────────────────────────────╯
  // Current:  (hook output starts here)

  const clawdLines = renderClawd(theme).split('\n');

  // Configuration for positioning - may need adjustment
  const linesUpToFirstClawd = 6;  // How many lines up to first Clawd line
  const clawdStartColumn = 24;     // Column where Clawd starts

  // Write output that uses ANSI codes to overwrite
  let output = '';

  // Save cursor position
  output += saveCursor;

  // Move up to the first Clawd line
  output += moveUp(linesUpToFirstClawd);

  // For each line of our themed Clawd, move to position and write
  for (let i = 0; i < clawdLines.length; i++) {
    // Move to the correct column
    output += moveToColumn(clawdStartColumn);
    // Write the themed Clawd line (this will overwrite existing chars)
    output += clawdLines[i];
    // Move down to next line
    if (i < clawdLines.length - 1) {
      output += moveDown(1);
    }
  }

  // Restore cursor position
  output += restoreCursor;

  // Output everything at once
  process.stdout.write(output);
}

function showCurrentTheme(): void {
  const config = loadClawdConfig();
  const themes = getAllThemes();

  console.log('\nClawd Theme Customizer');
  console.log('======================\n');

  if (config.autoSeasonal) {
    const seasonal = getSeasonalTheme();
    console.log(`Auto-seasonal mode: ON (current: ${seasonal.displayName})\n`);
  } else {
    console.log(`Current theme: ${config.theme}\n`);
  }

  console.log('Available themes:');
  console.log(renderAllThemes(themes, config.theme));

  console.log('\nCommands:');
  console.log('  /clawd <theme>  - Switch to a theme');
  console.log('  /clawd auto     - Toggle auto-seasonal mode\n');
}

function switchTheme(themeName: string): void {
  const normalized = themeName.toLowerCase() as ThemeName;

  if (!VALID_THEMES.includes(normalized)) {
    console.error(`Unknown theme: ${themeName}`);
    console.log(`Valid themes: ${VALID_THEMES.join(', ')}`);
    process.exit(1);
  }

  setTheme(normalized);
  const theme = getTheme(normalized);
  console.log(renderClawdWithMessage(theme, 'Theme updated!'));
}

function toggleAutoSeasonal(): void {
  const config = loadClawdConfig();
  const newValue = !config.autoSeasonal;
  setAutoSeasonal(newValue);

  if (newValue) {
    const seasonal = getSeasonalTheme();
    console.log(
      renderClawdWithMessage(
        seasonal,
        `Auto-seasonal mode enabled! Current season: ${seasonal.displayName}`
      )
    );
  } else {
    const theme = getTheme(config.theme);
    console.log(
      renderClawdWithMessage(theme, 'Auto-seasonal mode disabled.')
    );
  }
}

function main(): void {
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
      overwriteWelcomeClawd();
      break;

    case 'auto':
      toggleAutoSeasonal();
      break;

    case undefined:
    case '':
      showCurrentTheme();
      break;

    default:
      if (VALID_THEMES.includes(command as ThemeName)) {
        switchTheme(command);
      } else {
        console.error(`Unknown command or theme: ${command}`);
        showCurrentTheme();
        process.exit(1);
      }
  }
}

main();
