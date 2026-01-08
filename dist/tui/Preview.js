import { jsx as _jsx } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { getTheme } from '../themes/index.js';
import { renderClawd } from '../utils/renderer.js';
export function Preview({ themeName }) {
    const theme = getTheme(themeName);
    const clawdArt = renderClawd(theme);
    return (_jsx(Box, { flexDirection: "column", alignItems: "center", marginY: 1, children: _jsx(Text, { children: clawdArt }) }));
}
