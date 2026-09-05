'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Tv } from 'lucide-react';
import { tmdb } from '@/lib/tmdb';
import { MediaItem } from '@/lib/types';
import MovieCard from '@/components/MovieCard';
import FilterBar from '@/components/FilterBar';

const TV_GENRES = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 9648, name: 'Mystery' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
];

function TVContent() {
  const searchParams = useSearchParams();
  const initialGenre = searchParams.get('genre') ? Number(searchParams.get('genre')) : null;
  const initialSort = searchParams.get('sort') || 'popularity.desc';

  const [selectedGenre, setSelectedGenre] = useState<number | null>(initialGenre);
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [shows, setShows] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function loadShows() {
      setLoading(true);
      try {
        let res;
        if (selectedGenre) {
          res = await tmdb.getByGenre('tv', selectedGenre, page);
        } else if (sortBy === 'vote_average.desc') {
          res = await tmdb.getTopRated('tv', page);
        } else {
          res = await tmdb.getPopular('tv', page);
        }

        const items = (res.results || []).map((s) => ({ ...s, media_type: 'tv' as const }));
        if (page === 1) {
          setShows(items);
        } else {
          setShows((prev) => [...prev, ...items]);
        }
        setHasMore(page < (res.total_pages || 1));
      } catch (err) {
        console.error('Failed to load TV shows:', err);
      } finally {
        setLoading(false);
      }
    }

    loadShows();
  }, [selectedGenre, sortBy, page]);

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-red/20 text-brand-red flex items-center justify-center border border-brand-red/30">
            <Tv className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Trending TV & Web Series
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400">
          Stream complete seasons and latest episodes of top global television series.
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        selectedGenre={selectedGenre}
        onSelectGenre={(g) => {
          setSelectedGenre(g);
          setPage(1);
        }}
        sortBy={sortBy}
        onSelectSort={(s) => {
          setSortBy(s);
          setPage(1);
        }}
        genres={TV_GENRES}
      />

      {/* TV Shows Grid */}
      {shows.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {shows.map((show, idx) => (
            <MovieCard key={`${show.id}-${idx}`} item={show} priority={idx < 5} />
          ))}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-brand-red border-t-transparent animate-spin" />
          <span className="text-xs text-zinc-400">Fetching TV series...</span>
        </div>
      )}

      {/* Load More Button */}
      {!loading && hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-8 py-3 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 hover:border-brand-red/40 text-xs font-bold text-white transition-all shadow-lg hover:scale-105"
          >
            Load More Series
          </button>
        </div>
      )}
    </div>
  );
}

export default function TVPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center pt-24">
          <div className="w-10 h-10 rounded-full border-3 border-brand-red border-t-transparent animate-spin" />
        </div>
      }
    >
      <TVContent />
    </Suspense>
  );
}
