import { create } from 'zustand';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DARK_COLORS, LIGHT_COLORS, type ColorScheme } from '../constants/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeStore {
  mode: ThemeMode;
  colors: ColorScheme;
  isDark: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
  loadTheme: () => Promise<void>;
}

const THEME_KEY = 'app_theme_mode';

function resolveColors(mode: ThemeMode): ColorScheme {
  if (mode === 'system') {
    return Appearance.getColorScheme() === 'dark' ? DARK_COLORS : LIGHT_COLORS;
  }
  return mode === 'dark' ? DARK_COLORS : LIGHT_COLORS;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: 'system',
  colors: resolveColors('system'),
  isDark: Appearance.getColorScheme() === 'dark',

  setMode: async (mode) => {
    const colors = resolveColors(mode);
    const isDark = colors === DARK_COLORS;
    set({ mode, colors, isDark });
    await AsyncStorage.setItem(THEME_KEY, mode);
  },

  loadTheme: async () => {
    try {
      const saved = (await AsyncStorage.getItem(THEME_KEY)) as ThemeMode | null;
      const mode = saved ?? 'system';
      const colors = resolveColors(mode);
      const isDark = colors === DARK_COLORS;
      set({ mode, colors, isDark });
    } catch {
      // keep default
    }
  },
}));
