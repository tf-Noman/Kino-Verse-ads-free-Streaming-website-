'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Star, Plus, Check, Film, Tv, Sparkles } from 'lucide-react';
import { MediaItem, MediaType } from '@/lib/types';
import { getPosterUrl, getTitle, formatYear } from '@/lib/tmdb';
import { useWatchlist } from '@/lib/watchlist-context';

interface MovieCardProps {
  item: MediaItem;
  priority?: boolean;
}

export default function MovieCard({ item, priority = false }: MovieCardProps) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(item.id);

  const mediaType: MediaType = item.media_type || (item.title ? 'movie' : 'tv');
  const title = getTitle(item);
  const year = formatYear(item.release_date || item.first_air_date);
  const poster = getPosterUrl(item.poster_path, 'w500');
  const isHindi = item.original_language === 'hi' || item.original_language === 'te' || item.original_language === 'ta';

  return (
    <div className="group relative flex flex-col rounded-2xl bg-surface-200/50 hover:bg-surface-100/80 border border-white/5 hover:border-brand-red/40 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-black/80 hover:-translate-y-1.5 flex-shrink-0">
      {/* Poster Image Container */}
      <Link href={`/watch/${mediaType}/${item.id}`} className="relative aspect-[2/3] w-full overflow-hidden rounded-t-2xl bg-surface-300">
        <Image
          src={poster}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          priority={priority}
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Cinematic Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-black/30 opacity-70 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
          {/* Rating */}
          {item.vote_average > 0 ? (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-400 text-[11px] font-bold shadow-md">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{item.vote_average.toFixed(1)}</span>
            </div>
          ) : (
            <div />
          )}

          {/* Hindi / Dual Audio Badge */}
          {isHindi && (
            <div className="px-2 py-0.5 rounded-full bg-brand-red/90 text-white text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-md border border-red-400/40">
              Hindi
            </div>
          )}
        </div>

        {/* Quick Play Hover Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-brand-red/90 text-white flex items-center justify-center shadow-2xl shadow-brand-red/60 scale-75 group-hover:scale-100 transition-transform duration-300 border border-white/20">
            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
          </div>
        </div>
      </Link>

      {/* Card Info Details */}
      <div className="p-3 flex flex-col justify-between flex-1 gap-2">
        <div>
          <div className="flex items-center justify-between gap-1 text-[11px] text-zinc-400 font-medium mb-1">
            <div className="flex items-center gap-1.5">
              <span className="uppercase text-[10px] px-1.5 py-0.2 bg-white/5 border border-white/10 rounded font-semibold text-zinc-300">
                {mediaType === 'movie' ? 'Movie' : 'TV Series'}
              </span>
              {year && <span>{year}</span>}
            </div>

            {/* Quick Watchlist Toggle */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWatchlist(item);
              }}
              title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              className={`p-1.5 rounded-full border transition-all ${
                inWatchlist
                  ? 'bg-brand-red text-white border-brand-red shadow-sm shadow-brand-red/50'
                  : 'bg-surface-100 text-zinc-400 hover:text-white hover:bg-white/10 border-white/10'
              }`}
            >
              {inWatchlist ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
            </button>
          </div>

          <Link href={`/watch/${mediaType}/${item.id}`} className="block">
            <h3 className="text-xs sm:text-sm font-bold text-zinc-100 line-clamp-1 group-hover:text-brand-red transition-colors">
              {title}
            </h3>
          </Link>
        </div>
      </div>
    </div>
  );
}
