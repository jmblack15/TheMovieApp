import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FONTS, RADIUS, SPACING } from "../../constants/theme";
import { useTheme } from "../../hooks/useTheme";
import { changeLanguage, type SupportedLanguage } from "../../i18n";

const OPTIONS: { lang: SupportedLanguage; label: string }[] = [
  { lang: "en", label: "EN" },
  { lang: "es", label: "ES" },
];

export function LanguageToggle() {
  const { colors } = useTheme();
  const { i18n } = useTranslation();
  const current = i18n.language as SupportedLanguage;
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {OPTIONS.map((opt) => {
        const active = current === opt.lang;
        return (
          <Pressable
            key={opt.lang}
            style={[
              styles.option,
              active && { backgroundColor: colors.accent },
            ]}
            onPress={() => changeLanguage(opt.lang)}
            accessibilityRole="button"
            accessibilityLabel={
              opt.lang === "en" ? "Switch to English" : "Cambiar a Español"
            }
            accessibilityState={{ selected: active }}
            testID={`lang-toggle-${opt.lang}`}
            android_ripple={{
              color: "rgba(255,255,255,0.1)",
              borderless: false,
            }}
          >
            <Text
              style={[
                styles.label,
                { color: active ? "#FFFFFF" : colors.textSecondary },
              ]}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: RADIUS.full,
    borderWidth: 1,
    padding: 3,
    gap: 2,
  },
  option: {
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 32,
  },
  label: {
    fontSize: FONTS.sizes.xs + 1,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 0.5,
  },
});
