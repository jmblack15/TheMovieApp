import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { FilterInput } from '../../src/components/movies/FilterInput';
import { MovieGrid } from '../../src/components/MovieGrid';
import { COLORS, FONTS, SPACING } from '../../src/constants/theme';
import { useMovieFilter } from '../../src/hooks/useMovieFilter';
import { useOfflineStore } from '../../src/store/offlineStore';
import type { Movie } from '../../src/types/index';

const ANDROID_EXTRA_TOP =
  Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0;

export default function HomeScreen() {
  const router = useRouter();
  const loadCachedMovies = useOfflineStore((s) => s.loadCachedMovies);

  const {
    movies,
    letterInput,
    isFiltering,
    isLoading,
    isLoadingFilter,
    isOffline,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefreshing,
    handleLetterChange,
    clearFilter,
  } = useMovieFilter();

  useEffect(() => {
    loadCachedMovies();
  }, [loadCachedMovies]);

  const handleEndReached = useCallback(() => {
    if (!isFiltering && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isFiltering]);

  const handleMoviePress = useCallback((movie: Movie) => {
    router.push({
      pathname: '/movie/[id]',
      params: { id: movie.id, title: movie.title },
    });
  }, [router]);

  const filterEmptyComponent =
    isFiltering && !isLoadingFilter && movies.length === 0 ? (
      <View testID="empty-state" style={styles.emptyState}>
        <Text style={styles.emptyEmoji}>🔍</Text>
        <Text style={styles.emptyTitle}>
          Sin resultados para '{letterInput}'
        </Text>
        <Text style={styles.emptySubtitle}>
          La película debe comenzar con esa letra, tener mínimo 3 géneros y al
          menos 3 actrices y 3 actores en el reparto principal.
        </Text>
      </View>
    ) : isFiltering && isLoadingFilter ? null : undefined;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ExpoStatusBar style="light" />

      <View style={[styles.header, { paddingTop: ANDROID_EXTRA_TOP }]}>
        <Text style={styles.title}>Películas</Text>
        <Text style={styles.subtitle}>Descubre lo más popular</Text>
      </View>

      <FilterInput
        value={letterInput}
        onChangeText={handleLetterChange}
        onClear={clearFilter}
      />

      {isLoadingFilter && (
        <View style={styles.filterLoading}>
          <ActivityIndicator size="small" color={COLORS.textSecondary} />
          <Text style={styles.filterLoadingText}>
            Verificando géneros y reparto...
          </Text>
        </View>
      )}

      <MovieGrid
        movies={movies}
        isOffline={isOffline}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        isRefreshing={isRefreshing}
        onEndReached={handleEndReached}
        onRefresh={refetch}
        onMoviePress={handleMoviePress}
        emptyComponent={filterEmptyComponent}
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
  filterLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  filterLoadingText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.xs,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  emptySubtitle: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
});
