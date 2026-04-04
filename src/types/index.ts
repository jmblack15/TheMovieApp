export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
  original_title: string;
  video: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface WatchlistItem {
  movieId: number;
  addedAt: string;
  movie: Movie;
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
