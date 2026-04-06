import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../hooks/useTheme';
import { FONTS, RADIUS, SPACING } from '../../constants/theme';
import type { Movie } from '../../types/index';
import { buildPosterUrl, formatRating, formatYear } from '../../utils/image';

interface MovieCardProps {
  movie: Movie;
  onPress?: (movie: Movie) => void;
}

export function MovieCard({ movie, onPress }: MovieCardProps) {
  const { colors } = useTheme();
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
      <View style={[styles.posterWrapper, { backgroundColor: colors.card }]}>
        {posterUrl ? (
          <Image
            source={{ uri: posterUrl ?? undefined }}
            style={styles.poster}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View testID="poster-placeholder" style={[styles.posterPlaceholder, { backgroundColor: colors.card }]}>
            <Ionicons name="film-outline" size={32} color={colors.textHint} />
          </View>
        )}

        <View style={styles.gradientOverlay} />

        <View style={styles.ratingBadge}>
          <Text style={[styles.ratingText, { color: colors.gold }]}>
            ⭐ {formatRating(movie.vote_average)}
          </Text>
        </View>
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
        {movie.title}
      </Text>
      <Text style={[styles.year, { color: colors.textSecondary }]}>
        {formatYear(movie.release_date)}
      </Text>
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
    aspectRatio: 2 / 3,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
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
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: SPACING.xs + 2,
    right: SPACING.xs + 2,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.xs + 1,
    paddingVertical: 2,
  },
  ratingText: {
    fontSize: FONTS.sizes.xs + 1,
    fontWeight: FONTS.weights.bold,
  },
  title: {
    marginTop: SPACING.xs + 2,
    fontSize: FONTS.sizes.sm + 1,
    fontWeight: FONTS.weights.bold,
    lineHeight: 17,
    minHeight: 34,
  },
  year: {
    marginTop: 2,
    fontSize: FONTS.sizes.xs + 1,
  },
});
