import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { RADIUS, SPACING } from '../../constants/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const OPTIONS: {
  mode: 'light' | 'system' | 'dark';
  icon: IoniconName;
  iconActive: IoniconName;
  accessLabel: string;
}[] = [
  { mode: 'light', icon: 'sunny-outline', iconActive: 'sunny', accessLabel: 'Light mode' },
  { mode: 'system', icon: 'phone-portrait-outline', iconActive: 'phone-portrait', accessLabel: 'System mode' },
  { mode: 'dark', icon: 'moon-outline', iconActive: 'moon', accessLabel: 'Dark mode' },
];

export function ThemeToggle() {
  const { colors, mode, setMode } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {OPTIONS.map((opt) => {
        const active = mode === opt.mode;
        return (
          <Pressable
            key={opt.mode}
            style={[
              styles.option,
              active && { backgroundColor: colors.accent },
            ]}
            onPress={() => setMode(opt.mode)}
            accessibilityRole="button"
            accessibilityLabel={opt.accessLabel}
            accessibilityState={{ selected: active }}
            testID={`theme-toggle-${opt.mode}`}
            android_ripple={{ color: 'rgba(255,255,255,0.1)', borderless: false }}
          >
            <Ionicons
              name={active ? opt.iconActive : opt.icon}
              size={15}
              color={active ? '#FFFFFF' : colors.textSecondary}
            />
          </Pressable>
        );
      })}
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
    padding: SPACING.sm - 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
});
