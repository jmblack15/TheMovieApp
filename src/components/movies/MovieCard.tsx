import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { COLORS, FONTS, RADIUS, SPACING } from '../../constants/theme';
import type { Movie } from '../../types/index';
import { buildPosterUrl, formatRating, formatYear } from '../../utils/image';

interface MovieCardProps {
  movie: Movie;
  onPress?: (movie: Movie) => void;
}

export function MovieCard({ movie, onPress }: MovieCardProps) {
  const posterUrl = buildPosterUrl(movie.poster_path, 'medium');

  return (
    <Pressable
      testID={`movie-card-${movie.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${movie.title}, ${formatYear(movie.release_date)}`}
      style={styles.container}
      onPress={() => onPress?.(movie)}
      android_ripple={{ color: 'rgba(255,255,255,0.1)', borderless: false }}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View style={styles.posterWrapper}>
        {posterUrl ? (
          <Image
            source={{ uri: posterUrl ?? undefined }}
            style={styles.poster}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Text style={styles.placeholderEmoji}>🎬</Text>
          </View>
        )}

        <View style={styles.gradientOverlay} />

        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {formatRating(movie.vote_average)}</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {movie.title}
      </Text>
      <Text style={styles.year}>{formatYear(movie.release_date)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: SPACING.xs + 2,
  },
  posterWrapper: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
    aspectRatio: 2 / 3,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  posterPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16213e',
  },
  placeholderEmoji: {
    fontSize: 32,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: SPACING.xs + 2,
    right: SPACING.xs + 2,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.xs + 1,
    paddingVertical: 2,
  },
  ratingText: {
    color: COLORS.gold,
    fontSize: FONTS.sizes.xs + 1,
    fontWeight: FONTS.weights.bold,
  },
  title: {
    marginTop: SPACING.xs + 2,
    fontSize: FONTS.sizes.sm + 1,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    lineHeight: 17,
    minHeight: 34,
  },
  year: {
    marginTop: 2,
    fontSize: FONTS.sizes.xs + 1,
    color: COLORS.textSecondary,
  },
});
