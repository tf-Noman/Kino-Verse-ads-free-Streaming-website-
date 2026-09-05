export type MediaType = 'movie' | 'tv';

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface VideoItem {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: MediaType;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  genres?: Genre[];
  original_language: string;
  adult?: boolean;
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  tagline?: string;
  imdb_id?: string;
  seasons?: SeasonSummary[];
  credits?: {
    cast: CastMember[];
  };
  videos?: {
    results: VideoItem[];
  };
  similar?: {
    results: MediaItem[];
  };
  recommendations?: {
    results: MediaItem[];
  };
}

export interface SeasonSummary {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  air_date: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  air_date: string;
  vote_average: number;
  runtime: number;
}

export interface SeasonDetail {
  id: number;
  _id: string;
  name: string;
  season_number: number;
  overview: string;
  poster_path: string | null;
  episodes: Episode[];
}

export type ServerCategory = 'all' | 'hindi' | 'fast4k' | 'multi';

export interface ServerOption {
  id: string;
  name: string;
  badge: string;
  badgeColor?: string;
  category?: ServerCategory;
  isHindiFocus?: boolean;
  supportsLanguageParam?: boolean;
  maxQuality?: '4K UHD' | '1080p FHD' | '720p HD' | 'Auto';
  description: string;
  getUrl: (params: {
    tmdbId: number | string;
    imdbId?: string;
    type: MediaType;
    season?: number;
    episode?: number;
    lang?: 'hi' | 'eng' | 'dual';
    quality?: string;
  }) => string;
}

export interface WatchlistItem {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type: MediaType;
  vote_average: number;
  release_date?: string;
  addedAt: number;
}

export interface PlayerSettings {
  quality: 'auto' | '2160p' | '1080p' | '720p' | '480p';
  audioLanguage: 'hi' | 'dual' | 'eng';
  ambientGlow: boolean;
  autoplayNext: boolean;
}
