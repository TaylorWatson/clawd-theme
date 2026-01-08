import fs from 'fs';
import path from 'path';
import type { ClawdConfig, ThemeName } from '../themes/types.js';

const CONFIG_DIR = path.join(process.env.HOME ?? '', '.claude');
const SETTINGS_PATH = path.join(CONFIG_DIR, 'settings.json');

const DEFAULT_CONFIG: ClawdConfig = {
  theme: 'normal',
  autoSeasonal: false,
};

interface Settings {
  clawdTheme?: ClawdConfig;
  [key: string]: unknown;
}

function ensureConfigDir(): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

function loadSettings(): Settings {
  ensureConfigDir();

  if (!fs.existsSync(SETTINGS_PATH)) {
    return {};
  }

  try {
    const content = fs.readFileSync(SETTINGS_PATH, 'utf-8');
    return JSON.parse(content) as Settings;
  } catch {
    return {};
  }
}

function saveSettings(settings: Settings): void {
  ensureConfigDir();
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
}

export function loadClawdConfig(): ClawdConfig {
  const settings = loadSettings();
  return settings.clawdTheme ?? { ...DEFAULT_CONFIG };
}

export function saveClawdConfig(config: ClawdConfig): void {
  const settings = loadSettings();
  settings.clawdTheme = config;
  saveSettings(settings);
}

export function setTheme(themeName: ThemeName): void {
  const config = loadClawdConfig();
  config.theme = themeName;
  saveClawdConfig(config);
}

export function setAutoSeasonal(enabled: boolean): void {
  const config = loadClawdConfig();
  config.autoSeasonal = enabled;
  saveClawdConfig(config);
}

export function getDefaultConfig(): ClawdConfig {
  return { ...DEFAULT_CONFIG };
}
