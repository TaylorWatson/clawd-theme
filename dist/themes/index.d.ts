import type { ClawdTheme, ThemeName } from './types.js';
export * from './types.js';
export declare const themes: Record<ThemeName, ClawdTheme>;
export declare function getTheme(name: ThemeName): ClawdTheme;
export declare function getSeasonalTheme(): ClawdTheme;
export declare function getAllThemes(): ClawdTheme[];
