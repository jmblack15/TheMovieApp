import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, FONTS, RADIUS } from "../../src/constants/theme";

interface TabIconProps {
  emoji: string;
  label: string;
  focused: boolean;
}

function TabIcon({ emoji, label, focused }: TabIconProps) {
  return (
    <View style={styles.iconWrapper}>
      <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  const { bottom } = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 56 + bottom,
            paddingBottom: bottom > 0 ? bottom : 8,
          },
        ],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🎬" label="Inicio" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    elevation: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
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
  iconContainerFocused: {
    backgroundColor: COLORS.accent,
  },
  emoji: {
    fontSize: 18,
  },
  label: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textHint,
  },
  labelFocused: {
    color: COLORS.textPrimary,
    fontWeight: FONTS.weights.bold,
  },
});
