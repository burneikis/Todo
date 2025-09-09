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

export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    secondary: '#6b7280',
    secondaryHover: '#4b5563',
    danger: '#ef4444',
    dangerHover: '#dc2626',
    success: '#10b981',
    warning: '#f59e0b',
    background: '#f9fafb',
    surface: '#ffffff',
    border: '#d1d5db',
    text: '#111827',
    textSecondary: '#374151',
    textMuted: '#6b7280',
    priority: {
      high: '#dc2626',
      highBg: '#fee2e2',
      medium: '#d97706',
      mediumBg: '#fef3c7',
      low: '#16a34a',
      lowBg: '#dcfce7',
    },
  },
  shadows: {
    small: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    primary: '#60a5fa',
    primaryHover: '#3b82f6',
    secondary: '#9ca3af',
    secondaryHover: '#d1d5db',
    danger: '#f87171',
    dangerHover: '#ef4444',
    success: '#34d399',
    warning: '#fbbf24',
    background: '#111827',
    surface: '#1f2937',
    border: '#374151',
    text: '#f9fafb',
    textSecondary: '#d1d5db',
    textMuted: '#9ca3af',
    priority: {
      high: '#f87171',
      highBg: '#7f1d1d',
      medium: '#fbbf24',
      mediumBg: '#78350f',
      low: '#34d399',
      lowBg: '#064e3b',
    },
  },
  shadows: {
    small: '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    large: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
  },
};