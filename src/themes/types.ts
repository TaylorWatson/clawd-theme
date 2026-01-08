export interface ThemeColors {
  primary: string;
  secondary: string;
  accent?: string;
  decoration?: string;
}

export interface ThemeDecoration {
  left: string;
  right: string;
  spacing: string;
}

export interface ClawdTheme {
  name: string;
  displayName: string;
  description: string;
  colors: ThemeColors;
  decoration?: ThemeDecoration;
  dateRange?: {
    start: { month: number; day: number };
    end: { month: number; day: number };
  };
}

export type ThemeName =
  | 'normal'
  | 'winter'
  | 'halloween'
  | 'valentines'
  | 'spring'
  | 'summer';

export interface ClawdConfig {
  theme: ThemeName;
  autoSeasonal: boolean;
  customColors?: ThemeColors;
}
