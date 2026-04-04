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

describe('cacheMovies / getCachedMovies', () => {
  it('returns [] when nothing cached', async () => {
    expect(await getCachedMovies()).toEqual([]);
  });

  it('saves and retrieves movies', async () => {
    const movies = [makeMovie(1), makeMovie(2)];
    await cacheMovies(movies);
    expect(await getCachedMovies()).toEqual(movies);
  });

  it('sets lastSync timestamp after caching', async () => {
    const before = Date.now();
    await cacheMovies([makeMovie(1)]);
    const sync = await getLastSync();
    expect(sync).toBeGreaterThanOrEqual(before);
  });
});

describe('getLastSync', () => {
  it('returns null when never synced', async () => {
    expect(await getLastSync()).toBeNull();
  });

  it('returns a number after cacheMovies is called', async () => {
    await cacheMovies([makeMovie(1)]);
    expect(typeof (await getLastSync())).toBe('number');
  });
});

describe('genres cache', () => {
  it('returns [] when nothing cached', async () => {
    expect(await getCachedGenres()).toEqual([]);
  });

  it('caches and retrieves genres', async () => {
    const genres: Genre[] = [{ id: 28, name: 'Acción' }];
    await cacheGenres(genres);
    expect(await getCachedGenres()).toEqual(genres);
  });
});

describe('getWatchlist', () => {
  it('returns [] initially', async () => {
    expect(await getWatchlist()).toEqual([]);
  });

  it('returns items after addToWatchlist', async () => {
    await addToWatchlist(makeMovie(1));
    expect(await getWatchlist()).toHaveLength(1);
  });
});

describe('addToWatchlist', () => {
  it('adds movie with addedAt timestamp', async () => {
    const result = await addToWatchlist(makeMovie(1));
    expect(result[0].addedAt).toBeDefined();
    expect(result[0].movie.id).toBe(1);
  });

  it('does not add duplicate', async () => {
    await addToWatchlist(makeMovie(1));
    const result = await addToWatchlist(makeMovie(1));
    expect(result).toHaveLength(1);
  });

  it('returns updated list', async () => {
    const result = await addToWatchlist(makeMovie(1));
    expect(result).toHaveLength(1);
  });
});

describe('removeFromWatchlist', () => {
  it('removes only the target movie', async () => {
    await addToWatchlist(makeMovie(1));
    await addToWatchlist(makeMovie(2));
    const result = await removeFromWatchlist(1);
    expect(result).toHaveLength(1);
    expect(result[0].movie.id).toBe(2);
  });

  it('leaves other movies intact', async () => {
    await addToWatchlist(makeMovie(1));
    await addToWatchlist(makeMovie(2));
    await addToWatchlist(makeMovie(3));
    const result = await removeFromWatchlist(2);
    expect(result.map((i) => i.movie.id)).toEqual([1, 3]);
  });

  it('does nothing when removing non-existent id', async () => {
    await addToWatchlist(makeMovie(1));
    const result = await removeFromWatchlist(999);
    expect(result).toHaveLength(1);
  });
});

describe('saveWatchlist / getWatchlist roundtrip', () => {
  it('persists items correctly', async () => {
    const items: WatchlistItem[] = [
      { movieId: 5, movie: makeMovie(5), addedAt: new Date().toISOString() },
    ];
    await saveWatchlist(items);
    expect(await getWatchlist()).toEqual(items);
  });
});

describe('clearAll', () => {
  it('clears movies cache', async () => {
    await cacheMovies([makeMovie(1)]);
    await clearAll();
    expect(await getCachedMovies()).toEqual([]);
  });

  it('clears watchlist', async () => {
    await addToWatchlist(makeMovie(1));
    await clearAll();
    expect(await getWatchlist()).toEqual([]);
  });
});
