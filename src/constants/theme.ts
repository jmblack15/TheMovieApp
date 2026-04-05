export const DARK_COLORS = {
  background: '#0D0D1A',
  card: '#1a1a2e',
  border: '#2a2a4a',
  accent: '#E50914',
  gold: '#FFD700',
  textPrimary: '#FFFFFF',
  textSecondary: '#9B9B9B',
  textHint: '#555555',
  offlineAmber: '#B45309',
  offlineAmberLight: '#FEF3C7',
  offlineDot: '#FCD34D',
  statusBar: 'light' as const,
} as const;

export const LIGHT_COLORS = {
  background: '#F5F5F5',
  card: '#FFFFFF',
  border: '#E0E0E0',
  accent: '#E50914',
  gold: '#F59E0B',
  textPrimary: '#0D0D1A',
  textSecondary: '#555555',
  textHint: '#9B9B9B',
  offlineAmber: '#B45309',
  offlineAmberLight: '#FEF3C7',
  offlineDot: '#FCD34D',
  statusBar: 'dark' as const,
} as const;

export type ColorScheme = {
  background: string;
  card: string;
  border: string;
  accent: string;
  gold: string;
  textPrimary: string;
  textSecondary: string;
  textHint: string;
  offlineAmber: string;
  offlineAmberLight: string;
  offlineDot: string;
  statusBar: 'light' | 'dark';
};

export const FONTS = {
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    bold: '700' as const,
    black: '900' as const,
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;
