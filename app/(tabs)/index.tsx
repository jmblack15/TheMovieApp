import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { FilterInput } from '../../src/components/movies/FilterInput';
import { MovieGrid } from '../../src/components/MovieGrid';
import { ThemeToggle } from '../../src/components/common/ThemeToggle';
import { FONTS, SPACING } from '../../src/constants/theme';
import { useMovieFilter } from '../../src/hooks/useMovieFilter';
import { useTheme } from '../../src/hooks/useTheme';
import { useOfflineStore } from '../../src/store/offlineStore';
import type { Movie } from '../../src/types/index';

const ANDROID_EXTRA_TOP =
  Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0;

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
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
        <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
          Sin resultados para '{letterInput}'
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          La película debe comenzar con esa letra, tener mínimo 3 géneros y al
          menos 3 actrices y 3 actores en el reparto principal.
        </Text>
      </View>
    ) : isFiltering && isLoadingFilter ? null : undefined;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ExpoStatusBar style={colors.statusBar} />

      <View style={[styles.header, { paddingTop: ANDROID_EXTRA_TOP }]}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Películas</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Descubre lo más popular
          </Text>
        </View>
        <ThemeToggle />
      </View>

      <FilterInput
        value={letterInput}
        onChangeText={handleLetterChange}
        onClear={clearFilter}
      />

      {isLoadingFilter && (
        <View style={styles.filterLoading}>
          <ActivityIndicator size="small" color={colors.textSecondary} />
          <Text style={[styles.filterLoadingText, { color: colors.textSecondary }]}>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm + 1,
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
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.xs,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  emptySubtitle: {
    fontSize: FONTS.sizes.sm,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },
});
