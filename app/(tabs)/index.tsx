import React, { useCallback, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { useMoviesInfinite } from '../../src/hooks/useMovies';
import { useOfflineStore } from '../../src/store/offlineStore';
import { MovieGrid } from '../../src/components/MovieGrid';
import type { Movie } from '../../src/types/index';

export default function HomeScreen() {
  const loadCachedMovies = useOfflineStore((s) => s.loadCachedMovies);

  const {
    movies,
    isOffline,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useMoviesInfinite();

  useEffect(() => {
    loadCachedMovies();
  }, [loadCachedMovies]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleMoviePress = useCallback((movie: Movie) => {
    // Navigate to detail screen when implemented
    console.log('Movie pressed:', movie.id);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Peliculas populares</Text>
      <MovieGrid
        movies={movies}
        isOffline={isOffline}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        onEndReached={handleEndReached}
        onMoviePress={handleMoviePress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 8,
  },
});
