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
import { buildPosterUrl, formatRating, formatYear } from '../../src/utils/image';
import { COLORS, FONTS, RADIUS, SPACING } from '../../src/constants/theme';
import type { WatchlistItem } from '../../src/types/index';

export default function WatchlistScreen() {
  const router = useRouter();
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
          style={styles.row}
          onPress={() => handleRowPress(item)}
          android_ripple={{ color: 'rgba(255,255,255,0.05)' }}
        >
          {posterUrl ? (
            <Image
              source={{ uri: posterUrl ?? undefined }}
              style={styles.poster}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.poster, styles.posterFallback]}>
              <Text style={styles.posterFallbackEmoji}>🎬</Text>
            </View>
          )}

          <View style={styles.info}>
            <Text style={styles.movieTitle} numberOfLines={2}>
              {item.movie.title}
            </Text>
            <Text style={styles.meta}>
              {formatYear(item.movie.release_date)} · ⭐{' '}
              {formatRating(item.movie.vote_average)}
            </Text>
            <Text style={styles.addedDate}>Agregado: {addedDate}</Text>
          </View>

          <Pressable
            testID={`remove-btn-${item.movie.id}`}
            style={styles.removeBtn}
            onPress={() => handleRemove(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.removeText}>✕</Text>
          </Pressable>
        </Pressable>
      );
    },
    [handleRowPress, handleRemove],
  );

  return (
    <SafeAreaView testID="watchlist-screen" style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Watchlist</Text>
        <Text style={styles.headerSubtitle}>
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
            <Text style={styles.emptyText}>Tu watchlist está vacía</Text>
          </View>
        }
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
  headerTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.sm + 1,
    color: COLORS.textSecondary,
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
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
  },
  poster: {
    width: 64,
    height: 96,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.card,
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
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
  meta: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
  },
  addedDate: {
    color: COLORS.textHint,
    fontSize: FONTS.sizes.xs + 1,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: COLORS.textSecondary,
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
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
  },
});
