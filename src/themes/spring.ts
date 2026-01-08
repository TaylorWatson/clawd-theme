import type { ClawdTheme } from './types.js';

export const springTheme: ClawdTheme = {
  name: 'spring',
  displayName: 'Spring',
  description: 'Fresh green Clawd with flowers',
  colors: {
    primary: '#90EE90',
    secondary: '#32CD32',
    accent: '#FFD700',
    decoration: '#FF69B4',
  },
  decoration: {
    left: '\u{1F338}',
    right: '\u{1F33F}',
    spacing: ' ',
  },
  dateRange: {
    start: { month: 3, day: 1 },
    end: { month: 5, day: 31 },
  },
};
