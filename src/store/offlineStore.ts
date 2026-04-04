import { create } from 'zustand';
import { cacheMovies, getCachedMovies } from '../services/storageService';
import type { Movie } from '../types/index';

interface OfflineState {
  isOnline: boolean;
  cachedMovies: Movie[];
  setOnlineStatus: (isOnline: boolean) => void;
  syncMovies: (movies: Movie[]) => Promise<void>;
  loadCachedMovies: () => Promise<void>;
}

export const useOfflineStore = create<OfflineState>((set) => ({
  isOnline: true,
  cachedMovies: [],

  setOnlineStatus: (isOnline) => set({ isOnline }),

  syncMovies: async (movies) => {
    await cacheMovies(movies);
    set({ cachedMovies: movies });
  },

  loadCachedMovies: async () => {
    const movies = await getCachedMovies();
    set({ cachedMovies: movies });
  },
}));
