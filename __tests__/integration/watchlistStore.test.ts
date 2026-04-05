import { renderHook, act } from '@testing-library/react-native';
import * as Notifications from 'expo-notifications';
import { useWatchlistStore } from '../../src/store/watchlistStore';
import type { Movie } from '../../src/types/index';

const REMINDER_MS = 3 * 60 * 1000;

const makeMovie = (id: number): Movie => ({
  id,
  title: `Movie ${id}`,
  overview: '',
  poster_path: null,
  backdrop_path: null,
  release_date: '2024-01-01',
  vote_average: 7.5,
  vote_count: 100,
  genre_ids: [],
  popularity: 50,
  adult: false,
  original_language: 'en',
  original_title: `Movie ${id}`,
  video: false,
});

beforeEach(() => {
  jest.useFakeTimers();
  useWatchlistStore.setState({ items: [] });
});

afterEach(() => {
  jest.useRealTimers();
});

describe('loadWatchlist', () => {
  it('loads persisted items from storage', async () => {
    const { result } = renderHook(() => useWatchlistStore());
    await act(async () => {
      await result.current.loadWatchlist();
    });
    expect(result.current.items).toEqual([]);
  });
});

describe('addMovie', () => {
  it('adds movie to items', async () => {
    const { result } = renderHook(() => useWatchlistStore());
    await act(async () => {
      await result.current.addMovie(makeMovie(1));
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].movie.id).toBe(1);
  });

  it('does not add duplicate', async () => {
    const { result } = renderHook(() => useWatchlistStore());
    await act(async () => {
      await result.current.addMovie(makeMovie(1));
      await result.current.addMovie(makeMovie(1));
    });
    expect(result.current.items).toHaveLength(1);
  });

  it('does not call scheduleNotificationAsync before 3 minutes', async () => {
    const { result } = renderHook(() => useWatchlistStore());
    await act(async () => {
      await result.current.addMovie(makeMovie(1));
    });
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('calls scheduleNotificationAsync after 3 minutes', async () => {
    const { result } = renderHook(() => useWatchlistStore());
    await act(async () => {
      await result.current.addMovie(makeMovie(1));
    });
    act(() => {
      jest.advanceTimersByTime(REMINDER_MS);
    });
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(1);
  });
});

describe('removeMovie', () => {
  it('removes movie from items', async () => {
    const { result } = renderHook(() => useWatchlistStore());
    await act(async () => {
      await result.current.addMovie(makeMovie(1));
      await result.current.addMovie(makeMovie(2));
      await result.current.removeMovie(1);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].movie.id).toBe(2);
  });

  it('cancels pending notification after remove', async () => {
    const { result } = renderHook(() => useWatchlistStore());
    await act(async () => {
      await result.current.addMovie(makeMovie(1));
      await result.current.removeMovie(1);
    });
    act(() => {
      jest.advanceTimersByTime(REMINDER_MS);
    });
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });
});

describe('isInWatchlist', () => {
  it('returns true for added movie', async () => {
    const { result } = renderHook(() => useWatchlistStore());
    await act(async () => {
      await result.current.addMovie(makeMovie(1));
    });
    expect(result.current.isInWatchlist(1)).toBe(true);
  });

  it('returns false for unknown id', () => {
    const { result } = renderHook(() => useWatchlistStore());
    expect(result.current.isInWatchlist(999)).toBe(false);
  });
});

describe('toggleWatchlist', () => {
  it('adds movie when not present', async () => {
    const { result } = renderHook(() => useWatchlistStore());
    await act(async () => {
      await result.current.toggleWatchlist(makeMovie(1));
    });
    expect(result.current.isInWatchlist(1)).toBe(true);
  });

  it('removes movie when already present', async () => {
    const { result } = renderHook(() => useWatchlistStore());
    await act(async () => {
      await result.current.addMovie(makeMovie(1));
      await result.current.toggleWatchlist(makeMovie(1));
    });
    expect(result.current.isInWatchlist(1)).toBe(false);
  });
});

describe('markAsOpened', () => {
  it('cancels notification so it never fires', async () => {
    const { result } = renderHook(() => useWatchlistStore());
    await act(async () => {
      await result.current.addMovie(makeMovie(1));
    });
    act(() => {
      result.current.markAsOpened(1);
    });
    act(() => {
      jest.advanceTimersByTime(REMINDER_MS);
    });
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });
});
