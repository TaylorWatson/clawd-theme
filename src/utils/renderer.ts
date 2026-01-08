import chalk from 'chalk';
import type { ClawdTheme } from '../themes/types.js';

const CLAWD_BLOCK_ART = [
  ' ▐▛███▜▌',
  '▝▜█████▛▘',
  '  ▘▘ ▝▝',
];

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

function colorize(text: string, hexColor: string): string {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return text;
  return chalk.rgb(rgb.r, rgb.g, rgb.b)(text);
}

export function renderClawd(theme: ClawdTheme): string {
  const lines = [...CLAWD_BLOCK_ART];
  const { colors, decoration } = theme;

  let coloredLines = lines.map((line) => colorize(line, colors.primary));

  if (decoration) {
    const decColor = colors.decoration ?? colors.accent ?? colors.primary;
    const leftDec = colorize(decoration.left, decColor);
    const rightDec = colorize(decoration.right, decColor);
    const spacing = decoration.spacing;

    coloredLines = coloredLines.map((line, index) => {
      if (index === 0) {
        return `${spacing}${leftDec}${spacing}${line}${spacing}${rightDec}`;
      } else if (index === 1) {
        return `${leftDec}${spacing}${line}${spacing}${rightDec}`;
      } else {
        return `${spacing}${leftDec}${spacing}${line}${spacing}${rightDec}`;
      }
    });
  }

  return coloredLines.join('\n');
}

export function renderClawdWithMessage(
  theme: ClawdTheme,
  message?: string
): string {
  const clawd = renderClawd(theme);
  const themeName = colorize(theme.displayName, theme.colors.primary);

  const output = ['', clawd, '', `  Clawd Theme: ${themeName}`];

  if (message) {
    output.push(`  ${message}`);
  }

  output.push('');

  return output.join('\n');
}

export function renderThemePreview(theme: ClawdTheme): string {
  return [
    colorize(`>> ${theme.displayName}`, theme.colors.primary),
    `   ${theme.description}`,
    '',
    renderClawd(theme),
  ].join('\n');
}

export function renderAllThemes(
  themes: ClawdTheme[],
  currentTheme: string
): string {
  return themes
    .map((theme) => {
      const indicator = theme.name === currentTheme ? '>' : ' ';
      const name = colorize(theme.displayName, theme.colors.primary);
      return `${indicator} ${name} - ${theme.description}`;
    })
    .join('\n');
}
