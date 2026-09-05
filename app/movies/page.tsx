'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Film, Sparkles, AlertCircle } from 'lucide-react';
import { tmdb } from '@/lib/tmdb';
import { MediaItem } from '@/lib/types';
import MovieCard from '@/components/MovieCard';
import FilterBar from '@/components/FilterBar';

const MOVIE_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
];

function MoviesContent() {
  const searchParams = useSearchParams();
  const initialGenre = searchParams.get('genre') ? Number(searchParams.get('genre')) : null;
  const initialSort = searchParams.get('sort') || 'popularity.desc';

  const [selectedGenre, setSelectedGenre] = useState<number | null>(initialGenre);
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      setLoading(true);
      try {
        let res;
        if (selectedGenre) {
          res = await tmdb.getByGenre('movie', selectedGenre, page);
        } else if (sortBy === 'vote_average.desc') {
          res = await tmdb.getTopRated('movie', page);
        } else {
          res = await tmdb.getPopular('movie', page);
        }
        
        const items = (res.results || []).map((m) => ({ ...m, media_type: 'movie' as const }));
        if (page === 1) {
          setMovies(items);
        } else {
          setMovies((prev) => [...prev, ...items]);
        }
        setHasMore(page < (res.total_pages || 1));
      } catch (err) {
        console.error('Failed to load movies:', err);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [selectedGenre, sortBy, page]);

  const handleGenreSelect = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setPage(1);
  };

  const handleSortSelect = (sort: string) => {
    setSortBy(sort);
    setPage(1);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Title Header */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-red/20 text-brand-red flex items-center justify-center border border-brand-red/30">
            <Film className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Explore Blockbuster Movies
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400">
          Stream thousands of HD and 4K movies with multi-audio servers and subtitles.
        </p>
      </div>

      {/* Filter and Sorting Bar */}
      <FilterBar
        selectedGenre={selectedGenre}
        onSelectGenre={handleGenreSelect}
        sortBy={sortBy}
        onSelectSort={handleSortSelect}
        genres={MOVIE_GENRES}
      />

      {/* Movies Grid */}
      {movies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {movies.map((movie, idx) => (
            <MovieCard key={`${movie.id}-${idx}`} item={movie} priority={idx < 5} />
          ))}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-brand-red border-t-transparent animate-spin" />
          <span className="text-xs text-zinc-400">Fetching movies...</span>
        </div>
      )}

      {/* Load More Button */}
      {!loading && hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-8 py-3 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 hover:border-brand-red/40 text-xs font-bold text-white transition-all shadow-lg hover:scale-105"
          >
            Load More Movies
          </button>
        </div>
      )}
    </div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center pt-24">
          <div className="w-10 h-10 rounded-full border-3 border-brand-red border-t-transparent animate-spin" />
        </div>
      }
    >
      <MoviesContent />
    </Suspense>
  );
}
