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
import { runPicker } from './picker.js';

// ANSI escape codes for cursor manipulation
const ESC = '\x1b';
const moveUp = (n: number) => `${ESC}[${n}A`;
const moveDown = (n: number) => `${ESC}[${n}B`;
const moveRight = (n: number) => `${ESC}[${n}C`;
const moveToColumn = (n: number) => `${ESC}[${n}G`;
const moveTo = (row: number, col: number) => `${ESC}[${row};${col}H`;  // Absolute positioning
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

// Render Clawd with colors and optional decorations for overwrite
function renderClawdForOverwrite(theme: {
  colors: { primary: string; decoration?: string };
  decoration?: { left: string; right: string; spacing: string };
}): string[] {
  const baseArt = [
    ' ▐▛███▜▌',
    '▝▜█████▛▘',
    '  ▘▘ ▝▝',
  ];

  const primaryRgb = hexToRgb(theme.colors.primary);
  const decRgb = hexToRgb(theme.colors.decoration || theme.colors.primary);

  const colorize = (text: string, rgb: { r: number; g: number; b: number } | null) =>
    rgb ? `\x1b[38;2;${rgb.r};${rgb.g};${rgb.b}m${text}\x1b[0m` : text;

  let lines = baseArt.map(line => colorize(line, primaryRgb));

  // Add decorations if theme has them
  if (theme.decoration) {
    const { left, right, spacing } = theme.decoration;
    const leftDec = colorize(left, decRgb);
    const rightDec = colorize(right, decRgb);

    lines = lines.map((line, i) => {
      if (i === 1) {
        // Middle snowflake offset left, but body stays aligned (extra space after dec)
        return `${leftDec}${spacing}${spacing}${line}${spacing}${rightDec}`;
      }
      return `${spacing}${leftDec}${spacing}${line}${spacing}${rightDec}`;
    });
  }

  return lines;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
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
async function overwriteWelcomeClawd(): Promise<void> {
  const config = loadClawdConfig();
  const theme = config.autoSeasonal
    ? getSeasonalTheme()
    : getTheme(config.theme);

  // Render Clawd with decorations (snowflakes, etc.)
  const clawdLines = renderClawdForOverwrite(theme);

  // Use ABSOLUTE positioning - row 6 is where Clawd is in welcome box
  // Adjust column left by 3 chars if theme has decorations (spacing + decoration + spacing)
  const clawdRow = 6;
  const clawdCol = theme.decoration ? 21 : 24;

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

  // Get the parent process's TTY (Claude Code's TTY)
  const { execSync } = await import('child_process');
  let ttyPath = '/dev/tty';
  try {
    const ppid = process.ppid;
    const ttyResult = execSync(`ps -p ${ppid} -o tty=`, { encoding: 'utf-8' }).trim();
    if (ttyResult && ttyResult !== '??' && ttyResult !== '-') {
      ttyPath = ttyResult.startsWith('/dev/') ? ttyResult : `/dev/${ttyResult}`;
    }
  } catch {
    // Fall back to /dev/tty
  }

  // Create a shell script that runs in background
  const logFile = `/tmp/clawd-theme-debug.log`;
  const scriptFile = `/tmp/clawd-theme-runner-${process.pid}.sh`;
  const scriptContent = `#!/bin/sh
echo "Script started, TTY=${ttyPath}" >> "${logFile}"
sleep 0.3; cat "${tmpFile}" > "${ttyPath}" 2>>"${logFile}"; echo "Write 1 done" >> "${logFile}"
sleep 0.5; cat "${tmpFile}" > "${ttyPath}" 2>>"${logFile}"; echo "Write 2 done" >> "${logFile}"
sleep 0.7; cat "${tmpFile}" > "${ttyPath}" 2>>"${logFile}"; echo "Write 3 done" >> "${logFile}"
rm -f "${tmpFile}" "${scriptFile}"
echo "Script finished" >> "${logFile}"
`;
  fs.writeFileSync(scriptFile, scriptContent, { mode: 0o755 });

  // Use nohup to fully detach the background process
  const child = spawn('nohup', ['/bin/sh', scriptFile], {
    detached: true,
    stdio: 'ignore',
    cwd: '/tmp'
  });

  child.unref();
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

async function main(): Promise<void> {
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

    case 'config':
    case '--config':
    case '-c':
    case undefined:
    case '':
      // Open interactive picker
      await runPicker();
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

main().catch(console.error);
