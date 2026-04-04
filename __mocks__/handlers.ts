import { http, HttpResponse } from 'msw';

const TMDB_BASE = 'https://api.themoviedb.org/3';

export const mockMovies = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: ['Alpha','Bravo','Charlie','Delta','Echo','Foxtrot','Golf','Hotel',
          'India','Juliet','Kilo','Lima','Mike','November','Oscar','Papa',
          'Quebec','Romeo','Sierra','Tango'][i],
  poster_path: `/poster${i + 1}.jpg`,
  backdrop_path: `/backdrop${i + 1}.jpg`,
  overview: `Overview for movie ${i + 1}`,
  release_date: '2024-01-15',
  vote_average: 7.5,
  vote_count: 1000,
  genre_ids: [28, 12, 878],
  popularity: 100 + i,
  adult: false,
  original_language: 'en',
  original_title: ['Alpha','Bravo','Charlie','Delta','Echo','Foxtrot','Golf','Hotel',
                   'India','Juliet','Kilo','Lima','Mike','November','Oscar','Papa',
                   'Quebec','Romeo','Sierra','Tango'][i],
  video: false,
}));

export const mockCredits = {
  id: 1,
  cast: [
    ...Array.from({ length: 4 }, (_, i) => ({
      id: i + 100, name: `Actress ${i}`, character: `Role F${i}`,
      profile_path: null, gender: 1, order: i, known_for_department: 'Acting',
    })),
    ...Array.from({ length: 4 }, (_, i) => ({
      id: i + 200, name: `Actor ${i}`, character: `Role M${i}`,
      profile_path: null, gender: 2, order: i + 4, known_for_department: 'Acting',
    })),
  ],
  crew: [],
};

export const mockMovieDetails = {
  ...mockMovies[0],
  genres: [
    { id: 28, name: 'Acción' },
    { id: 12, name: 'Aventura' },
    { id: 878, name: 'Ciencia ficción' },
  ],
  runtime: 148,
  tagline: 'An epic adventure',
  status: 'Released',
  budget: 356000000,
  revenue: 2797800564,
  production_companies: [],
};

export const handlers = [
  http.get(`${TMDB_BASE}/discover/movie`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    return HttpResponse.json({
      page,
      results: mockMovies,
      total_pages: 3,
      total_results: 60,
    });
  }),

  http.get(`${TMDB_BASE}/movie/:id`, ({ params }) => {
    return HttpResponse.json({ ...mockMovieDetails, id: Number(params.id) });
  }),

  http.get(`${TMDB_BASE}/movie/:id/credits`, ({ params }) => {
    return HttpResponse.json({ ...mockCredits, id: Number(params.id) });
  }),

  http.get(`${TMDB_BASE}/genre/movie/list`, () => {
    return HttpResponse.json({
      genres: [
        { id: 28, name: 'Acción' },
        { id: 12, name: 'Aventura' },
        { id: 878, name: 'Ciencia ficción' },
      ],
    });
  }),
];

export const errorHandlers = {
  serverError: http.get(`${TMDB_BASE}/discover/movie`, () =>
    HttpResponse.json({ status_message: 'Server Error' }, { status: 500 }),
  ),
  networkError: http.get(`${TMDB_BASE}/discover/movie`, () =>
    HttpResponse.error(),
  ),
};
