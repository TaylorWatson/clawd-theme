import type { ClawdTheme } from './types.js';

export const winterTheme: ClawdTheme = {
  name: 'winter',
  displayName: 'Winter',
  description: 'Blue Clawd with snowflakes',
  colors: {
    primary: '#7B9EC8',
    secondary: '#5B7EA8',
    accent: '#FFFFFF',
    decoration: '#FFFFFF',
  },
  decoration: {
    left: '*',
    right: '*',
    spacing: ' ',
  },
  dateRange: {
    start: { month: 12, day: 1 },
    end: { month: 1, day: 15 },
  },
};
