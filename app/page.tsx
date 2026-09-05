import React from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Languages, 
  Trophy, 
  Sparkles, 
  Film, 
  Tv, 
  Clapperboard, 
  Zap, 
  PlayCircle,
  TrendingUp,
  Compass
} from 'lucide-react';
import { tmdb } from '@/lib/tmdb';
import HeroSlider from '@/components/HeroSlider';
import ContentCarousel from '@/components/ContentCarousel';
import FeedbackSection from '@/components/FeedbackSection';

// Revalidate homepage every 1 hour
export const revalidate = 3600;

export default async function HomePage() {
  // Fetch multiple sections concurrently with error fallbacks
  const [
    trendingData,
    hindiMoviesData,
    hindiSeriesData,
    topRatedMoviesData,
    topRatedSeriesData,
    animeData,
    actionMoviesData,
  ] = await Promise.all([
    tmdb.getTrending('all', 'week').catch(() => ({ results: [] })),
    tmdb.getHindiMovies(1, 'popularity.desc').catch(() => ({ results: [] })),
    tmdb.getHindiTVShows(1).catch(() => ({ results: [] })),
    tmdb.getTopRated('movie', 1).catch(() => ({ results: [] })),
    tmdb.getTopRated('tv', 1).catch(() => ({ results: [] })),
    tmdb.getAnime('tv', 1).catch(() => ({ results: [] })),
    tmdb.getByGenre('movie', 28, 1).catch(() => ({ results: [] })),
  ]);

  const heroItems = trendingData.results.slice(0, 8);

  const GENRE_QUICK_LINKS = [
    { id: 28, name: 'Action', icon: Zap, color: 'from-red-600/20 to-red-900/20 border-red-500/30 text-red-400' },
    { id: 878, name: 'Sci-Fi', icon: Sparkles, color: 'from-cyan-600/20 to-cyan-900/20 border-cyan-500/30 text-cyan-400' },
    { id: 35, name: 'Comedy', icon: PlayCircle, color: 'from-amber-600/20 to-amber-900/20 border-amber-500/30 text-amber-400' },
    { id: 27, name: 'Horror', icon: Flame, color: 'from-purple-600/20 to-purple-900/20 border-purple-500/30 text-purple-400' },
    { id: 10749, name: 'Romance', icon: Film, color: 'from-pink-600/20 to-pink-900/20 border-pink-500/30 text-pink-400' },
    { id: 53, name: 'Thriller', icon: Clapperboard, color: 'from-emerald-600/20 to-emerald-900/20 border-emerald-500/30 text-emerald-400' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Dynamic Hero Billboard Slider */}
      <HeroSlider items={heroItems} />

      {/* Main Content Sections */}
      <div className="relative -mt-8 sm:-mt-12 z-20 space-y-2 sm:space-y-4">
        {/* Quick Genre Pills Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 flex-shrink-0">
              <Compass className="w-4 h-4 text-brand-red" /> Genres:
            </span>
            {GENRE_QUICK_LINKS.map((g) => {
              const Icon = g.icon;
              return (
                <Link
                  key={g.id}
                  href={`/movies?genre=${g.id}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${g.color} border text-xs font-bold backdrop-blur-md hover:scale-105 transition-all duration-200 flex-shrink-0`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{g.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Trending Now */}
        <ContentCarousel
          title="Trending Blockbusters"
          subtitle="Top streamed movies & shows this week"
          iconName="trending"
          items={trendingData.results}
          viewAllLink="/movies"
        />

        {/* Trending Hindi / Indian Cinema */}
        <ContentCarousel
          title="🔥 Trending Hindi & Bollywood"
          subtitle="Latest Hindi movies, Bollywood & South Indian cinema"
          iconName="hindi"
          badge="Hindi Audio"
          items={hindiMoviesData.results}
          viewAllLink="/hindi"
        />

        {/* Popular Hindi TV Series */}
        <ContentCarousel
          title="Popular Hindi Web Series"
          subtitle="Binge-worthy Indian dramas and crime thrillers"
          iconName="tv"
          badge="Hindi / Dual"
          items={hindiSeriesData.results}
          viewAllLink="/tv"
        />

        {/* Top IMDb Rated Movies */}
        <ContentCarousel
          title="Top Rated IMDb Movies"
          subtitle="All-time critically acclaimed masterpieces"
          iconName="trophy"
          badge="IMDb 8.0+"
          items={topRatedMoviesData.results}
          viewAllLink="/movies?sort=vote_average.desc"
        />

        {/* Popular Anime Hits */}
        <ContentCarousel
          title="Anime & Asian Series"
          subtitle="Top Japanese animation and fantasy series"
          iconName="anime"
          badge="Sub & Dub"
          items={animeData.results}
          viewAllLink="/anime"
        />

        {/* Top IMDb TV Series */}
        <ContentCarousel
          title="Top Rated TV Series"
          subtitle="Highest rated global television series"
          iconName="tv"
          items={topRatedSeriesData.results}
          viewAllLink="/tv?sort=vote_average.desc"
        />

        {/* Action & Blockbusters */}
        <ContentCarousel
          title="High-Octane Action Hits"
          subtitle="Adrenaline pumping superhero & action movies"
          iconName="zap"
          items={actionMoviesData.results}
          viewAllLink="/movies?genre=28"
        />

        {/* Community & Discord Feedback Section */}
        <FeedbackSection />
      </div>
    </div>
  );
}
