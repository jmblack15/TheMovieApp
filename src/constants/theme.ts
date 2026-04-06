export const DARK_COLORS = {
  background: "#0A0A10",
  card: "#131320",
  border: "#1E1E30",
  accent: "#6366F1",
  gold: "#F59E0B",
  textPrimary: "#FFFFFF",
  textSecondary: "#8080A0",
  textHint: "#40405A",
  offlineAmber: "#B45309",
  offlineAmberLight: "#FEF3C7",
  offlineDot: "#FCD34D",
  statusBar: "light" as const,
} as const;

export const LIGHT_COLORS = {
  background: "#F6F6FC",
  card: "#FFFFFF",
  border: "#E8E8F2",
  accent: "#6366F1",
  gold: "#D97706",
  textPrimary: "#0A0A10",
  textSecondary: "#555575",
  textHint: "#9090B0",
  offlineAmber: "#B45309",
  offlineAmberLight: "#FEF3C7",
  offlineDot: "#FCD34D",
  statusBar: "dark" as const,
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
  statusBar: "light" | "dark";
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
    regular: "400" as const,
    medium: "500" as const,
    bold: "700" as const,
    black: "900" as const,
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
