import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { Movie } from '../types/index';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  isOffline: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onEndReached: () => void;
  onMoviePress?: (movie: Movie) => void;
}

export function MovieGrid({
  movies,
  isOffline,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onEndReached,
  onMoviePress,
}: MovieGridProps) {
  const renderItem = useCallback(
    ({ item }: { item: Movie }) => (
      <MovieCard movie={item} onPress={onMoviePress} />
    ),
    [onMoviePress],
  );

  const keyExtractor = useCallback((item: Movie) => String(item.id), []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      onEndReached();
    }
  }, [hasNextPage, isFetchingNextPage, onEndReached]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <FlatList
      data={movies}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={2}
      contentContainerStyle={styles.list}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={
        isOffline ? (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>Sin conexion — mostrando cache</Text>
          </View>
        ) : null
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator style={styles.footer} color="#E50914" />
        ) : null
      }
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={styles.emptyText}>
            {isOffline ? 'No hay peliculas en cache' : 'No hay peliculas disponibles'}
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 6,
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  offlineBanner: {
    backgroundColor: '#3a2a00',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  offlineText: {
    color: '#FFB300',
    fontSize: 13,
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 16,
  },
  emptyText: {
    color: '#888',
    fontSize: 15,
  },
});
