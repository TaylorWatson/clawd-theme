import type { ClawdTheme } from '../themes/types.js';
export declare function renderClawd(theme: ClawdTheme): string;
export declare function renderClawdWithMessage(theme: ClawdTheme, message?: string): string;
export declare function renderThemePreview(theme: ClawdTheme): string;
export declare function renderAllThemes(themes: ClawdTheme[], currentTheme: string): string;
