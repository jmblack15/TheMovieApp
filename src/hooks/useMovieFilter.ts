import { useState, useCallback, useRef, useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useMoviesInfinite } from './useMovies';
import { fetchMovieDetails, fetchMovieCredits } from '../api/movies';
import { filterMovies, normalizeLetter, titleStartsWith } from '../services/filterService';
import { QUERY_KEYS } from '../constants/api';
import type { Movie } from '../types/index';

const DEBOUNCE_MS = 400;

export function useMovieFilter() {
  const [letterInput, setLetterInput] = useState('');
  const [debouncedLetter, setDebouncedLetter] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const {
    movies,
    isLoading,
    isOffline,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefreshing,
  } = useMoviesInfinite();

  const handleLetterChange = useCallback((text: string) => {
    const sanitized = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '').slice(0, 1);
    setLetterInput(sanitized);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedLetter(normalizeLetter(sanitized));
    }, DEBOUNCE_MS);
  }, []);

  const clearFilter = useCallback(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setLetterInput('');
    setDebouncedLetter('');
  }, []);

  const isFiltering = debouncedLetter.length > 0;

  const titleFilteredMovies = useMemo<Movie[]>(() => {
    if (!isFiltering) return [];
    return movies.filter((m) => titleStartsWith(m.title, debouncedLetter));
  }, [movies, isFiltering, debouncedLetter]);

  const detailQueries = useQueries({
    queries: titleFilteredMovies.map((movie) => ({
      queryKey: QUERY_KEYS.movieDetails(movie.id),
      queryFn: () => fetchMovieDetails(movie.id),
      staleTime: 10 * 60 * 1000,
      enabled: isFiltering,
    })),
  });

  const creditQueries = useQueries({
    queries: titleFilteredMovies.map((movie) => ({
      queryKey: QUERY_KEYS.movieCredits(movie.id),
      queryFn: () => fetchMovieCredits(movie.id),
      staleTime: 10 * 60 * 1000,
      enabled: isFiltering,
    })),
  });

  const isLoadingFilter =
    isFiltering &&
    (detailQueries.some((q) => q.isLoading) ||
      creditQueries.some((q) => q.isLoading));

  const filteredMovies = useMemo<Movie[]>(() => {
    if (!isFiltering) return movies;

    const allLoaded =
      detailQueries.every((q) => q.data !== undefined) &&
      creditQueries.every((q) => q.data !== undefined);

    if (!allLoaded) return [];

    const filterableItems = titleFilteredMovies.map((movie, index) => ({
      movie,
      genreCount:
        detailQueries[index].data?.genres?.length ??
        movie.genre_ids?.length ??
        0,
      cast: creditQueries[index].data?.cast ?? [],
    }));

    return filterMovies(filterableItems, debouncedLetter);
  }, [
    isFiltering,
    movies,
    titleFilteredMovies,
    detailQueries,
    creditQueries,
    debouncedLetter,
  ]);

  return {
    movies: filteredMovies,
    allMovies: movies,
    letterInput,
    debouncedLetter,
    isFiltering,
    isLoading,
    isLoadingFilter,
    isOffline,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefreshing,
    handleLetterChange,
    clearFilter,
  };
}
