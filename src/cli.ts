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
} from './utils/renderer.js';

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
