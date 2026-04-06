import { useThemeStore } from '../store/themeStore';

export function useTheme() {
  const colors = useThemeStore((s) => s.colors);
  const isDark = useThemeStore((s) => s.isDark);
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  return { colors, isDark, mode, setMode };
}
