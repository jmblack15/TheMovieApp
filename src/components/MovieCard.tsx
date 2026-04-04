import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import type { Movie } from '../types/index';
import { buildPosterUrl, formatRating, formatYear } from '../utils/image';

interface MovieCardProps {
  movie: Movie;
  onPress?: (movie: Movie) => void;
}

export function MovieCard({ movie, onPress }: MovieCardProps) {
  const posterUrl = buildPosterUrl(movie.poster_path, 'medium');

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress?.(movie)}
      activeOpacity={0.7}
    >
      <View style={styles.posterWrapper}>
        {posterUrl ? (
          <Image
            source={{ uri: posterUrl }}
            style={styles.poster}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Text style={styles.placeholderText}>Sin imagen</Text>
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{formatRating(movie.vote_average)}</Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {movie.title}
      </Text>
      <Text style={styles.year}>{formatYear(movie.release_date)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 6,
  },
  posterWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1a1a2e',
    aspectRatio: 2 / 3,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  posterPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2a3e',
  },
  placeholderText: {
    color: '#888',
    fontSize: 12,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 17,
  },
  year: {
    marginTop: 2,
    fontSize: 12,
    color: '#888',
  },
});
