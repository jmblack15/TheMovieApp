import {
  countByGender,
  filterMovies,
  hasBalancedCast,
  hasMinimumGenres,
  normalizeLetter,
  titleStartsWith,
  type FilterableMovie,
} from '../../src/services/filterService';
import type { Cast, Genre, Movie } from '../../src/types/index';

// ── Fixtures ──────────────────────────────────────────────────────────────────

function buildMovie(overrides: Partial<Movie> = {}): Movie {
  return {
    id: 1,
    title: 'Alpha',
    overview: '',
    poster_path: null,
    backdrop_path: null,
    release_date: '2024-01-01',
    vote_average: 7.5,
    vote_count: 100,
    genre_ids: [28, 12, 878],
    popularity: 50,
    adult: false,
    original_language: 'en',
    original_title: 'Alpha',
    video: false,
    ...overrides,
  };
}

function buildCast(femaleCount: number, maleCount: number): Cast[] {
  const female: Cast[] = Array.from({ length: femaleCount }, (_, i) => ({
    id: i + 1,
    name: `Actress ${i}`,
    character: `Role F${i}`,
    profile_path: null,
    gender: 1,
    order: i,
    known_for_department: 'Acting',
  }));
  const male: Cast[] = Array.from({ length: maleCount }, (_, i) => ({
    id: i + 100,
    name: `Actor ${i}`,
    character: `Role M${i}`,
    profile_path: null,
    gender: 2,
    order: i + femaleCount,
    known_for_department: 'Acting',
  }));
  return [...female, ...male];
}

// ── normalizeLetter ────────────────────────────────────────────────────────────

describe('normalizeLetter', () => {
  it('lowercases uppercase letter', () => {
    expect(normalizeLetter('A')).toBe('a');
  });

  it('trims and lowercases', () => {
    expect(normalizeLetter('  B  ')).toBe('b');
  });

  it('takes only first character', () => {
    expect(normalizeLetter('abc')).toBe('a');
  });

  it('returns empty string for empty input', () => {
    expect(normalizeLetter('')).toBe('');
  });

  it('returns empty string for whitespace only', () => {
    expect(normalizeLetter('  ')).toBe('');
  });
});

// ── titleStartsWith ────────────────────────────────────────────────────────────

describe('titleStartsWith', () => {
  it('matches uppercase letter against lowercase title', () => {
    expect(titleStartsWith('Avengers', 'a')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(titleStartsWith('avengers', 'A')).toBe(true);
  });

  it('returns false for non-matching letter', () => {
    expect(titleStartsWith('Avengers', 'b')).toBe(false);
  });

  it('returns true for empty letter (no filter)', () => {
    expect(titleStartsWith('Anything', '')).toBe(true);
  });

  it('trims the title before comparison', () => {
    expect(titleStartsWith('  Avengers', 'a')).toBe(true);
  });
});

// ── hasMinimumGenres ───────────────────────────────────────────────────────────

describe('hasMinimumGenres', () => {
  it('passes when genres array has enough entries', () => {
    const genres: Genre[] = [
      { id: 28, name: 'A' },
      { id: 12, name: 'B' },
      { id: 878, name: 'C' },
    ];
    expect(hasMinimumGenres(buildMovie({ genres }), 3)).toBe(true);
  });

  it('fails when genres array is too short', () => {
    const genres: Genre[] = [{ id: 28, name: 'A' }, { id: 12, name: 'B' }];
    expect(hasMinimumGenres(buildMovie({ genres }), 3)).toBe(false);
  });

  it('falls back to genre_ids when genres is absent', () => {
    const movie = buildMovie({ genre_ids: [1, 2, 3] });
    expect(hasMinimumGenres(movie, 3)).toBe(true);
  });

  it('fails when both genres array and genre_ids are empty', () => {
    const movie = buildMovie({ genres: [], genre_ids: [] });
    expect(hasMinimumGenres(movie, 3)).toBe(false);
  });
});

// ── countByGender ──────────────────────────────────────────────────────────────

describe('countByGender', () => {
  it('counts correctly for mixed cast', () => {
    expect(countByGender(buildCast(3, 4))).toEqual({
      female: 3,
      male: 4,
      unknown: 0,
    });
  });

  it('counts gender=0 as unknown', () => {
    const cast: Cast[] = [
      { id: 1, name: 'X', character: 'Y', profile_path: null, gender: 0, order: 0, known_for_department: 'Acting' },
    ];
    expect(countByGender(cast)).toEqual({ female: 0, male: 0, unknown: 1 });
  });

  it('returns zeros for empty cast', () => {
    expect(countByGender([])).toEqual({ female: 0, male: 0, unknown: 0 });
  });
});

// ── hasBalancedCast ────────────────────────────────────────────────────────────

describe('hasBalancedCast', () => {
  it('returns true when both counts meet default threshold', () => {
    expect(hasBalancedCast(buildCast(3, 3))).toBe(true);
  });

  it('returns true when both counts exceed threshold', () => {
    expect(hasBalancedCast(buildCast(5, 7))).toBe(true);
  });

  it('returns false when female count is too low', () => {
    expect(hasBalancedCast(buildCast(2, 5))).toBe(false);
  });

  it('returns false when male count is too low', () => {
    expect(hasBalancedCast(buildCast(5, 2))).toBe(false);
  });

  it('returns false for empty cast', () => {
    expect(hasBalancedCast([])).toBe(false);
  });

  it('respects custom thresholds', () => {
    expect(hasBalancedCast(buildCast(2, 2), 2, 2)).toBe(true);
  });
});

// ── filterMovies ──────────────────────────────────────────────────────────────

function makeFilterable(
  movie: Movie,
  cast: Cast[],
  genreCount: number,
): FilterableMovie {
  return { movie, cast, genreCount };
}

describe('filterMovies', () => {
  const balancedCast = buildCast(3, 3);
  const baseItems: FilterableMovie[] = [
    makeFilterable(buildMovie({ id: 1, title: 'Alpha' }), balancedCast, 3),
    makeFilterable(buildMovie({ id: 2, title: 'Bravo' }), balancedCast, 3),
  ];

  it('returns all movies when letter is empty', () => {
    expect(filterMovies(baseItems, '')).toHaveLength(2);
  });

  it('filters by starting letter', () => {
    const result = filterMovies(baseItems, 'a');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Alpha');
  });

  it('excludes movies with fewer than 3 genres', () => {
    const items = [
      makeFilterable(buildMovie({ id: 1, title: 'Alpha' }), balancedCast, 2),
    ];
    expect(filterMovies(items, 'a')).toHaveLength(0);
  });

  it('excludes movies with unbalanced cast', () => {
    const items = [
      makeFilterable(
        buildMovie({ id: 1, title: 'Alpha' }),
        buildCast(1, 5), // only 1 female < 3 threshold
        3,
      ),
    ];
    expect(filterMovies(items, 'a')).toHaveLength(0);
  });

  it('excludes movies whose title does not start with the letter', () => {
    const items = [
      makeFilterable(buildMovie({ id: 1, title: 'Bravo' }), balancedCast, 3),
    ];
    expect(filterMovies(items, 'a')).toHaveLength(0);
  });

  it('requires all conditions to pass simultaneously', () => {
    const items = [
      makeFilterable(buildMovie({ id: 1, title: 'Alpha' }), balancedCast, 3), // passes all
      makeFilterable(buildMovie({ id: 2, title: 'Alpha' }), balancedCast, 2), // fails genre
      makeFilterable(buildMovie({ id: 3, title: 'Bravo' }), balancedCast, 3), // fails letter
    ];
    const result = filterMovies(items, 'a');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });
});
