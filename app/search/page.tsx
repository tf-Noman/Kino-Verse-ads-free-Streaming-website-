'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Film, Tv, Sparkles, AlertCircle } from 'lucide-react';
import { tmdb } from '@/lib/tmdb';
import { MediaItem, MediaType } from '@/lib/types';
import MovieCard from '@/components/MovieCard';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get('q') || '';

  const [inputQuery, setInputQuery] = useState(queryParam);
  const [activeQuery, setActiveQuery] = useState(queryParam);
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'tv'>('all');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInputQuery(queryParam);
    setActiveQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    async function performSearch() {
      if (!activeQuery.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await tmdb.searchMulti(activeQuery, 1);
        const valid = (res.results || []).filter(
          (item) => (item.media_type === 'movie' || item.media_type === 'tv') && (item.poster_path || item.backdrop_path)
        );
        setResults(valid);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }

    performSearch();
  }, [activeQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      setActiveQuery(inputQuery.trim());
      router.push(`/search?q=${encodeURIComponent(inputQuery.trim())}`);
    }
  };

  const filteredResults = results.filter((item) => {
    if (filterType === 'all') return true;
    return item.media_type === filterType;
  });

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Search Header Bar */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Search KinoVerse
        </h1>

        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Search for movies, TV series, Hindi dubbed, anime..."
            className="w-full bg-surface-200 text-white placeholder-zinc-400 text-sm rounded-2xl pl-11 pr-28 py-3.5 border border-white/10 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red transition-all"
          />
          <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl bg-brand-red hover:bg-red-700 text-white text-xs font-bold transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Result stats & filter tabs */}
      {activeQuery && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <p className="text-xs text-zinc-400">
            Found <span className="text-white font-bold">{filteredResults.length}</span> results for &ldquo;{activeQuery}&rdquo;
          </p>

          <div className="flex items-center gap-1.5 bg-surface-200/60 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterType === 'all'
                  ? 'bg-brand-red text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All ({results.length})
            </button>
            <button
              onClick={() => setFilterType('movie')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterType === 'movie'
                  ? 'bg-brand-red text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Movies ({results.filter((r) => r.media_type === 'movie').length})
            </button>
            <button
              onClick={() => setFilterType('tv')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterType === 'tv'
                  ? 'bg-brand-red text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              TV Shows ({results.filter((r) => r.media_type === 'tv').length})
            </button>
          </div>
        </div>
      )}

      {/* Results Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-brand-red border-t-transparent animate-spin" />
          <span className="text-xs text-zinc-400">Searching global library...</span>
        </div>
      ) : filteredResults.length === 0 && activeQuery ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-surface-200 text-zinc-500 flex items-center justify-center mx-auto border border-white/5">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Results Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            We couldn&apos;t find anything matching &ldquo;{activeQuery}&rdquo;. Try checking the spelling or searching for another title.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredResults.map((item, idx) => (
            <MovieCard key={`${item.id}-${idx}`} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center pt-24">
          <div className="w-10 h-10 rounded-full border-3 border-brand-red border-t-transparent animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
