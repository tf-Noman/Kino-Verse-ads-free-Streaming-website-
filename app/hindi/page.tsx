'use client';

import React, { useState, useEffect } from 'react';
import { Languages, Flame, Sparkles, Film, Tv, Radio } from 'lucide-react';
import { tmdb } from '@/lib/tmdb';
import { MediaItem, MediaType } from '@/lib/types';
import MovieCard from '@/components/MovieCard';

export default function HindiPage() {
  const [tab, setTab] = useState<'movies' | 'series' | 'south_hindi'>('movies');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function loadHindiContent() {
      setLoading(true);
      try {
        let res;
        if (tab === 'movies') {
          res = await tmdb.getHindiMovies(page);
        } else if (tab === 'series') {
          res = await tmdb.getHindiTVShows(page);
        } else {
          res = await tmdb.getIndianRegionalInHindi(page);
        }

        const mediaType: MediaType = tab === 'series' ? 'tv' : 'movie';
        const formatted = (res.results || []).map((item) => ({
          ...item,
          media_type: mediaType,
        }));

        if (page === 1) {
          setItems(formatted);
        } else {
          setItems((prev) => [...prev, ...formatted]);
        }
        setHasMore(page < (res.total_pages || 1));
      } catch (err) {
        console.error('Failed to load Hindi content:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHindiContent();
  }, [tab, page]);

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-950/20 via-surface-300 to-red-950/20">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5" /> 🇮🇳 Hindi & Dual Audio Hub
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-brand-red text-white font-bold">
              Multi-Server
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Hindi Dubbed & Bollywood Cinema
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
            Direct high-speed streaming for Bollywood blockbusters, Hindi web series, and South Indian Pan-India dubbed hits powered by specialized MultiMovies servers.
          </p>
        </div>

        {/* Server 1 & Server 3 Callout */}
        <div className="p-4 rounded-2xl bg-surface-100/80 border border-white/10 text-xs text-zinc-300 space-y-1.5 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>Optimal Playback Servers:</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            • <strong>Server 1 — HINDI:</strong> Screenscape (lan=hi) • 4K UHD<br />
            • <strong>Server 2 — ENGLISH &amp; HINDI:</strong> Filmu Multi-Lang • HD
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => {
            setTab('movies');
            setPage(1);
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
            tab === 'movies'
              ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/30'
              : 'bg-surface-100/60 hover:bg-surface-50 text-zinc-300 border-white/10'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Bollywood Movies</span>
        </button>

        <button
          onClick={() => {
            setTab('series');
            setPage(1);
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
            tab === 'series'
              ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/30'
              : 'bg-surface-100/60 hover:bg-surface-50 text-zinc-300 border-white/10'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>Hindi Web Series</span>
        </button>

        <button
          onClick={() => {
            setTab('south_hindi');
            setPage(1);
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
            tab === 'south_hindi'
              ? 'bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/30'
              : 'bg-surface-100/60 hover:bg-surface-50 text-zinc-300 border-white/10'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Pan-India & Regional</span>
        </button>
      </div>

      {/* Content Grid */}
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
          <div className="w-10 h-10 rounded-full border-3 border-brand-red border-t-transparent animate-spin" />
          <span className="text-xs text-zinc-400">Fetching Hindi cinema...</span>
        </div>
      )}

      {/* Load More */}
      {!loading && hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-8 py-3 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 hover:border-brand-red/40 text-xs font-bold text-white transition-all shadow-lg hover:scale-105"
          >
            Load More Hindi Titles
          </button>
        </div>
      )}
    </div>
  );
}
