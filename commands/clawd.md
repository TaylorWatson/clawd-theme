---
description: Customize Clawd mascot appearance and theme
argument-hint: [theme|config]
allowed-tools: Bash(node:*)
---

# Clawd Theme Customization

Manage your Clawd mascot theme and appearance.

## Arguments

- `normal` - Switch to classic orange Clawd
- `winter` - Switch to blue snowflake Clawd
- `halloween` - Switch to spooky orange/purple Clawd
- `valentines` - Switch to pink hearts Clawd
- `spring` - Switch to green/yellow flower Clawd
- `summer` - Switch to sunny yellow/cyan Clawd
- `auto` - Enable auto-seasonal mode (changes with seasons)
- `config` - Open the configuration TUI
- No argument - Show current theme and available options

Run the theme command:
!node ${CLAUDE_PLUGIN_ROOT}/dist/index.js $ARGUMENTS
