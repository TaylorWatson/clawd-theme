import React, { useState, useCallback } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { Preview } from './Preview.js';
import { ThemeSelector } from './ThemeSelector.js';
import { loadClawdConfig, saveClawdConfig } from '../utils/config.js';
import type { ThemeName } from '../themes/index.js';

export function App(): React.ReactElement {
  const { exit } = useApp();
  const initialConfig = loadClawdConfig();

  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(
    initialConfig.theme
  );
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

  return (
    <Box flexDirection="column" padding={1}>
      <Box borderStyle="round" borderColor="cyan" paddingX={2}>
        <Text bold color="cyan">
          Clawd Theme Customizer
        </Text>
      </Box>

      <Preview themeName={selectedTheme} />

      <ThemeSelector
        selectedTheme={selectedTheme}
        onSelect={setSelectedTheme}
        autoSeasonal={autoSeasonal}
        onToggleAuto={handleToggleAuto}
      />

      <Box marginTop={2}>
        <Text dimColor>
          [Enter] Save  [Esc/q] Cancel  [a] Toggle auto-seasonal
        </Text>
      </Box>

      {saved && (
        <Box marginTop={1}>
          <Text color="green">Settings saved!</Text>
        </Box>
      )}
    </Box>
  );
}
