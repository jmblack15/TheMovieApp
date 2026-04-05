import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { FONTS, RADIUS, SPACING } from '../../constants/theme';

const OPTIONS = [
  { mode: 'light', label: '☀️', accessLabel: 'Light mode' },
  { mode: 'system', label: '⚙️', accessLabel: 'System mode' },
  { mode: 'dark', label: '🌙', accessLabel: 'Dark mode' },
] as const;

export function ThemeToggle() {
  const { colors, mode, setMode } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {OPTIONS.map((opt) => (
        <Pressable
          key={opt.mode}
          style={[
            styles.option,
            mode === opt.mode && { backgroundColor: colors.accent },
          ]}
          onPress={() => setMode(opt.mode)}
          accessibilityRole="button"
          accessibilityLabel={opt.accessLabel}
          accessibilityState={{ selected: mode === opt.mode }}
          testID={`theme-toggle-${opt.mode}`}
          android_ripple={{ color: 'rgba(255,255,255,0.1)', borderless: false }}
        >
          <Text style={styles.icon}>{opt.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    padding: 3,
    gap: 2,
  },
  option: {
    borderRadius: RADIUS.full,
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
  },
  icon: {
    fontSize: FONTS.sizes.md,
  },
});
