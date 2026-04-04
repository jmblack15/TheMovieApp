import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addToWatchlist,
  cacheGenres,
  cacheMovies,
  clearAll,
  getCachedGenres,
  getCachedMovies,
  getLastSync,
  getWatchlist,
  removeFromWatchlist,
  saveWatchlist,
} from '../../src/services/storageService';
import type { Genre, Movie, WatchlistItem } from '../../src/types/index';

beforeEach(async () => {
  await AsyncStorage.clear();
});

const makeMovie = (id: number): Movie => ({
  id,
  title: `Movie ${id}`,
  overview: '',
  poster_path: null,
  backdrop_path: null,
  release_date: '2024-01-01',
  vote_average: 7.5,
  vote_count: 100,
  genre_ids: [],
  popularity: 50,
  adult: false,
  original_language: 'en',
  original_title: `Movie ${id}`,
  video: false,
});

describe('storageService', () => {
  describe('movies cache', () => {
    it('returns empty array when nothing cached', async () => {
      expect(await getCachedMovies()).toEqual([]);
    });

    it('caches and retrieves movies', async () => {
      const movies = [makeMovie(1), makeMovie(2)];
      await cacheMovies(movies);
      expect(await getCachedMovies()).toEqual(movies);
    });

    it('sets lastSync when caching movies', async () => {
      const before = Date.now();
      await cacheMovies([makeMovie(1)]);
      const sync = await getLastSync();
      expect(sync).toBeGreaterThanOrEqual(before);
    });

    it('getLastSync returns null when never synced', async () => {
      expect(await getLastSync()).toBeNull();
    });
  });

  describe('genres cache', () => {
    it('returns empty array when nothing cached', async () => {
      expect(await getCachedGenres()).toEqual([]);
    });

    it('caches and retrieves genres', async () => {
      const genres: Genre[] = [{ id: 28, name: 'Action' }];
      await cacheGenres(genres);
      expect(await getCachedGenres()).toEqual(genres);
    });
  });

  describe('watchlist', () => {
    it('returns empty array when no watchlist', async () => {
      expect(await getWatchlist()).toEqual([]);
    });

    it('adds a movie to the watchlist', async () => {
      const result = await addToWatchlist(makeMovie(1));
      expect(result).toHaveLength(1);
      expect(result[0].movie.id).toBe(1);
    });

    it('does not add duplicates', async () => {
      const movie = makeMovie(1);
      await addToWatchlist(movie);
      const result = await addToWatchlist(movie);
      expect(result).toHaveLength(1);
    });

    it('removes a movie from the watchlist', async () => {
      await addToWatchlist(makeMovie(1));
      await addToWatchlist(makeMovie(2));
      const result = await removeFromWatchlist(1);
      expect(result).toHaveLength(1);
      expect(result[0].movie.id).toBe(2);
    });

    it('saveWatchlist persists items', async () => {
      const items: WatchlistItem[] = [
        { movieId: 5, movie: makeMovie(5), addedAt: new Date().toISOString() },
      ];
      await saveWatchlist(items);
      expect(await getWatchlist()).toEqual(items);
    });
  });

  describe('clearAll', () => {
    it('clears movies and watchlist', async () => {
      await cacheMovies([makeMovie(1)]);
      await addToWatchlist(makeMovie(2));
      await clearAll();
      expect(await getCachedMovies()).toEqual([]);
      expect(await getWatchlist()).toEqual([]);
    });

    it('clears genres', async () => {
      await cacheGenres([{ id: 28, name: 'Action' }]);
      await clearAll();
      expect(await getCachedGenres()).toEqual([]);
    });

    it('clears lastSync', async () => {
      await cacheMovies([makeMovie(1)]);
      await clearAll();
      expect(await getLastSync()).toBeNull();
    });
  });
});
