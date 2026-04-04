import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { FilterInput } from '../../src/components/movies/FilterInput';
import { MovieGrid } from '../../src/components/MovieGrid';
import { COLORS, FONTS, SPACING } from '../../src/constants/theme';
import { useMoviesInfinite } from '../../src/hooks/useMovies';
import { useOfflineStore } from '../../src/store/offlineStore';
import type { Movie } from '../../src/types/index';

const ANDROID_EXTRA_TOP =
  Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0;

export default function HomeScreen() {
  const router = useRouter();
  const [filterText, setFilterText] = useState('');
  const loadCachedMovies = useOfflineStore((s) => s.loadCachedMovies);

  const {
    movies,
    isOffline,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefreshing,
    refetch,
  } = useMoviesInfinite();

  useEffect(() => {
    loadCachedMovies();
  }, [loadCachedMovies]);

  const filteredMovies = useMemo(() => {
    const query = filterText.trim().toLowerCase();
    if (!query) return movies;
    return movies.filter((m) => m.title.toLowerCase().includes(query));
  }, [movies, filterText]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleMoviePress = useCallback((movie: Movie) => {
    router.push({
      pathname: '/movie/[id]',
      params: { id: movie.id, title: movie.title },
    });
  }, [router]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ExpoStatusBar style="light" />

      <View style={[styles.header, { paddingTop: ANDROID_EXTRA_TOP }]}>
        <Text style={styles.title}>Películas</Text>
        <Text style={styles.subtitle}>Descubre lo más popular</Text>
      </View>

      <FilterInput value={filterText} onChangeText={setFilterText} />

      <MovieGrid
        movies={filteredMovies}
        isOffline={isOffline}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        isRefreshing={isRefreshing}
        onEndReached={handleEndReached}
        onRefresh={refetch}
        onMoviePress={handleMoviePress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm + 1,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});
