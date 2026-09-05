'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Tv, Film } from 'lucide-react';
import { tmdb } from '@/lib/tmdb';
import { MediaItem, MediaType } from '@/lib/types';
import MovieCard from '@/components/MovieCard';

export default function AnimePage() {
  const [tab, setTab] = useState<'tv' | 'movie'>('tv');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function loadAnime() {
      setLoading(true);
      try {
        const res = await tmdb.getAnime(tab, page);
        const formatted = (res.results || []).map((item) => ({
          ...item,
          media_type: tab as MediaType,
        }));

        if (page === 1) {
          setItems(formatted);
        } else {
          setItems((prev) => [...prev, ...formatted]);
        }
        setHasMore(page < (res.total_pages || 1));
      } catch (err) {
        console.error('Failed to load anime:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAnime();
  }, [tab, page]);

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-950/20 via-surface-300 to-indigo-950/20 space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 🎌 Anime & Japanese Animation
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-brand-red text-white font-bold">
            Sub & Dub
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Anime Series & Blockbuster Films
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
          Watch popular anime seasons, OVA series, and animated fantasy feature films with ultra-fast multi-server streaming.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => {
            setTab('tv');
            setPage(1);
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
            tab === 'tv'
              ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
              : 'bg-surface-100/60 hover:bg-surface-50 text-zinc-300 border-white/10'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>Anime Series</span>
        </button>

        <button
          onClick={() => {
            setTab('movie');
            setPage(1);
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
            tab === 'movie'
              ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
              : 'bg-surface-100/60 hover:bg-surface-50 text-zinc-300 border-white/10'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Anime Movies</span>
        </button>
      </div>

      {/* Anime Grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {items.map((item, idx) => (
            <MovieCard key={`${item.id}-${idx}`} item={item} priority={idx < 5} />
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-purple-500 border-t-transparent animate-spin" />
          <span className="text-xs text-zinc-400">Loading anime catalogue...</span>
        </div>
      )}

      {/* Load More */}
      {!loading && hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-8 py-3 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 hover:border-purple-500/40 text-xs font-bold text-white transition-all shadow-lg hover:scale-105"
          >
            Load More Anime
          </button>
        </div>
      )}
    </div>
  );
}
