import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { FONTS, RADIUS } from "../../src/constants/theme";
import { useThemeStore } from "../../src/store/themeStore";
import { useWatchlistStore } from "../../src/store/watchlistStore";

interface TabIconProps {
  emoji: string;
  label: string;
  focused: boolean;
  focusedBg: string;
  labelColor: string;
  labelFocusedColor: string;
}

function TabIcon({ emoji, label, focused, focusedBg, labelColor, labelFocusedColor }: TabIconProps) {
  return (
    <View style={styles.iconWrapper}>
      <View style={[styles.iconContainer, focused && { backgroundColor: focusedBg }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={[styles.label, { color: focused ? labelFocusedColor : labelColor }]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const { bottom } = useSafeAreaInsets();
  const items = useWatchlistStore((s) => s.items);
  const colors = useThemeStore((s) => s.colors);
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: 8,
          elevation: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          height: 56 + bottom,
          paddingBottom: bottom > 0 ? bottom : 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              emoji="🎬"
              label={t('home.title')}
              focused={focused}
              focusedBg={colors.accent}
              labelColor={colors.textHint}
              labelFocusedColor={colors.textPrimary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          tabBarBadge: items.length > 0 ? items.length : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.accent },
          tabBarIcon: ({ focused }) => (
            <TabIcon
              emoji="🔖"
              label={t('watchlist.title')}
              focused={focused}
              focusedBg={colors.accent}
              labelColor={colors.textHint}
              labelFocusedColor={colors.textPrimary}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  iconContainer: {
    width: 44,
    height: 28,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: {
    fontSize: 18,
  },
  label: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
  },
});
