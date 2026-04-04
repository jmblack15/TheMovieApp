import { create } from 'zustand';
import { cacheMovies, getCachedMovies, getLastSync } from '../services/storageService';
import type { Movie } from '../types/index';

interface OfflineState {
  isOnline: boolean;
  cachedMovies: Movie[];
  lastSync: number | null;
  setOnlineStatus: (isOnline: boolean) => void;
  syncMovies: (movies: Movie[]) => Promise<void>;
  loadCachedMovies: () => Promise<void>;
}

export const useOfflineStore = create<OfflineState>((set) => ({
  isOnline: true,
  cachedMovies: [],
  lastSync: null,

  setOnlineStatus: (isOnline) => set({ isOnline }),

  syncMovies: async (movies) => {
    await cacheMovies(movies);
    set({ cachedMovies: movies, lastSync: Date.now() });
  },

  loadCachedMovies: async () => {
    const [movies, lastSync] = await Promise.all([getCachedMovies(), getLastSync()]);
    set({ cachedMovies: movies, lastSync });
  },
}));
