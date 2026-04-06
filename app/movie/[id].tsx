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
        <Text style={styles.errorEmoji}>😕</Text>
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
      {/* A) Backdrop + Poster */}
      <BackdropHeader
        backdropPath={movie.backdrop_path}
        posterPath={movie.poster_path}
        title={movie.title}
      />

      {/* B) Hero info — right of poster, same row */}
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
            <Badge text={`⭐ ${formatRating(movie.vote_average)}`} colors={colors} />
            <Badge text={formatYear(movie.release_date)} colors={colors} />
            {!!movie.runtime && <Badge text={formatRuntime(movie.runtime)} colors={colors} />}
            {!!movie.status && <Badge text={movie.status} colors={colors} />}
          </View>
        </View>
      </View>

      {/* C) Genres */}
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

      {/* D) Overview */}
      {!!movie.overview && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t('detail.overview')}
          </Text>
          <Text style={[styles.overview, { color: colors.textSecondary }]}>{movie.overview}</Text>
        </View>
      )}

      {/* E) Cast */}
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

      {/* F) Watchlist button */}
      <View style={styles.watchlistWrapper}>
        <WatchlistButton movie={movie} size="large" />
      </View>
    </ScrollView>
  );
}

function Badge({ text, colors }: { text: string; colors: { card: string; textSecondary: string } }) {
  return (
    <View style={[styles.badge, { backgroundColor: colors.card }]}>
      <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
  },
  heroRow: {
    flexDirection: 'row',
    marginTop: -(POSTER_HEIGHT - POSTER_OVERLAP),
    paddingHorizontal: 16,
  },
  heroSpacer: {
    width: POSTER_WIDTH + POSTER_GAP,
  },
  heroInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  tagline: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 6,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  castSection: {
    paddingHorizontal: 0,
  },
  castTitle: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  genreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genrePill: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  genreText: {
    fontSize: 12,
    fontWeight: '500',
  },
  overview: {
    fontSize: 14,
    lineHeight: 22,
  },
  watchlistWrapper: {
    marginHorizontal: 16,
    marginTop: 28,
  },
});
