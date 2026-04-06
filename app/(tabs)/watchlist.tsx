import { Ionicons } from '@expo/vector-icons';
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
import { useTranslation } from 'react-i18next';
import { useWatchlistStore } from '../../src/store/watchlistStore';
import { useTheme } from '../../src/hooks/useTheme';
import { buildPosterUrl, formatRating, formatYear } from '../../src/utils/image';
import { FONTS, RADIUS, SPACING } from '../../src/constants/theme';
import type { WatchlistItem } from '../../src/types/index';

export default function WatchlistScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t, i18n } = useTranslation();
  const items = useWatchlistStore((s) => s.items);
  const loadWatchlist = useWatchlistStore((s) => s.loadWatchlist);
  const removeMovie = useWatchlistStore((s) => s.removeMovie);

  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

  const handleRemove = useCallback(
    (item: WatchlistItem) => {
      Alert.alert(
        t('watchlist.removeTitle'),
        t('watchlist.removeMessage', { title: item.movie.title }),
        [
          { text: t('watchlist.cancel'), style: 'cancel' },
          {
            text: t('watchlist.remove'),
            style: 'destructive',
            onPress: () => removeMovie(item.movieId),
          },
        ],
      );
    },
    [removeMovie, t],
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
      const locale = i18n.language === 'es' ? 'es-CO' : 'en-US';
      const addedDate = new Date(item.addedAt).toLocaleDateString(locale, {
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
              <Ionicons name="film-outline" size={24} color={colors.textHint} />
            </View>
          )}

          <View style={styles.info}>
            <Text style={[styles.movieTitle, { color: colors.textPrimary }]} numberOfLines={2}>
              {item.movie.title}
            </Text>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {formatYear(item.movie.release_date)} · ★ {formatRating(item.movie.vote_average)}
            </Text>
            <Text style={[styles.addedDate, { color: colors.textHint }]}>
              {t('watchlist.addedOn', { date: addedDate })}
            </Text>
          </View>

          <Pressable
            testID={`remove-btn-${item.movie.id}`}
            style={[styles.removeBtn, { backgroundColor: colors.border }]}
            onPress={() => handleRemove(item)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={14} color={colors.textSecondary} />
          </Pressable>
        </Pressable>
      );
    },
    [handleRowPress, handleRemove, colors, t, i18n.language],
  );

  return (
    <SafeAreaView
      testID="watchlist-screen"
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {t('watchlist.title')}
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          {t('watchlist.subtitle', { count: items.length })}
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
            <Ionicons name="bookmark-outline" size={48} color={colors.textHint} style={styles.emptyIcon} />
            <Text style={[styles.emptyText, { color: colors.textPrimary }]}>
              {t('watchlist.empty')}
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              {t('watchlist.emptySubtitle')}
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
    letterSpacing: -0.5,
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: SPACING.md,
  },
  poster: {
    width: 60,
    height: 90,
    borderRadius: RADIUS.sm,
  },
  posterFallback: {
    alignItems: 'center',
    justifyContent: 'center',
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
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    gap: SPACING.sm,
  },
  emptyIcon: {
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
  },
  emptySubtitle: {
    fontSize: FONTS.sizes.sm,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
    lineHeight: 18,
  },
});
