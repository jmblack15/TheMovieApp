import { create } from 'zustand';
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from '../services/storageService';
import {
  cancelWatchlistReminder,
  scheduleWatchlistReminder,
} from '../services/notificationService';
import type { Movie, WatchlistItem } from '../types/index';

interface WatchlistState {
  items: WatchlistItem[];
  _pendingTimers: Map<number, ReturnType<typeof setTimeout>>;
  loadWatchlist: () => Promise<void>;
  addMovie: (movie: Movie) => Promise<void>;
  removeMovie: (movieId: number) => Promise<void>;
  isInWatchlist: (movieId: number) => boolean;
  toggleWatchlist: (movie: Movie) => Promise<void>;
  markAsOpened: (movieId: number) => void;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  items: [],
  _pendingTimers: new Map(),

  loadWatchlist: async () => {
    const items = await getWatchlist();
    set({ items });
  },

  addMovie: async (movie) => {
    const items = await addToWatchlist(movie);
    const timerId = scheduleWatchlistReminder(movie.title);
    const timers = new Map(get()._pendingTimers);
    timers.set(movie.id, timerId);
    set({ items, _pendingTimers: timers });
  },

  removeMovie: async (movieId) => {
    const items = await removeFromWatchlist(movieId);
    const timers = new Map(get()._pendingTimers);
    const timerId = timers.get(movieId);
    if (timerId !== undefined) {
      cancelWatchlistReminder(timerId);
      timers.delete(movieId);
    }
    set({ items, _pendingTimers: timers });
  },

  isInWatchlist: (movieId) => {
    return get().items.some((item) => item.movie.id === movieId);
  },

  toggleWatchlist: async (movie) => {
    if (get().isInWatchlist(movie.id)) {
      await get().removeMovie(movie.id);
    } else {
      await get().addMovie(movie);
    }
  },

  markAsOpened: (movieId) => {
    const timers = new Map(get()._pendingTimers);
    const timerId = timers.get(movieId);
    if (timerId !== undefined) {
      cancelWatchlistReminder(timerId);
      timers.delete(movieId);
    }
    set({ _pendingTimers: timers });
  },
}));
