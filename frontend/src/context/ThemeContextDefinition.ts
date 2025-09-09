import { createContext } from 'react';

type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: 'light' | 'dark';
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;
    danger: string;
    dangerHover: string;
    success: string;
    warning: string;
    background: string;
    surface: string;
    border: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    priority: {
      high: string;
      highBg: string;
      medium: string;
      mediumBg: string;
      low: string;
      lowBg: string;
    };
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);