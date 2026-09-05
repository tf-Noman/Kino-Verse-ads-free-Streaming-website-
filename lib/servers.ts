import { MediaType, ServerOption } from './types';

export const SERVERS: ServerOption[] = [
  // Server 1 preference: HINDI (Screenscape) — shown first
  {
    id: 'screenscape',
    name: 'Server 1 — HINDI',
    badge: '🇮🇳 Hindi • 4K UHD',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    category: 'hindi',
    isHindiFocus: true,
    supportsLanguageParam: true,
    maxQuality: '4K UHD',
    description: 'Primary Hindi server — native Hindi, Bollywood & Dual-Audio in up to 4K UHD.',
    getUrl: ({ tmdbId, imdbId, type, season = 1, episode = 1, lang = 'hi' }) => {
      const lanParam = lang === 'hi' ? 'hi' : 'eng';
      if (type === 'movie') {
        if (imdbId) {
          return `https://screenscape.me/embed?imdb=${imdbId}&type=movie&lan=${lanParam}`;
        }
        return `https://screenscape.me/embed?tmdb=${tmdbId}&type=movie&lan=${lanParam}`;
      } else {
        if (imdbId) {
          return `https://screenscape.me/embed?imdb=${imdbId}&type=tv&s=${season}&e=${episode}&lan=${lanParam}`;
        }
        return `https://screenscape.me/embed?tmdb=${tmdbId}&type=tv&s=${season}&e=${episode}&lan=${lanParam}`;
      }
    },
  },
  // Server 2 preference: ENGLISH & HINDI (Filmu) — shown second
  {
    id: 'filmu-hindi',
    name: 'Server 2 — ENGLISH & HINDI',
    badge: '🌐 Multi-Lang • HD',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    category: 'hindi',
    isHindiFocus: true,
    supportsLanguageParam: false,
    maxQuality: '1080p FHD',
    description: 'Multi-language server — English, Hindi & South Indian dubbed content in Full HD.',
    getUrl: ({ tmdbId, type, season = 1, episode = 1 }) => {
      if (type === 'movie') {
        return `https://embed.filmu.in/movie/${tmdbId}`;
      }
      return `https://embed.filmu.in/tv/${tmdbId}/${season}/${episode}`;
    },
  },
];
