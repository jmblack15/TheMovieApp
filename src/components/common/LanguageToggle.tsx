import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage, type SupportedLanguage } from '../../i18n';
import { useTheme } from '../../hooks/useTheme';
import { FONTS, RADIUS, SPACING } from '../../constants/theme';

const OPTIONS: { lang: SupportedLanguage; label: string }[] = [
  { lang: 'en', label: '🇺🇸' },
  { lang: 'es', label: '🇪🇸' },
];

export function LanguageToggle() {
  const { colors } = useTheme();
  const { i18n } = useTranslation();
  const current = getCurrentLanguage();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {OPTIONS.map((opt) => (
        <Pressable
          key={opt.lang}
          style={[
            styles.option,
            current === opt.lang && { backgroundColor: colors.accent },
          ]}
          onPress={() => changeLanguage(opt.lang)}
          accessibilityRole="button"
          accessibilityLabel={
            opt.lang === 'en' ? 'Switch to English' : 'Cambiar a Español'
          }
          accessibilityState={{ selected: current === opt.lang }}
          testID={`lang-toggle-${opt.lang}`}
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
