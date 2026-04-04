import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '../constants/api';

type PosterSize = keyof typeof IMAGE_SIZES.poster;

export function buildPosterUrl(posterPath: string | null, size: PosterSize = 'medium'): string | null {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE_URL}/${IMAGE_SIZES.poster[size]}${posterPath}`;
}

export function formatRating(voteAverage: number): string {
  return voteAverage.toFixed(1);
}

export function formatYear(releaseDate: string): string {
  if (!releaseDate) return '';
  return releaseDate.slice(0, 4);
}
