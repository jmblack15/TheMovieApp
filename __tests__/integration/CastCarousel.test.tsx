import React from 'react';
import { FlatList } from 'react-native';
import { render } from '@testing-library/react-native';
import { CastCarousel } from '../../src/components/movies/CastCarousel';
import type { Cast } from '../../src/types/index';

function buildCast(count: number): Cast[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Actor ${i + 1}`,
    character: `Character ${i + 1}`,
    profile_path: i % 2 === 0 ? `/profile${i + 1}.jpg` : null,
    gender: (i % 2) + 1,
    order: i,
    known_for_department: 'Acting',
  }));
}

describe('CastCarousel', () => {
  it('renders testID="cast-carousel"', () => {
    const { getByTestId } = render(<CastCarousel cast={buildCast(3)} />);
    expect(getByTestId('cast-carousel')).toBeTruthy();
  });

  it('renders top 20 cast items when more than 20 provided', () => {
    const { UNSAFE_getByType } = render(<CastCarousel cast={buildCast(25)} />);
    const flatList = UNSAFE_getByType(FlatList);
    expect(flatList.props.data).toHaveLength(20);
  });

  it('renders exactly cast.length items when less than 20', () => {
    const cast = buildCast(5);
    const { UNSAFE_getByType } = render(<CastCarousel cast={cast} />);
    const flatList = UNSAFE_getByType(FlatList);
    expect(flatList.props.data).toHaveLength(5);
  });

  it('each item has correct testID', () => {
    const cast = buildCast(3);
    const { getByTestId } = render(<CastCarousel cast={cast} />);
    cast.forEach((actor) => {
      expect(getByTestId(`cast-item-${actor.id}`)).toBeTruthy();
    });
  });

  it('renders actor name', () => {
    const cast = buildCast(2);
    const { getByText } = render(<CastCarousel cast={cast} />);
    expect(getByText('Actor 1')).toBeTruthy();
    expect(getByText('Actor 2')).toBeTruthy();
  });

  it('renders character name', () => {
    const cast = buildCast(2);
    const { getByText } = render(<CastCarousel cast={cast} />);
    expect(getByText('Character 1')).toBeTruthy();
    expect(getByText('Character 2')).toBeTruthy();
  });

  it('shows 👤 placeholder when profile_path is null', () => {
    // buildCast: odd indices (0-based) → null profile_path → actor id 2 has null
    const cast = buildCast(2); // actor 1: has profile, actor 2: null
    const { getAllByText } = render(<CastCarousel cast={cast} />);
    expect(getAllByText('👤').length).toBeGreaterThan(0);
  });

  it('does NOT show 👤 when all actors have profile_path', () => {
    const cast: Cast[] = [
      {
        id: 99,
        name: 'Someone',
        character: 'Hero',
        profile_path: '/photo.jpg',
        gender: 1,
        order: 0,
        known_for_department: 'Acting',
      },
    ];
    const { queryByText } = render(<CastCarousel cast={cast} />);
    expect(queryByText('👤')).toBeNull();
  });

  it('renders a horizontal FlatList', () => {
    const { getByTestId } = render(<CastCarousel cast={buildCast(3)} />);
    const list = getByTestId('cast-carousel');
    expect(list.props.horizontal).toBe(true);
  });
});
