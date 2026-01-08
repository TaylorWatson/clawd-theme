import type { ClawdConfig, ThemeName } from '../themes/types.js';
export declare function loadClawdConfig(): ClawdConfig;
export declare function saveClawdConfig(config: ClawdConfig): void;
export declare function setTheme(themeName: ThemeName): void;
export declare function setAutoSeasonal(enabled: boolean): void;
export declare function getDefaultConfig(): ClawdConfig;
