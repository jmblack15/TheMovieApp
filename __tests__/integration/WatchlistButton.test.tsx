import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { WatchlistButton } from '../../src/components/common/WatchlistButton';
import { useWatchlistStore } from '../../src/store/watchlistStore';
import type { Movie, WatchlistItem } from '../../src/types/index';

const mockMovie: Movie = {
  id: 1,
  title: 'Alpha',
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
  original_title: 'Alpha',
  video: false,
};

const makeWatchlistItem = (movie: Movie): WatchlistItem => ({
  movieId: movie.id,
  movie,
  addedAt: new Date().toISOString(),
});

beforeEach(async () => {
  useWatchlistStore.setState({ items: [], isLoading: false });
});

describe('WatchlistButton', () => {
  it("shows '+ Watchlist' when movie is not in list", () => {
    const { getByText } = render(<WatchlistButton movie={mockMovie} />);
    expect(getByText('+ Watchlist')).toBeTruthy();
  });

  it("shows '✓ En watchlist' when movie is in list", () => {
    useWatchlistStore.setState({ items: [makeWatchlistItem(mockMovie)] });
    const { getByText } = render(<WatchlistButton movie={mockMovie} />);
    expect(getByText('✓ En watchlist')).toBeTruthy();
  });

  it('adds movie to watchlist on press', async () => {
    const { getByTestId } = render(<WatchlistButton movie={mockMovie} />);
    await act(async () => {
      fireEvent.press(getByTestId(`watchlist-btn-${mockMovie.id}`));
    });
    expect(useWatchlistStore.getState().isInWatchlist(mockMovie.id)).toBe(true);
  });

  it('removes movie from watchlist on second press (toggle)', async () => {
    useWatchlistStore.setState({ items: [makeWatchlistItem(mockMovie)] });
    const { getByTestId } = render(<WatchlistButton movie={mockMovie} />);
    await act(async () => {
      fireEvent.press(getByTestId(`watchlist-btn-${mockMovie.id}`));
    });
    expect(useWatchlistStore.getState().isInWatchlist(mockMovie.id)).toBe(false);
  });

  it('has correct testID', () => {
    const { getByTestId } = render(<WatchlistButton movie={mockMovie} />);
    expect(getByTestId('watchlist-btn-1')).toBeTruthy();
  });

  it('has accessibilityRole button', () => {
    const { getByRole } = render(<WatchlistButton movie={mockMovie} />);
    expect(getByRole('button')).toBeTruthy();
  });

  it('has accessibilityState.selected=false when not in watchlist', () => {
    const { getByTestId } = render(<WatchlistButton movie={mockMovie} />);
    const btn = getByTestId('watchlist-btn-1');
    expect(btn.props.accessibilityState?.selected).toBe(false);
  });

  it('has accessibilityState.selected=true when in watchlist', () => {
    useWatchlistStore.setState({ items: [makeWatchlistItem(mockMovie)] });
    const { getByTestId } = render(<WatchlistButton movie={mockMovie} />);
    const btn = getByTestId('watchlist-btn-1');
    expect(btn.props.accessibilityState?.selected).toBe(true);
  });
});
