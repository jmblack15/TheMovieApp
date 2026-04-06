import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { FONTS, RADIUS, SPACING } from "../constants/theme";
import { useTheme } from "../hooks/useTheme";
import { LanguageToggle } from "./common/LanguageToggle";
import { ThemeToggle } from "./common/ThemeToggle";

export const SettingsMenu = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <ActionSheet
      id="settings-sheet"
      gestureEnabled={true}
      indicatorStyle={[styles.indicator, { backgroundColor: colors.textHint }]}
      containerStyle={[
        styles.sheetContainer,
        { backgroundColor: colors.card, borderTopColor: colors.border },
      ]}
    >
      <View style={[styles.mainContainer, { paddingBottom: SPACING.xxl }]}>
        <Text style={[styles.menuTitle, { color: colors.textPrimary }]}>
          {t("settings.system")}
        </Text>

        <View style={styles.content}>
          <View style={styles.controlWrapper}>
            <LanguageToggle />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.controlWrapper}>
            <ThemeToggle />
          </View>
        </View>
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    borderTopWidth: 1,
  },
  indicator: {
    width: 40,
    height: 4,
    marginTop: SPACING.md,
    borderRadius: RADIUS.full,
  },
  mainContainer: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
  },
  menuTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    textAlign: "center",
    marginBottom: SPACING.xl,
    marginTop: SPACING.sm,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: SPACING.md,
  },
  controlWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  divider: {
    width: 1,
    height: 40,
  },
});
