import type { ClawdTheme } from './types.js';

export const halloweenTheme: ClawdTheme = {
  name: 'halloween',
  displayName: 'Halloween',
  description: 'Spooky orange and purple Clawd',
  colors: {
    primary: '#FF6B00',
    secondary: '#8B00FF',
    accent: '#FF6B00',
    decoration: '#FF6B00',
  },
  decoration: {
    left: '\u{1F987}',
    right: '\u{1F383}',
    spacing: ' ',
  },
  dateRange: {
    start: { month: 10, day: 1 },
    end: { month: 10, day: 31 },
  },
};
