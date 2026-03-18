// Theme-aware utility functions for consistent theming across the app
import { useThemeStore } from '@/store/themeStore';

export const getThemeColors = (theme: 'light' | 'dark') => {
  if (theme === 'light') {
    return {
      bg: {
        primary: '#d5dae7',
        secondary: '#070b14',
        tertiary: '#0d111b',
        card: '#0f1419',
        hover: '#151b2e',
      },
      text: {
        primary: '#080303',
        secondary: '#94a3b8',
        tertiary: '#64748b',
      },
      border: '#1e293b',
      shadow: 'rgba(0, 0, 0, 0.3)',
    };
  }

  return {
    bg: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      card: '#ffffff',
      hover: '#f1f5f9',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      tertiary: '#94a3b8',
    },
    border: '#e2e8f0',
    shadow: 'rgba(0, 0, 0, 0.07)',
  };
};

export const useThemeColors = () => {
  const theme = useThemeStore((state) => state.theme);
  return getThemeColors(theme);
};
