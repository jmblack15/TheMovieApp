import type { Cast, Movie } from '../types/index';

const MIN_GENRES = 3;
const DEFAULT_MIN_FEMALE = 3;
const DEFAULT_MIN_MALE = 3;

export function normalizeLetter(letter: string): string {
  const trimmed = letter.trim();
  if (!trimmed) return '';
  return trimmed[0].toLowerCase();
}

export function titleStartsWith(title: string, letter: string): boolean {
  const l = normalizeLetter(letter);
  if (!l) return true;
  return title.trim().toLowerCase().startsWith(l);
}

export function hasMinimumGenres(movie: Movie, minGenres: number = MIN_GENRES): boolean {
  if (movie.genres !== undefined) {
    return movie.genres.length >= minGenres;
  }
  return movie.genre_ids.length >= minGenres;
}

export function countByGender(cast: Cast[]): {
  female: number;
  male: number;
  unknown: number;
} {
  return cast.reduce(
    (acc, member) => {
      if (member.gender === 1) acc.female++;
      else if (member.gender === 2) acc.male++;
      else acc.unknown++;
      return acc;
    },
    { female: 0, male: 0, unknown: 0 },
  );
}

export function hasBalancedCast(
  cast: Cast[],
  minFemale: number = DEFAULT_MIN_FEMALE,
  minMale: number = DEFAULT_MIN_MALE,
): boolean {
  if (!cast.length) return false;
  const { female, male } = countByGender(cast);
  return female >= minFemale && male >= minMale;
}

export interface FilterableMovie {
  movie: Movie;
  genreCount: number;
  cast: Cast[];
}

export function filterMovies(items: FilterableMovie[], letter: string): Movie[] {
  const l = normalizeLetter(letter);
  if (!l) return items.map((i) => i.movie);

  return items
    .filter(({ movie, genreCount, cast }) => {
      if (!titleStartsWith(movie.title, l)) return false;
      if (genreCount < MIN_GENRES) return false;
      if (!hasBalancedCast(cast)) return false;
      return true;
    })
    .map(({ movie }) => movie);
}
