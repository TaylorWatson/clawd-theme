import React from 'react';
import { type ThemeName } from '../themes/index.js';
interface ThemeSelectorProps {
    selectedTheme: ThemeName;
    onSelect: (theme: ThemeName) => void;
    autoSeasonal: boolean;
    onToggleAuto: () => void;
}
export declare function ThemeSelector({ selectedTheme, onSelect, autoSeasonal, onToggleAuto, }: ThemeSelectorProps): React.ReactElement;
export {};
