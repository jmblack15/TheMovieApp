import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants/theme';
import type { Movie } from '../../types/index';
import { useWatchlistStore } from '../../store/watchlistStore';

interface WatchlistButtonProps {
  movie: Movie;
  size?: 'default' | 'large';
}

export function WatchlistButton({ movie, size = 'default' }: WatchlistButtonProps) {
  const isInWatchlist = useWatchlistStore((s) => s.isInWatchlist(movie.id));
  const toggleWatchlist = useWatchlistStore((s) => s.toggleWatchlist);

  return (
    <Pressable
      testID={`watchlist-btn-${movie.id}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isInWatchlist }}
      accessibilityLabel={isInWatchlist ? 'Quitar de watchlist' : 'Añadir a watchlist'}
      onPress={() => toggleWatchlist(movie)}
      style={[styles.button, size === 'large' && styles.buttonLarge, isInWatchlist && styles.buttonActive]}
      android_ripple={{ color: 'rgba(255,255,255,0.1)', borderless: false }}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Text style={[styles.label, size === 'large' && styles.labelLarge, isInWatchlist && styles.labelActive]}>
        {isInWatchlist ? '✓ En watchlist' : '+ Watchlist'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLarge: {
    paddingVertical: SPACING.md,
  },
  buttonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },
  labelLarge: {
    fontSize: FONTS.sizes.md,
  },
  labelActive: {
    color: COLORS.textPrimary,
  },
});
