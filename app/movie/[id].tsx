import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useMovieCredits, useMovieDetails } from '../../src/hooks/useMovies';
import { useWatchlistStore } from '../../src/store/watchlistStore';
import { useTheme } from '../../src/hooks/useTheme';
import { BackdropHeader } from '../../src/components/movies/BackdropHeader';
import { CastCarousel } from '../../src/components/movies/CastCarousel';
import { WatchlistButton } from '../../src/components/common/WatchlistButton';
import { formatRating, formatRuntime, formatYear } from '../../src/utils/image';
import { FONTS, RADIUS, SPACING } from '../../src/constants/theme';

const POSTER_HEIGHT = 165;
const POSTER_OVERLAP = 48;
const POSTER_WIDTH = 110;
const POSTER_GAP = 12;

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string; title?: string }>();
  const movieId = Number(id);
  const { colors } = useTheme();
  const { t } = useTranslation();

  const navigation = useNavigation();
  const markAsOpened = useWatchlistStore((s) => s.markAsOpened);

  const { data: movie, isLoading, isError } = useMovieDetails(movieId);
  const { data: credits, isLoading: loadingCredits } = useMovieCredits(movieId);

  useEffect(() => {
    markAsOpened(movieId);
  }, [movieId, markAsOpened]);

  useEffect(() => {
    if (movie?.title) {
      navigation.setOptions({ title: movie.title });
    }
  }, [movie?.title, navigation]);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator testID="detail-loading" size="large" color={colors.accent} />
      </View>
    );
  }

  if (isError || !movie) {
    return (
      <View testID="detail-error" style={[styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textHint} />
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>
          {t('common.error')}
        </Text>
      </View>
    );
  }

  const cast = credits?.cast ?? [];

  return (
    <ScrollView
      testID="detail-screen"
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Backdrop + Poster */}
      <BackdropHeader
        backdropPath={movie.backdrop_path}
        posterPath={movie.poster_path}
        title={movie.title}
      />

      {/* Hero info — right of poster */}
      <View style={styles.heroRow}>
        <View style={styles.heroSpacer} />
        <View style={styles.heroInfo}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={3}>
            {movie.title}
          </Text>
          {!!movie.tagline && (
            <Text style={[styles.tagline, { color: colors.textSecondary }]} numberOfLines={2}>
              {movie.tagline}
            </Text>
          )}
          <View style={styles.badgeRow}>
            <Badge text={`★ ${formatRating(movie.vote_average)}`} colors={colors} highlight />
            <Badge text={formatYear(movie.release_date)} colors={colors} />
            {!!movie.runtime && <Badge text={formatRuntime(movie.runtime)} colors={colors} />}
          </View>
        </View>
      </View>

      {/* Genres */}
      {movie.genres && movie.genres.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t('detail.genres')}
          </Text>
          <View style={styles.genreRow}>
            {movie.genres.map((genre) => (
              <View
                key={genre.id}
                style={[
                  styles.genrePill,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.genreText, { color: colors.textSecondary }]}>
                  {genre.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Overview */}
      {!!movie.overview && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t('detail.overview')}
          </Text>
          <Text style={[styles.overview, { color: colors.textSecondary }]}>{movie.overview}</Text>
        </View>
      )}

      {/* Cast */}
      {(loadingCredits || cast.length > 0) && (
        <View style={[styles.section, styles.castSection]}>
          <Text style={[styles.sectionTitle, styles.castTitle, { color: colors.textPrimary }]}>
            {t('detail.cast')}
          </Text>
          {loadingCredits ? (
            <ActivityIndicator color={colors.accent} />
          ) : (
            <CastCarousel cast={cast} />
          )}
        </View>
      )}

      {/* Watchlist button */}
      <View style={styles.watchlistWrapper}>
        <WatchlistButton movie={movie} size="large" />
      </View>
    </ScrollView>
  );
}

function Badge({
  text,
  colors,
  highlight,
}: {
  text: string;
  colors: { card: string; textSecondary: string; gold: string };
  highlight?: boolean;
}) {
  return (
    <View style={[styles.badge, { backgroundColor: colors.card }]}>
      <Text
        style={[
          styles.badgeText,
          { color: highlight ? colors.gold : colors.textSecondary },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingBottom: 48,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  errorText: {
    fontSize: FONTS.sizes.md,
  },
  heroRow: {
    flexDirection: 'row',
    marginTop: -(POSTER_HEIGHT - POSTER_OVERLAP),
    paddingHorizontal: SPACING.lg,
  },
  heroSpacer: {
    width: POSTER_WIDTH + POSTER_GAP,
  },
  heroInfo: {
    flex: 1,
  },
  title: {
    fontSize: FONTS.sizes.lg + 2,
    fontWeight: FONTS.weights.black,
    letterSpacing: -0.3,
  },
  tagline: {
    fontSize: FONTS.sizes.sm,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
  badge: {
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },
  section: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  castSection: {
    paddingHorizontal: 0,
  },
  castTitle: {
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.sm,
    letterSpacing: -0.2,
  },
  genreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  genrePill: {
    borderRadius: RADIUS.full,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 1,
  },
  genreText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  overview: {
    fontSize: FONTS.sizes.md,
    lineHeight: 22,
  },
  watchlistWrapper: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.xl + SPACING.sm,
  },
});
