import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from '../../__mocks__/server';
import { errorHandlers, mockMovieDetails } from '../../__mocks__/handlers';
import { useWatchlistStore } from '../../src/store/watchlistStore';
import MovieDetailScreen from '../../app/movie/[id]';

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

// jest.setup.ts mocks useLocalSearchParams to return { id: '1', title: 'Test Movie' }
// mockMovieDetails has id=1, title='Alpha'

beforeEach(() => {
  useWatchlistStore.setState({ items: [], isLoading: false });
});

describe('DetailScreen', () => {
  it('shows testID="detail-loading" initially', () => {
    const { getByTestId } = render(<MovieDetailScreen />, {
      wrapper: makeWrapper(),
    });
    expect(getByTestId('detail-loading')).toBeTruthy();
  });

  it('shows detail-screen after data loads', async () => {
    const { getByTestId } = render(<MovieDetailScreen />, {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(getByTestId('detail-screen')).toBeTruthy());
  });

  it('displays movie title from API', async () => {
    const { getByText } = render(<MovieDetailScreen />, {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(getByText(mockMovieDetails.title)).toBeTruthy());
  });

  it('displays genre badges', async () => {
    const { getByText } = render(<MovieDetailScreen />, {
      wrapper: makeWrapper(),
    });
    await waitFor(() => {
      expect(getByText('Acción')).toBeTruthy();
      expect(getByText('Aventura')).toBeTruthy();
      expect(getByText('Ciencia ficción')).toBeTruthy();
    });
  });

  it('shows cast-carousel after data loads', async () => {
    const { getByTestId } = render(<MovieDetailScreen />, {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(getByTestId('cast-carousel')).toBeTruthy());
  });

  it('shows watchlist button with correct testID', async () => {
    const { getByTestId } = render(<MovieDetailScreen />, {
      wrapper: makeWrapper(),
    });
    await waitFor(() => expect(getByTestId('watchlist-btn-1')).toBeTruthy());
  });

  it('calls markAsOpened with movieId=1 on mount', async () => {
    const markAsOpened = jest.fn();
    useWatchlistStore.setState({ items: [], isLoading: false, markAsOpened } as unknown as Parameters<typeof useWatchlistStore.setState>[0]);

    render(<MovieDetailScreen />, { wrapper: makeWrapper() });

    await waitFor(() => expect(markAsOpened).toHaveBeenCalledWith(1));
  });

  it('watchlist button toggles to "✓ En watchlist" on press', async () => {
    const { getByTestId, getByText } = render(<MovieDetailScreen />, {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(getByTestId('watchlist-btn-1')).toBeTruthy());

    await act(async () => {
      fireEvent.press(getByTestId('watchlist-btn-1'));
    });

    expect(getByText('✓ detail.inWatchlist')).toBeTruthy();
  });

  it('shows testID="detail-error" when API returns 500', async () => {
    server.use(errorHandlers.movieDetailError);

    const { getByTestId } = render(<MovieDetailScreen />, {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(getByTestId('detail-error')).toBeTruthy());
  });
});
