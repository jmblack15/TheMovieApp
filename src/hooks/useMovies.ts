import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchMovieCredits, fetchMovieDetails, fetchMovies } from '../api/movies';
import { QUERY_KEYS } from '../constants/api';
import { useOfflineStore } from '../store/offlineStore';

const FIVE_MINUTES = 5 * 60 * 1000;
const TEN_MINUTES = 10 * 60 * 1000;
const THIRTY_MINUTES = 30 * 60 * 1000;

export function useMoviesInfinite() {
  const { i18n } = useTranslation();
  const isOnline = useOfflineStore((s) => s.isOnline);
  const cachedMovies = useOfflineStore((s) => s.cachedMovies);
  const syncMovies = useOfflineStore((s) => s.syncMovies);

  const query = useInfiniteQuery({
    queryKey: [...QUERY_KEYS.moviesInfinite, i18n.language],
    queryFn: async ({ pageParam }) => {
      const data = await fetchMovies(pageParam);
      if (pageParam === 1) {
        await syncMovies(data.results);
      }
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled: isOnline,
    staleTime: FIVE_MINUTES,
    gcTime: THIRTY_MINUTES,
  });

  const movies =
    isOnline && query.data
      ? query.data.pages.flatMap((page) => page.results)
      : cachedMovies;

  return {
    movies,
    isOffline: !isOnline,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    isRefreshing: query.isRefetching,
    refetch: query.refetch,
    error: query.error,
  };
}

export function useMovieDetails(id: number) {
  const { i18n } = useTranslation();
  return useQuery({
    queryKey: [...QUERY_KEYS.movieDetails(id), i18n.language],
    queryFn: () => fetchMovieDetails(id),
    staleTime: TEN_MINUTES,
    enabled: !!id,
  });
}

export function useMovieCredits(id: number) {
  const { i18n } = useTranslation();
  return useQuery({
    queryKey: [...QUERY_KEYS.movieCredits(id), i18n.language],
    queryFn: () => fetchMovieCredits(id),
    staleTime: TEN_MINUTES,
    enabled: !!id,
  });
}
