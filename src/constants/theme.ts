export const COLORS = {
  background: '#0D0D1A',
  card: '#1a1a2e',
  border: '#2a2a4a',
  accent: '#E50914',
  gold: '#FFD700',
  textPrimary: '#FFFFFF',
  textSecondary: '#9B9B9B',
  textHint: '#666666',
  offlineAmber: '#B45309',
  offlineAmberLight: '#FEF3C7',
  offlineDot: '#FCD34D',
} as const;

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
