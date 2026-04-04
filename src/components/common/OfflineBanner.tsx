import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants/theme';
import { useOfflineStore } from '../../store/offlineStore';

function formatRelativeTime(ts: number): string {
  const minutes = Math.floor((Date.now() - ts) / 60000);
  if (minutes < 60) return `hace ${minutes} min`;
  return `hace ${Math.floor(minutes / 60)} h`;
}

export function OfflineBanner() {
  const lastSync = useOfflineStore((s) => s.lastSync);
  const opacity = useRef(new Animated.Value(1)).current;

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
    <View testID="offline-banner" style={styles.container}>
      <Animated.View style={[styles.dot, { opacity }]} />
      <Text style={styles.icon}>📡</Text>
      <View style={styles.textWrapper}>
        <Text style={styles.text}>Sin conexión — mostrando caché</Text>
        {lastSync !== null && (
          <Text style={styles.syncText}>
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
    borderColor: COLORS.offlineAmber,
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
    backgroundColor: COLORS.offlineDot,
  },
  icon: {
    fontSize: FONTS.sizes.md,
  },
  textWrapper: {
    flex: 1,
  },
  text: {
    color: COLORS.offlineAmberLight,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  syncText: {
    color: COLORS.offlineAmber,
    fontSize: FONTS.sizes.xs,
    marginTop: 2,
  },
});
