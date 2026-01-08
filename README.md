# Clawd Theme Customizer

Customize your Claude Code mascot with seasonal themes!

## Features

- 6 seasonal Clawd themes: Normal, Winter, Halloween, Valentine's, Spring, Summer
- Auto-seasonal mode that changes themes based on the current date
- Simple `/clawd` command to switch themes
- SessionStart hook to display your themed Clawd at session start

## Installation

```bash
/plugin marketplace add twatson/clawd-theme
/plugin install clawd-theme
```

Or install locally:

```bash
cd ~/.claude/plugins/clawd-theme
npm install
npm run build
```

## Usage

### Switch Themes

```
/clawd normal      # Classic orange Clawd
/clawd winter      # Blue Clawd with snowflakes
/clawd halloween   # Spooky orange/purple with bats and pumpkins
/clawd valentines  # Pink Clawd with hearts
/clawd spring      # Green Clawd with flowers
/clawd summer      # Yellow/cyan Clawd with sun and waves
```

### Auto-Seasonal Mode

Enable auto-seasonal mode to automatically switch themes based on the date:

```
/clawd auto
```

Season schedule:
- Dec 1 - Jan 15: Winter
- Feb 1 - Feb 28: Valentine's
- Mar 1 - May 31: Spring
- Jun 1 - Aug 31: Summer
- Oct 1 - Oct 31: Halloween
- Otherwise: Normal

### View Current Theme

```
/clawd
```

## Theme Previews

### Normal
```
 ▐▛███▜▌
▝▜█████▛▘
  ▘▘ ▝▝
```

### Winter
```
 * ▐▛███▜▌ *
* ▝▜█████▛▘ *
 *  ▘▘ ▝▝  *
```

### Halloween
```
 🦇 ▐▛███▜▌ 🎃
🦇 ▝▜█████▛▘ 🎃
 🦇  ▘▘ ▝▝  🎃
```

## Configuration

Settings are stored in `~/.claude/settings.json`:

```json
{
  "clawdTheme": {
    "theme": "winter",
    "autoSeasonal": false
  }
}
```

## License

MIT
