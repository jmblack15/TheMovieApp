import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import WatchlistScreen from '../../app/(tabs)/watchlist';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({ id: '1', title: 'Test Movie' }),
  useNavigation: () => ({ setOptions: jest.fn() }),
  Stack: { Screen: 'Screen' },
  Tabs: { Screen: 'Screen' },
}));
import { useWatchlistStore } from '../../src/store/watchlistStore';
import type { Movie, WatchlistItem } from '../../src/types/index';

const mockMovie: Movie = {
  id: 1,
  title: 'Alpha',
  overview: 'Overview',
  poster_path: '/poster.jpg',
  backdrop_path: null,
  release_date: '2024-01-15',
  vote_average: 7.5,
  vote_count: 100,
  genre_ids: [28, 12, 878],
  popularity: 100,
  adult: false,
  original_language: 'en',
  original_title: 'Alpha',
  video: false,
};

const mockItem: WatchlistItem = {
  movieId: 1,
  addedAt: '2024-06-01T10:00:00.000Z',
  movie: mockMovie,
};

beforeEach(() => {
  useWatchlistStore.setState({ items: [] });
});

describe('WatchlistScreen', () => {
  it('shows empty state when watchlist is empty', () => {
    const { getByTestId } = render(<WatchlistScreen />);
    expect(getByTestId('watchlist-empty')).toBeTruthy();
  });

  it('shows movie title when items are preset', () => {
    useWatchlistStore.setState({ items: [mockItem] });
    const { getByText } = render(<WatchlistScreen />);
    expect(getByText('Alpha')).toBeTruthy();
  });

  it('shows correct count in header for single item', () => {
    useWatchlistStore.setState({ items: [mockItem] });
    const { getByText } = render(<WatchlistScreen />);
    expect(getByText('1 película por ver')).toBeTruthy();
  });

  it('shows plural count in header for multiple items', () => {
    const secondItem: WatchlistItem = {
      movieId: 2,
      addedAt: '2024-06-02T10:00:00.000Z',
      movie: { ...mockMovie, id: 2, title: 'Bravo' },
    };
    useWatchlistStore.setState({ items: [mockItem, secondItem] });
    const { getByText } = render(<WatchlistScreen />);
    expect(getByText('2 películas por ver')).toBeTruthy();
  });

  it('shows 0 películas por ver in header when empty', () => {
    const { getByText } = render(<WatchlistScreen />);
    expect(getByText('0 películas por ver')).toBeTruthy();
  });

  it('remove button triggers Alert', () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    useWatchlistStore.setState({ items: [mockItem] });
    const { getByTestId } = render(<WatchlistScreen />);
    fireEvent.press(getByTestId('remove-btn-1'));
    expect(alertSpy).toHaveBeenCalledWith(
      'Quitar de watchlist',
      expect.stringContaining('Alpha'),
      expect.any(Array),
    );
  });

  it('row press navigates to /movie/[id]', () => {
    useWatchlistStore.setState({ items: [mockItem] });
    const { getByText } = render(<WatchlistScreen />);
    fireEvent.press(getByText('Alpha'));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/movie/[id]',
      params: { id: 1, title: 'Alpha' },
    });
  });
});
