import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useMovieCredits, useMovieDetails } from '../../src/hooks/useMovies';
import { useWatchlistStore } from '../../src/store/watchlistStore';
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
      <View style={styles.centered}>
        <ActivityIndicator testID="detail-loading" size="large" color="#E50914" />
      </View>
    );
  }

  if (isError || !movie) {
    return (
      <View testID="detail-error" style={styles.centered}>
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorText}>Could not load movie</Text>
      </View>
    );
  }

  const cast = credits?.cast ?? [];

  return (
    <ScrollView
      testID="detail-screen"
      style={styles.screen}
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
          <Text style={styles.title} numberOfLines={3}>
            {movie.title}
          </Text>
          {!!movie.tagline && (
            <Text style={styles.tagline} numberOfLines={2}>
              {movie.tagline}
            </Text>
          )}
          <View style={styles.badgeRow}>
            <Badge text={`⭐ ${formatRating(movie.vote_average)}`} />
            <Badge text={formatYear(movie.release_date)} />
            {!!movie.runtime && <Badge text={formatRuntime(movie.runtime)} />}
            {!!movie.status && <Badge text={movie.status} />}
          </View>
        </View>
      </View>

      {/* C) Genres */}
      {movie.genres && movie.genres.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genres</Text>
          <View style={styles.genreRow}>
            {movie.genres.map((genre) => (
              <View key={genre.id} style={styles.genrePill}>
                <Text style={styles.genreText}>{genre.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* D) Overview */}
      {!!movie.overview && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overview}>{movie.overview}</Text>
        </View>
      )}

      {/* E) Cast */}
      {(loadingCredits || cast.length > 0) && (
        <View style={[styles.section, styles.castSection]}>
          <Text style={[styles.sectionTitle, styles.castTitle]}>Cast</Text>
          {loadingCredits ? (
            <ActivityIndicator color="#E50914" />
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

function Badge({ text }: { text: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0D0D1A',
  },
  content: {
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D0D1A',
  },
  errorEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  errorText: {
    color: '#9B9B9B',
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
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  tagline: {
    color: '#9B9B9B',
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
    backgroundColor: '#1a1a2e',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#C0C0C0',
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
    color: '#FFFFFF',
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
    backgroundColor: '#1F1F35',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  genreText: {
    color: '#C0C0C0',
    fontSize: 12,
    fontWeight: '500',
  },
  overview: {
    color: '#C0C0C0',
    fontSize: 14,
    lineHeight: 22,
  },
  watchlistWrapper: {
    marginHorizontal: 16,
    marginTop: 28,
  },
});
