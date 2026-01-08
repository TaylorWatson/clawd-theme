import React from 'react';
import { Box, Text } from 'ink';
import { getTheme, type ThemeName } from '../themes/index.js';
import { renderClawd } from '../utils/renderer.js';

interface PreviewProps {
  themeName: ThemeName;
}

export function Preview({ themeName }: PreviewProps): React.ReactElement {
  const theme = getTheme(themeName);
  const clawdArt = renderClawd(theme);

  return (
    <Box flexDirection="column" alignItems="center" marginY={1}>
      <Text>{clawdArt}</Text>
    </Box>
  );
}
