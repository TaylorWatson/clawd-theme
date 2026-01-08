import fs from 'fs';
import path from 'path';
const CONFIG_DIR = path.join(process.env.HOME ?? '', '.claude');
const SETTINGS_PATH = path.join(CONFIG_DIR, 'settings.json');
const DEFAULT_CONFIG = {
    theme: 'normal',
    autoSeasonal: false,
};
function ensureConfigDir() {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
}
function loadSettings() {
    ensureConfigDir();
    if (!fs.existsSync(SETTINGS_PATH)) {
        return {};
    }
    try {
        const content = fs.readFileSync(SETTINGS_PATH, 'utf-8');
        return JSON.parse(content);
    }
    catch {
        return {};
    }
}
function saveSettings(settings) {
    ensureConfigDir();
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
}
export function loadClawdConfig() {
    const settings = loadSettings();
    return settings.clawdTheme ?? { ...DEFAULT_CONFIG };
}
export function saveClawdConfig(config) {
    const settings = loadSettings();
    settings.clawdTheme = config;
    saveSettings(settings);
}
export function setTheme(themeName) {
    const config = loadClawdConfig();
    config.theme = themeName;
    saveClawdConfig(config);
}
export function setAutoSeasonal(enabled) {
    const config = loadClawdConfig();
    config.autoSeasonal = enabled;
    saveClawdConfig(config);
}
export function getDefaultConfig() {
    return { ...DEFAULT_CONFIG };
}
