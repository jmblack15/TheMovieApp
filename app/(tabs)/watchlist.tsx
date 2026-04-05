import React, { useCallback, useEffect } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useWatchlistStore } from '../../src/store/watchlistStore';
import { useTheme } from '../../src/hooks/useTheme';
import { buildPosterUrl, formatRating, formatYear } from '../../src/utils/image';
import { FONTS, RADIUS, SPACING } from '../../src/constants/theme';
import type { WatchlistItem } from '../../src/types/index';

export default function WatchlistScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const items = useWatchlistStore((s) => s.items);
  const loadWatchlist = useWatchlistStore((s) => s.loadWatchlist);
  const removeMovie = useWatchlistStore((s) => s.removeMovie);

  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

  const handleRemove = useCallback(
    (item: WatchlistItem) => {
      Alert.alert(
        'Quitar de watchlist',
        `¿Quitar "${item.movie.title}" de tu watchlist?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Quitar',
            style: 'destructive',
            onPress: () => removeMovie(item.movieId),
          },
        ],
      );
    },
    [removeMovie],
  );

  const handleRowPress = useCallback(
    (item: WatchlistItem) => {
      router.push({
        pathname: '/movie/[id]',
        params: { id: item.movieId, title: item.movie.title },
      });
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: WatchlistItem }) => {
      const posterUrl = buildPosterUrl(item.movie.poster_path, 'small');
      const addedDate = new Date(item.addedAt).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'short',
      });

      return (
        <Pressable
          style={[styles.row, { borderBottomColor: colors.border }]}
          onPress={() => handleRowPress(item)}
          android_ripple={{ color: 'rgba(255,255,255,0.05)' }}
        >
          {posterUrl ? (
            <Image
              source={{ uri: posterUrl ?? undefined }}
              style={[styles.poster, { backgroundColor: colors.card }]}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.poster, styles.posterFallback, { backgroundColor: colors.card }]}>
              <Text style={styles.posterFallbackEmoji}>🎬</Text>
            </View>
          )}

          <View style={styles.info}>
            <Text style={[styles.movieTitle, { color: colors.textPrimary }]} numberOfLines={2}>
              {item.movie.title}
            </Text>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {formatYear(item.movie.release_date)} · ⭐{' '}
              {formatRating(item.movie.vote_average)}
            </Text>
            <Text style={[styles.addedDate, { color: colors.textHint }]}>
              Agregado: {addedDate}
            </Text>
          </View>

          <Pressable
            testID={`remove-btn-${item.movie.id}`}
            style={[styles.removeBtn, { backgroundColor: colors.border }]}
            onPress={() => handleRemove(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.removeText, { color: colors.textSecondary }]}>✕</Text>
          </Pressable>
        </Pressable>
      );
    },
    [handleRowPress, handleRemove, colors],
  );

  return (
    <SafeAreaView
      testID="watchlist-screen"
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Mi Watchlist</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          {items.length} película{items.length !== 1 ? 's' : ''} por ver
        </Text>
      </View>

      <FlatList
        testID="watchlist-list"
        data={items}
        keyExtractor={(item) => String(item.movieId)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View testID="watchlist-empty" style={styles.empty}>
            <Text style={styles.emptyEmoji}>🎞️</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Tu watchlist está vacía
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.sm + 1,
    marginTop: SPACING.xs,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    gap: SPACING.md,
  },
  poster: {
    width: 64,
    height: 96,
    borderRadius: RADIUS.sm,
  },
  posterFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterFallbackEmoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    gap: SPACING.xs,
  },
  movieTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
  meta: {
    fontSize: FONTS.sizes.sm,
  },
  addedDate: {
    fontSize: FONTS.sizes.xs + 1,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: SPACING.md,
  },
  emptyEmoji: {
    fontSize: 56,
  },
  emptyText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
  },
});
