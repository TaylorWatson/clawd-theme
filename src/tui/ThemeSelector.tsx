import React from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import { getAllThemes, type ThemeName } from '../themes/index.js';

interface ThemeSelectorProps {
  selectedTheme: ThemeName;
  onSelect: (theme: ThemeName) => void;
  autoSeasonal: boolean;
  onToggleAuto: () => void;
}

export function ThemeSelector({
  selectedTheme,
  onSelect,
  autoSeasonal,
  onToggleAuto,
}: ThemeSelectorProps): React.ReactElement {
  const themes = getAllThemes();

  const items = themes.map((theme) => ({
    label: `${theme.displayName} - ${theme.description}`,
    value: theme.name as ThemeName,
  }));

  const handleSelect = (item: { value: ThemeName }): void => {
    onSelect(item.value);
  };

  const initialIndex = items.findIndex((item) => item.value === selectedTheme);

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text bold>Select Theme:</Text>
      <Box marginLeft={2} marginTop={1}>
        <SelectInput
          items={items}
          initialIndex={initialIndex >= 0 ? initialIndex : 0}
          onSelect={handleSelect}
        />
      </Box>

      <Box marginTop={1}>
        <Text
          color={autoSeasonal ? 'green' : 'gray'}
          dimColor={!autoSeasonal}
        >
          {autoSeasonal ? '[x]' : '[ ]'} Auto-seasonal mode
        </Text>
        <Text dimColor> (press 'a' to toggle)</Text>
      </Box>
    </Box>
  );
}
