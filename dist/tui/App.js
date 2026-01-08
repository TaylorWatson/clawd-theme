import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { Preview } from './Preview.js';
import { ThemeSelector } from './ThemeSelector.js';
import { loadClawdConfig, saveClawdConfig } from '../utils/config.js';
export function App() {
    const { exit } = useApp();
    const initialConfig = loadClawdConfig();
    const [selectedTheme, setSelectedTheme] = useState(initialConfig.theme);
    const [autoSeasonal, setAutoSeasonal] = useState(initialConfig.autoSeasonal);
    const [saved, setSaved] = useState(false);
    const handleToggleAuto = useCallback(() => {
        setAutoSeasonal((prev) => !prev);
    }, []);
    const handleSave = useCallback(() => {
        saveClawdConfig({
            theme: selectedTheme,
            autoSeasonal,
        });
        setSaved(true);
        setTimeout(() => exit(), 500);
    }, [selectedTheme, autoSeasonal, exit]);
    useInput((input, key) => {
        if (input === 'a' || input === 'A') {
            handleToggleAuto();
        }
        if (key.escape || input === 'q') {
            exit();
        }
        if (key.return) {
            handleSave();
        }
    });
    return (_jsxs(Box, { flexDirection: "column", padding: 1, children: [_jsx(Box, { borderStyle: "round", borderColor: "cyan", paddingX: 2, children: _jsx(Text, { bold: true, color: "cyan", children: "Clawd Theme Customizer" }) }), _jsx(Preview, { themeName: selectedTheme }), _jsx(ThemeSelector, { selectedTheme: selectedTheme, onSelect: setSelectedTheme, autoSeasonal: autoSeasonal, onToggleAuto: handleToggleAuto }), _jsx(Box, { marginTop: 2, children: _jsx(Text, { dimColor: true, children: "[Enter] Save  [Esc/q] Cancel  [a] Toggle auto-seasonal" }) }), saved && (_jsx(Box, { marginTop: 1, children: _jsx(Text, { color: "green", children: "Settings saved!" }) }))] }));
}
