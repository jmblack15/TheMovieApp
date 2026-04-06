import i18n from '../i18n';
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


async function get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const urlObj = new URL(`${TMDB_BASE_URL}${path}`);

  const apiKey = process.env.EXPO_PUBLIC_TMDB_API_KEY;
  if (!apiKey) throw new Error('EXPO_PUBLIC_TMDB_API_KEY is not set');
  urlObj.searchParams.append('api_key', apiKey);

  const lang = i18n.language === 'es' ? 'es-ES' : 'en-US';
  urlObj.searchParams.append('language', lang);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlObj.searchParams.append(key, String(value));
      }
    });
  }

  const url = urlObj.toString();

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
