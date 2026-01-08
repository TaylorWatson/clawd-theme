import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import { getAllThemes } from '../themes/index.js';
export function ThemeSelector({ selectedTheme, onSelect, autoSeasonal, onToggleAuto, }) {
    const themes = getAllThemes();
    const items = themes.map((theme) => ({
        label: `${theme.displayName} - ${theme.description}`,
        value: theme.name,
    }));
    const handleSelect = (item) => {
        onSelect(item.value);
    };
    const initialIndex = items.findIndex((item) => item.value === selectedTheme);
    return (_jsxs(Box, { flexDirection: "column", marginTop: 1, children: [_jsx(Text, { bold: true, children: "Select Theme:" }), _jsx(Box, { marginLeft: 2, marginTop: 1, children: _jsx(SelectInput, { items: items, initialIndex: initialIndex >= 0 ? initialIndex : 0, onSelect: handleSelect }) }), _jsxs(Box, { marginTop: 1, children: [_jsxs(Text, { color: autoSeasonal ? 'green' : 'gray', dimColor: !autoSeasonal, children: [autoSeasonal ? '[x]' : '[ ]', " Auto-seasonal mode"] }), _jsx(Text, { dimColor: true, children: " (press 'a' to toggle)" })] })] }));
}
