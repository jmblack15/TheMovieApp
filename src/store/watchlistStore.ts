import { create } from 'zustand';
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from '../services/storageService';
import {
  cancelWatchlistNotification,
  scheduleWatchlistNotification,
} from '../services/notificationService';
import type { Movie, WatchlistItem } from '../types/index';

interface WatchlistState {
  items: WatchlistItem[];
  isLoading: boolean;
  loadWatchlist: () => Promise<void>;
  addMovie: (movie: Movie) => Promise<void>;
  removeMovie: (movieId: number) => Promise<void>;
  isInWatchlist: (movieId: number) => boolean;
  toggleWatchlist: (movie: Movie) => Promise<void>;
  markAsOpened: (movieId: number) => Promise<void>;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  items: [],
  isLoading: false,

  loadWatchlist: async () => {
    set({ isLoading: true });
    try {
      const items = await getWatchlist();
      set({ items });
    } finally {
      set({ isLoading: false });
    }
  },

  addMovie: async (movie) => {
    const items = await addToWatchlist(movie);
    set({ items });
    await scheduleWatchlistNotification(movie.id, movie.title);
  },

  removeMovie: async (movieId) => {
    const items = await removeFromWatchlist(movieId);
    set({ items });
    await cancelWatchlistNotification(movieId);
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

  markAsOpened: async (movieId) => {
    await cancelWatchlistNotification(movieId);
  },
}));
