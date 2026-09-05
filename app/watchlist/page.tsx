'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, Trash2, Play, Film, Tv, Star, ArrowRight } from 'lucide-react';
import { useWatchlist } from '@/lib/watchlist-context';
import { getPosterUrl } from '@/lib/tmdb';

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist, clearWatchlist } = useWatchlist();

  return (
    <div className="min-h-screen pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-red/20 text-brand-red flex items-center justify-center border border-brand-red/30">
              <Bookmark className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              My Watchlist
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            {watchlist.length} saved {watchlist.length === 1 ? 'title' : 'titles'} ready for playback.
          </p>
        </div>

        {watchlist.length > 0 && (
          <button
            onClick={clearWatchlist}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-100 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Watchlist</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {watchlist.length === 0 ? (
        <div className="py-24 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-surface-200 text-zinc-500 flex items-center justify-center mx-auto border border-white/5">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Your Watchlist is Empty</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Explore trending blockbusters, Bollywood cinema, and TV series, then click the bookmark button to save them here.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-red text-white text-xs font-bold shadow-lg shadow-brand-red/30 hover:bg-red-700 transition-colors"
          >
            <span>Explore Trending Media</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Watchlist Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {watchlist.map((item) => {
            const poster = getPosterUrl(item.poster_path, 'w500');

            return (
              <div
                key={item.id}
                className="group relative flex flex-col rounded-2xl bg-surface-200/50 hover:bg-surface-100/80 border border-white/5 hover:border-brand-red/40 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-black/80 hover:-translate-y-1"
              >
                {/* Poster */}
                <Link
                  href={`/watch/${item.media_type}/${item.id}`}
                  className="relative aspect-[2/3] w-full overflow-hidden bg-surface-300"
                >
                  <Image
                    src={poster}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>
                </Link>

                {/* Info */}
                <div className="p-3 flex flex-col justify-between flex-1 gap-2">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                      <span className="uppercase px-1.5 py-0.2 bg-white/5 border border-white/10 rounded font-semibold text-zinc-300">
                        {item.media_type}
                      </span>
                      {item.vote_average > 0 && (
                        <span className="flex items-center gap-0.5 text-amber-400 font-medium">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {item.vote_average.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <Link href={`/watch/${item.media_type}/${item.id}`}>
                      <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-brand-red transition-colors">
                        {item.title}
                      </h4>
                    </Link>
                  </div>

                  <button
                    onClick={() => removeFromWatchlist(item.id)}
                    className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-surface-100 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/5 hover:border-red-500/30 text-[11px] font-semibold transition-colors mt-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
