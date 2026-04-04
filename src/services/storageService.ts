import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/api';
import type { Genre, Movie, WatchlistItem } from '../types/index';

// ── Private helpers ────────────────────────────────────────────────────────

async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // silently fail
  }
}

async function getItem<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // silently fail
  }
}

// ── Movies cache ───────────────────────────────────────────────────────────

export async function cacheMovies(movies: Movie[]): Promise<void> {
  await setItem(STORAGE_KEYS.cachedMovies, movies);
  await setItem(STORAGE_KEYS.lastSync, Date.now());
}

export async function getCachedMovies(): Promise<Movie[]> {
  return (await getItem<Movie[]>(STORAGE_KEYS.cachedMovies)) ?? [];
}

export async function getLastSync(): Promise<number | null> {
  return getItem<number>(STORAGE_KEYS.lastSync);
}

// ── Genres cache ───────────────────────────────────────────────────────────

export async function cacheGenres(genres: Genre[]): Promise<void> {
  await setItem(STORAGE_KEYS.genres, genres);
}

export async function getCachedGenres(): Promise<Genre[]> {
  return (await getItem<Genre[]>(STORAGE_KEYS.genres)) ?? [];
}

// ── Watchlist ──────────────────────────────────────────────────────────────

export async function getWatchlist(): Promise<WatchlistItem[]> {
  return (await getItem<WatchlistItem[]>(STORAGE_KEYS.watchlist)) ?? [];
}

export async function saveWatchlist(items: WatchlistItem[]): Promise<void> {
  await setItem(STORAGE_KEYS.watchlist, items);
}

export async function addToWatchlist(movie: Movie): Promise<WatchlistItem[]> {
  const current = await getWatchlist();
  if (current.some((item) => item.movie.id === movie.id)) {
    return current;
  }
  const updated: WatchlistItem[] = [
    ...current,
    { movieId: movie.id, movie, addedAt: new Date().toISOString() },
  ];
  await saveWatchlist(updated);
  return updated;
}

export async function removeFromWatchlist(movieId: number): Promise<WatchlistItem[]> {
  const current = await getWatchlist();
  const updated = current.filter((item) => item.movie.id !== movieId);
  await saveWatchlist(updated);
  return updated;
}

// ── Clear all ──────────────────────────────────────────────────────────────

export async function clearAll(): Promise<void> {
  await Promise.all([
    removeItem(STORAGE_KEYS.cachedMovies),
    removeItem(STORAGE_KEYS.lastSync),
    removeItem(STORAGE_KEYS.genres),
    removeItem(STORAGE_KEYS.watchlist),
  ]);
}
