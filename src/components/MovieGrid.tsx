import { Ionicons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { FONTS, SPACING } from '../constants/theme';
import type { Movie } from '../types/index';
import { OfflineBanner } from './common/OfflineBanner';
import { MovieCard } from './movies/MovieCard';

interface MovieGridProps {
  movies: Movie[];
  isOffline: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isRefreshing: boolean;
  onEndReached: () => void;
  onRefresh: () => void;
  onMoviePress?: (movie: Movie) => void;
  emptyComponent?: React.ReactElement | null;
}

export function MovieGrid({
  movies,
  isOffline,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  isRefreshing,
  onEndReached,
  onRefresh,
  onMoviePress,
  emptyComponent,
}: MovieGridProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();

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
      <View testID="loading-state" style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <FlatList
      testID="movies-list"
      data={movies}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={2}
      contentContainerStyle={styles.list}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={colors.accent}
          colors={[colors.accent]}
        />
      }
      ListHeaderComponent={isOffline ? <OfflineBanner /> : null}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator style={styles.footer} color={colors.accent} />
        ) : null
      }
      ListEmptyComponent={
        emptyComponent !== undefined ? emptyComponent : (
          <View testID="empty-state" style={styles.centered}>
            <Ionicons name="film-outline" size={48} color={colors.textHint} style={styles.emptyIcon} />
            <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
              {t('common.noMovies')}
            </Text>
          </View>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: SPACING.xs + 2,
    paddingBottom: SPACING.xl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    marginBottom: SPACING.md,
  },
  footer: {
    paddingVertical: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.xs,
  },
});
