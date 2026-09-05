import { MediaItem, MediaType, SeasonDetail } from './types';

const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY || 'f3b7a61154e3a50426a7dcbbcd83d3a0';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const getPosterUrl = (path: string | null | undefined, size: 'w185' | 'w342' | 'w500' | 'original' = 'w500') => {
  if (!path) return 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=80';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null | undefined, size: 'w780' | 'w1280' | 'original' = 'original') => {
  if (!path) return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&auto=format&fit=crop&q=80';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getProfileUrl = (path: string | null | undefined, size: 'w185' | 'h632' | 'original' = 'w185') => {
  if (!path) return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=185&auto=format&fit=crop&q=80';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

async function tmdbFetch<T>(endpoint: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', TMDB_API_KEY);
  url.searchParams.set('include_adult', 'false');

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // ISR cache 1 hour
  });

  if (!res.ok) {
    console.error(`TMDB fetch error for ${endpoint}:`, res.status, res.statusText);
    throw new Error(`Failed to fetch TMDB data: ${res.status}`);
  }

  return res.json();
}

// Client-side helper or API route helper
export async function fetchFromClientTMDB<T>(endpoint: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', TMDB_API_KEY);
  url.searchParams.set('include_adult', 'false');

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Failed to fetch data`);
  }
  return res.json();
}

export const tmdb = {
  // Trending content
  getTrending: async (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'week'): Promise<{ results: MediaItem[] }> => {
    return tmdbFetch<{ results: MediaItem[] }>(`/trending/${mediaType}/${timeWindow}`);
  },

  // Popular movies & TV shows
  getPopular: async (mediaType: MediaType = 'movie', page = 1): Promise<{ results: MediaItem[]; total_pages: number }> => {
    return tmdbFetch<{ results: MediaItem[]; total_pages: number }>(`/${mediaType}/popular`, { page });
  },

  // Top Rated movies & TV shows
  getTopRated: async (mediaType: MediaType = 'movie', page = 1): Promise<{ results: MediaItem[]; total_pages: number }> => {
    return tmdbFetch<{ results: MediaItem[]; total_pages: number }>(`/${mediaType}/top_rated`, { page });
  },

  // Hindi / Bollywood Movies (Original language hi or spoken language hi)
  getHindiMovies: async (page = 1, sortBy: 'popularity.desc' | 'vote_average.desc' | 'primary_release_date.desc' = 'popularity.desc'): Promise<{ results: MediaItem[]; total_pages: number }> => {
    return tmdbFetch<{ results: MediaItem[]; total_pages: number }>('/discover/movie', {
      with_original_language: 'hi',
      sort_by: sortBy,
      'vote_count.gte': '15',
      page,
    });
  },

  // Hindi / Indian TV Shows
  getHindiTVShows: async (page = 1): Promise<{ results: MediaItem[]; total_pages: number }> => {
    return tmdbFetch<{ results: MediaItem[]; total_pages: number }>('/discover/tv', {
      with_original_language: 'hi',
      sort_by: 'popularity.desc',
      page,
    });
  },

  // Hindi Dubbed / South Indian Cinema in Hindi or Pan-India
  getIndianRegionalInHindi: async (page = 1): Promise<{ results: MediaItem[]; total_pages: number }> => {
    return tmdbFetch<{ results: MediaItem[]; total_pages: number }>('/discover/movie', {
      with_origin_country: 'IN',
      sort_by: 'popularity.desc',
      'vote_count.gte': '20',
      page,
    });
  },

  // Popular Anime Series & Movies
  getAnime: async (mediaType: MediaType = 'tv', page = 1): Promise<{ results: MediaItem[]; total_pages: number }> => {
    if (mediaType === 'tv') {
      return tmdbFetch<{ results: MediaItem[]; total_pages: number }>('/discover/tv', {
        with_genres: '16', // Animation
        with_original_language: 'ja',
        sort_by: 'popularity.desc',
        page,
      });
    }
    return tmdbFetch<{ results: MediaItem[]; total_pages: number }>('/discover/movie', {
      with_genres: '16',
      with_original_language: 'ja',
      sort_by: 'popularity.desc',
      page,
    });
  },

  // Discover by genre
  getByGenre: async (mediaType: MediaType, genreId: number, page = 1): Promise<{ results: MediaItem[]; total_pages: number }> => {
    return tmdbFetch<{ results: MediaItem[]; total_pages: number }>(`/discover/${mediaType}`, {
      with_genres: genreId.toString(),
      sort_by: 'popularity.desc',
      page,
    });
  },

  // Media Detailed info
  getMediaDetails: async (type: MediaType, id: string | number): Promise<MediaItem> => {
    const data = await tmdbFetch<MediaItem>(`/${type}/${id}`, {
      append_to_response: 'credits,videos,similar,recommendations,external_ids',
    });
    return { ...data, media_type: type };
  },

  // TV Season detailed episode breakdown
  getSeasonDetails: async (tvId: string | number, seasonNumber: number): Promise<SeasonDetail> => {
    return tmdbFetch<SeasonDetail>(`/tv/${tvId}/season/${seasonNumber}`);
  },

  // Instant Multi-Search
  searchMulti: async (query: string, page = 1): Promise<{ results: MediaItem[]; total_pages: number; total_results: number }> => {
    if (!query.trim()) return { results: [], total_pages: 0, total_results: 0 };
    return tmdbFetch<{ results: MediaItem[]; total_pages: number; total_results: number }>('/search/multi', {
      query: encodeURIComponent(query),
      page,
    });
  },

  // Movie genres list
  getMovieGenres: async (): Promise<{ genres: { id: number; name: string }[] }> => {
    return tmdbFetch<{ genres: { id: number; name: string }[] }>('/genre/movie/list');
  },

  // TV genres list
  getTVGenres: async (): Promise<{ genres: { id: number; name: string }[] }> => {
    return tmdbFetch<{ genres: { id: number; name: string }[] }>('/genre/tv/list');
  },
};

export const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
};

export function formatRuntime(minutes?: number): string {
  if (!minutes) return 'N/A';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins}m`;
}

export function formatYear(dateStr?: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).getFullYear().toString();
}

export function getTitle(item?: MediaItem): string {
  if (!item) return '';
  return item.title || item.name || item.original_title || item.original_name || 'Untitled';
}

export function getReleaseDate(item?: MediaItem): string {
  if (!item) return '';
  return item.release_date || item.first_air_date || '';
}
