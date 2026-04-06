import { TMDB_IMAGE_BASE_URL, IMAGE_SIZES } from '../constants/api';

type PosterSize = keyof typeof IMAGE_SIZES.poster;
type BackdropSize = keyof typeof IMAGE_SIZES.backdrop;
type ProfileSize = keyof typeof IMAGE_SIZES.profile;

export function buildPosterUrl(
  posterPath: string | null | undefined,
  size: PosterSize = 'medium',
): string | null {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE_URL}/${IMAGE_SIZES.poster[size]}${posterPath}`;
}

export function buildBackdropUrl(
  backdropPath: string | null | undefined,
  size: BackdropSize = 'medium',
): string | null {
  if (!backdropPath) return null;
  return `${TMDB_IMAGE_BASE_URL}/${IMAGE_SIZES.backdrop[size]}${backdropPath}`;
}

export function buildProfileUrl(
  profilePath: string | null | undefined,
  size: ProfileSize = 'medium',
): string | null {
  if (!profilePath) return null;
  return `${TMDB_IMAGE_BASE_URL}/${IMAGE_SIZES.profile[size]}${profilePath}`;
}

export function formatRating(voteAverage: number): string {
  return voteAverage.toFixed(1);
}

export function formatYear(releaseDate: string): string {
  if (!releaseDate) return 'N/A';
  return releaseDate.slice(0, 4);
}

export function formatRuntime(minutes: number | null | undefined): string {
  if (!minutes) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  return `${h}h ${m}min`;
}
