import {
  buildBackdropUrl,
  buildPosterUrl,
  buildProfileUrl,
  formatRating,
  formatRuntime,
  formatYear,
} from '../../src/utils/image';

describe('buildPosterUrl', () => {
  it('builds medium poster URL by default', () => {
    expect(buildPosterUrl('/test.jpg')).toBe(
      'https://image.tmdb.org/t/p/w342/test.jpg',
    );
  });

  it('builds large poster URL', () => {
    expect(buildPosterUrl('/test.jpg', 'large')).toBe(
      'https://image.tmdb.org/t/p/w500/test.jpg',
    );
  });

  it('builds small poster URL', () => {
    expect(buildPosterUrl('/test.jpg', 'small')).toBe(
      'https://image.tmdb.org/t/p/w185/test.jpg',
    );
  });

  it('returns null for null path', () => {
    expect(buildPosterUrl(null)).toBeNull();
  });

  it('returns null for undefined path', () => {
    expect(buildPosterUrl(undefined)).toBeNull();
  });
});

describe('buildBackdropUrl', () => {
  it('builds medium backdrop URL by default', () => {
    expect(buildBackdropUrl('/b.jpg')).toBe(
      'https://image.tmdb.org/t/p/w780/b.jpg',
    );
  });

  it('builds large backdrop URL', () => {
    expect(buildBackdropUrl('/b.jpg', 'large')).toBe(
      'https://image.tmdb.org/t/p/w1280/b.jpg',
    );
  });

  it('returns null for null path', () => {
    expect(buildBackdropUrl(null)).toBeNull();
  });
});

describe('buildProfileUrl', () => {
  it('builds small profile URL', () => {
    expect(buildProfileUrl('/p.jpg', 'small')).toBe(
      'https://image.tmdb.org/t/p/w45/p.jpg',
    );
  });

  it('returns null for null path', () => {
    expect(buildProfileUrl(null)).toBeNull();
  });
});

describe('formatRating', () => {
  it('rounds to one decimal', () => {
    expect(formatRating(8.456)).toBe('8.5');
  });

  it('keeps trailing zero', () => {
    expect(formatRating(7.0)).toBe('7.0');
  });

  it('formats perfect score', () => {
    expect(formatRating(10)).toBe('10.0');
  });
});

describe('formatYear', () => {
  it('extracts year from date string', () => {
    expect(formatYear('2024-03-15')).toBe('2024');
  });

  it('extracts year from older date', () => {
    expect(formatYear('1999-12-01')).toBe('1999');
  });

  it('returns N/A for empty string', () => {
    expect(formatYear('')).toBe('N/A');
  });
});

describe('formatRuntime', () => {
  it('formats hours and minutes', () => {
    expect(formatRuntime(148)).toBe('2h 28min');
  });

  it('formats exact hour', () => {
    expect(formatRuntime(60)).toBe('1h 0min');
  });

  it('formats minutes only when under an hour', () => {
    expect(formatRuntime(45)).toBe('45min');
  });

  it('returns N/A for null', () => {
    expect(formatRuntime(null)).toBe('N/A');
  });

  it('returns N/A for zero', () => {
    expect(formatRuntime(0)).toBe('N/A');
  });
});
