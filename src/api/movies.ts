import { tmdbClient } from './client';
import { FILTER } from '../constants/api';
import type { Cast, Crew, Movie, MovieDetails, PaginatedResponse } from '../types/index';

export async function fetchMovies(page: number): Promise<PaginatedResponse<Movie>> {
  return tmdbClient.get<PaginatedResponse<Movie>>('/discover/movie', {
    page,
    sort_by: FILTER.sortBy,
  });
}

export async function fetchMovieDetails(id: number): Promise<MovieDetails> {
  return tmdbClient.get<MovieDetails>(`/movie/${id}`);
}

export async function fetchMovieCredits(id: number): Promise<{ id: number; cast: Cast[]; crew: Crew[] }> {
  return tmdbClient.get<{ id: number; cast: Cast[]; crew: Crew[] }>(`/movie/${id}/credits`);
}
