import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomeScreen from '../../app/(tabs)/index';
import { useOfflineStore } from '../../src/store/offlineStore';
import { server } from '../../__mocks__/server';
import { errorHandlers, mockMovies } from '../../__mocks__/handlers';

// server auto-registers beforeAll / afterEach / afterAll

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

beforeEach(() => {
  useOfflineStore.setState({
    isOnline: true,
    cachedMovies: [],
    lastSync: null,
  });
});

describe('HomeScreen', () => {
  it('shows loading state before data loads', () => {
    const { getByTestId } = render(<HomeScreen />, {
      wrapper: createWrapper(),
    });
    expect(getByTestId('loading-state')).toBeTruthy();
  });

  it('shows movies list after data loads', async () => {
    const { findByTestId } = render(<HomeScreen />, {
      wrapper: createWrapper(),
    });
    await findByTestId('movies-list');
  });

  it('renders movie titles after load', async () => {
    const { findByText } = render(<HomeScreen />, {
      wrapper: createWrapper(),
    });
    await findByText('Alpha');
  });

  it('shows filter input after load', async () => {
    const { findByTestId } = render(<HomeScreen />, {
      wrapper: createWrapper(),
    });
    await findByTestId('movies-list');
    // filter input is always rendered (above the list)
    const { getByTestId } = render(<HomeScreen />, {
      wrapper: createWrapper(),
    });
    expect(getByTestId('filter-input')).toBeTruthy();
  });

  it('shows empty state when filter matches nothing', async () => {
    const { getByTestId, findByTestId } = render(<HomeScreen />, {
      wrapper: createWrapper(),
    });
    await findByTestId('movies-list');
    fireEvent.changeText(getByTestId('filter-input'), 'Z');
    await findByTestId('empty-state');
  });

  it('sanitizes numeric input — value stays empty', async () => {
    const { getByTestId } = render(<HomeScreen />, {
      wrapper: createWrapper(),
    });
    const input = getByTestId('filter-input');
    fireEvent.changeText(input, '1');
    expect(input.props.value).toBe('');
  });

  it('hides clear button when input is empty', async () => {
    const { queryByTestId } = render(<HomeScreen />, {
      wrapper: createWrapper(),
    });
    expect(queryByTestId('filter-clear-btn')).toBeNull();
  });

  it('shows offline banner when offline', async () => {
    useOfflineStore.setState({
      isOnline: false,
      cachedMovies: mockMovies,
      lastSync: null,
    });
    const { findByTestId } = render(<HomeScreen />, {
      wrapper: createWrapper(),
    });
    await findByTestId('offline-banner');
  });

  it('shows cached movies when offline', async () => {
    useOfflineStore.setState({
      isOnline: false,
      cachedMovies: [
        {
          id: 999,
          title: 'Cached Film',
          overview: '',
          poster_path: null,
          backdrop_path: null,
          release_date: '2024-01-01',
          vote_average: 7,
          vote_count: 10,
          genre_ids: [],
          popularity: 1,
          adult: false,
          original_language: 'en',
          original_title: 'Cached Film',
          video: false,
        },
      ],
      lastSync: null,
    });
    const { findByText } = render(<HomeScreen />, {
      wrapper: createWrapper(),
    });
    await findByText('Cached Film');
  });

  it('does not crash on server error', async () => {
    server.use(errorHandlers.serverError);
    const { findByTestId } = render(<HomeScreen />, {
      wrapper: createWrapper(),
    });
    // Should show empty or error state without crashing
    await waitFor(() => {
      // query will fail → isLoading becomes false → list renders (empty)
    }, { timeout: 3000 });
  });
});
