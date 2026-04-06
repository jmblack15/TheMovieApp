import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MovieCard } from '../../src/components/movies/MovieCard';
import type { Movie } from '../../src/types/index';

const mockMovie: Movie = {
  id: 42,
  title: 'Alpha',
  overview: 'An overview',
  poster_path: '/poster.jpg',
  backdrop_path: '/backdrop.jpg',
  release_date: '2024-03-15',
  vote_average: 7.5,
  vote_count: 1000,
  genre_ids: [28, 12],
  popularity: 100,
  adult: false,
  original_language: 'en',
  original_title: 'Alpha',
  video: false,
};

const movieWithoutPoster: Movie = { ...mockMovie, id: 99, poster_path: null };

describe('MovieCard', () => {
  it('renders movie title', () => {
    const { getByText } = render(<MovieCard movie={mockMovie} />);
    expect(getByText('Alpha')).toBeTruthy();
  });

  it('renders release year', () => {
    const { getByText } = render(<MovieCard movie={mockMovie} />);
    expect(getByText('2024')).toBeTruthy();
  });

  it('renders rating badge with star', () => {
    const { getByText } = render(<MovieCard movie={mockMovie} />);
    expect(getByText('⭐ 7.5')).toBeTruthy();
  });

  it('calls onPress with the movie object when tapped', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <MovieCard movie={mockMovie} onPress={onPress} />,
    );
    fireEvent.press(getByTestId(`movie-card-${mockMovie.id}`));
    expect(onPress).toHaveBeenCalledWith(mockMovie);
  });

  it('has correct testID', () => {
    const { getByTestId } = render(<MovieCard movie={mockMovie} />);
    expect(getByTestId('movie-card-42')).toBeTruthy();
  });

  it('has accessibilityRole button', () => {
    const { getByRole } = render(<MovieCard movie={mockMovie} />);
    expect(getByRole('button')).toBeTruthy();
  });

  it('accessibilityLabel contains movie title', () => {
    const { getByLabelText } = render(<MovieCard movie={mockMovie} />);
    expect(getByLabelText(/Alpha/)).toBeTruthy();
  });

  it('shows placeholder when poster_path is null', () => {
    const { getByTestId } = render(<MovieCard movie={movieWithoutPoster} />);
    expect(getByTestId('poster-placeholder')).toBeTruthy();
  });

  it('does not show placeholder when poster is set', () => {
    const { queryByTestId } = render(<MovieCard movie={mockMovie} />);
    expect(queryByTestId('poster-placeholder')).toBeNull();
  });
});
