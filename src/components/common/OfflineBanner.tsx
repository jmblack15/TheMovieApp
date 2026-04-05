import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { FONTS, RADIUS, SPACING } from '../../constants/theme';
import { useOfflineStore } from '../../store/offlineStore';

function formatRelativeTime(ts: number): string {
  const minutes = Math.floor((Date.now() - ts) / 60000);
  if (minutes < 60) return `hace ${minutes} min`;
  return `hace ${Math.floor(minutes / 60)} h`;
}

export function OfflineBanner() {
  const isOnline = useOfflineStore((s) => s.isOnline);
  const lastSync = useOfflineStore((s) => s.lastSync);
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(1)).current;

  if (isOnline) return null;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <View
      testID="offline-banner"
      style={[
        styles.container,
        { borderColor: colors.offlineAmber },
      ]}
    >
      <Animated.View
        style={[styles.dot, { opacity, backgroundColor: colors.offlineDot }]}
      />
      <Text style={styles.icon}>📡</Text>
      <View style={styles.textWrapper}>
        <Text style={[styles.text, { color: colors.offlineAmberLight }]}>
          Sin conexión — mostrando caché
        </Text>
        {lastSync !== null && (
          <Text style={[styles.syncText, { color: colors.offlineAmber }]}>
            Última sync: {formatRelativeTime(lastSync)}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D1F00',
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginHorizontal: SPACING.sm,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
  },
  icon: {
    fontSize: FONTS.sizes.md,
  },
  textWrapper: {
    flex: 1,
  },
  text: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  syncText: {
    fontSize: FONTS.sizes.xs,
    marginTop: 2,
  },
});
