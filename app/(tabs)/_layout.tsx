import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "../../src/store/themeStore";
import { useWatchlistStore } from "../../src/store/watchlistStore";

export default function TabLayout() {
  const { bottom } = useSafeAreaInsets();
  const items = useWatchlistStore((s) => s.items);
  const colors = useThemeStore((s) => s.colors);
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textHint,
        tabBarLabelStyle: styles.label,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          height: 56 + bottom,
          paddingBottom: bottom > 0 ? bottom : 8,
          paddingTop: 6,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("home.title"),
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "film" : "film-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: t("watchlist.title"),
          tabBarBadge: items.length > 0 ? items.length : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.accent,
            color: "#FFFFFF",
            fontSize: 10,
          },
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "bookmark" : "bookmark-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: -2,
  },
});
