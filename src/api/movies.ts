import { tmdbClient } from './client';
import { FILTER } from '../constants/api';
import type { Movie, PaginatedResponse } from '../types/index';

export async function fetchMovies(page: number): Promise<PaginatedResponse<Movie>> {
  return tmdbClient.get<PaginatedResponse<Movie>>('/discover/movie', {
    page,
    sort_by: FILTER.sortBy,
    language: FILTER.language,
  });
}
