export const TMDB_BASE_URL =
  process.env.EXPO_PUBLIC_TMDB_BASE_URL ?? 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const QUERY_KEYS = {
  moviesInfinite: ['movies', 'infinite'] as const,
  movieDetail: (id: number) => ['movie', id] as const,
  movieDetails: (id: number) => ['movie', 'details', id] as const,
  movieCredits: (id: number) => ['movie', 'credits', id] as const,
} as const;

export const PAGINATION = {
  initialPage: 1,
  pageSize: 20,
} as const;

export const FILTER = {
  sortBy: 'popularity.desc',
  language: 'es-ES',
} as const;

export const IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original',
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original',
  },
} as const;

export const STORAGE_KEYS = {
  cachedMovies: 'cached_movies',
  lastSync: 'last_sync',
  genres: 'cached_genres',
  watchlist: 'watchlist',
} as const;

import { t } from 'i18next';

export const WATCHLIST = {
  notificationDelayMs: 3 * 60 * 1000, // 3 minutes
  notificationTitle: () => t('notifications.title'),
  notificationBody: (movieName: string) => t('notifications.body', { movieName }),
};
