import { TMDB_BASE_URL } from '../constants/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

function appendApiKey(url: string): string {
  const apiKey = process.env.EXPO_PUBLIC_TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('EXPO_PUBLIC_TMDB_API_KEY is not set');
  }
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}api_key=${apiKey}`;
}

async function get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  let url = `${TMDB_BASE_URL}${path}`;

  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ).toString();
    url = `${url}?${query}`;
  }

  url = appendApiKey(url);

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new NetworkError('Network request failed');
  }

  if (!response.ok) {
    throw new ApiError(response.status, `HTTP error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const tmdbClient = { get };
