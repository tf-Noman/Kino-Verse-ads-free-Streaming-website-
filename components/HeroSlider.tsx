'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Play, 
  Plus, 
  Check, 
  Star, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX,
  Clapperboard,
  Sparkles,
  Flame
} from 'lucide-react';
import { MediaItem, MediaType } from '@/lib/types';
import { getBackdropUrl, getTitle, formatYear, GENRE_MAP } from '@/lib/tmdb';
import { useWatchlist } from '@/lib/watchlist-context';

interface HeroSliderProps {
  items: MediaItem[];
}

export default function HeroSlider({ items }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const activeItems = items.slice(0, 7);

  useEffect(() => {
    if (!isAutoPlaying || activeItems.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeItems.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, activeItems.length]);

  if (activeItems.length === 0) return null;

  const current = activeItems[currentIndex];
  const title = getTitle(current);
  const mediaType: MediaType = current.media_type || (current.title ? 'movie' : 'tv');
  const year = formatYear(current.release_date || current.first_air_date);
  const inWatchlist = isInWatchlist(current.id);
  const backdrop = getBackdropUrl(current.backdrop_path, 'original');

  const genres = (current.genre_ids || [])
    .slice(0, 3)
    .map((id) => GENRE_MAP[id])
    .filter(Boolean);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeItems.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % activeItems.length);
  };

  return (
    <div 
      className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[88vh] overflow-hidden bg-background select-none"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Slides */}
      {activeItems.map((item, idx) => {
        const itemBackdrop = getBackdropUrl(item.backdrop_path, 'original');
        const isActive = idx === currentIndex;

        return (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Image
              src={itemBackdrop}
              alt={getTitle(item)}
              fill
              priority={idx === 0}
              className="object-cover object-center transform scale-105 transition-transform duration-[10000ms] ease-out"
            />
            {/* Cinematic Vignette Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent w-full md:w-3/4 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-background/80 z-10" />
          </div>
        );
      })}

      {/* Hero Content Section */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-24">
        <div className="max-w-2xl space-y-4 animate-fade-in">
          {/* Spotlight Tag & Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-brand-red/40 border border-red-400/30">
              <Flame className="w-3.5 h-3.5 fill-white text-white" />
              #1 Spotlight
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-surface-200/80 border border-white/10 text-xs font-semibold text-zinc-200 backdrop-blur-md uppercase">
              {mediaType === 'movie' ? 'Movie' : 'TV Series'}
            </span>

            {current.original_language === 'hi' && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold backdrop-blur-md">
                🇮🇳 Hindi Audio
              </span>
            )}

            <span className="px-2 py-0.5 rounded-md bg-white/10 text-white text-[11px] font-bold tracking-wider backdrop-blur-sm">
              4K ULTRA HD
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-2xl">
            {title}
          </h1>

          {/* Meta Info (Rating, Year, Genres) */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-300 font-medium">
            {current.vote_average > 0 && (
              <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{current.vote_average.toFixed(1)} IMDb</span>
              </div>
            )}

            {year && <span>{year}</span>}

            {genres.length > 0 && (
              <div className="flex items-center gap-1.5 text-zinc-400">
                <span>•</span>
                {genres.map((g, i) => (
                  <span key={g}>
                    {g}
                    {i < genres.length - 1 ? ',' : ''}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Overview */}
          <p className="text-zinc-300 text-xs sm:text-sm md:text-base line-clamp-3 leading-relaxed drop-shadow max-w-xl">
            {current.overview || 'Explore this blockbuster streaming now in crystal clear multi-server quality.'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <Link
              href={`/watch/${mediaType}/${current.id}`}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-red hover:bg-red-700 text-white text-sm sm:text-base font-bold shadow-xl shadow-brand-red/40 hover:shadow-brand-red/70 hover:scale-105 active:scale-95 transition-all duration-200 border border-white/10"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Watch Now</span>
            </Link>

            <button
              onClick={() => toggleWatchlist(current)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border backdrop-blur-md text-sm font-semibold transition-all duration-200 ${
                inWatchlist
                  ? 'bg-white/20 border-white/40 text-white'
                  : 'bg-surface-200/80 hover:bg-surface-100 border-white/10 text-zinc-200 hover:text-white'
              }`}
            >
              {inWatchlist ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>In Watchlist</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to Watchlist</span>
                </>
              )}
            </button>

            <Link
              href={`/watch/${mediaType}/${current.id}`}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-200/40 hover:bg-surface-100/60 border border-white/10 text-zinc-300 hover:text-white text-sm font-medium backdrop-blur-md transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>Details</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Controls (Arrows & Indicators) */}
      <div className="absolute right-6 bottom-16 sm:bottom-20 z-30 hidden sm:flex items-center gap-3">
        <button
          onClick={prevSlide}
          className="p-2.5 rounded-full bg-surface-200/70 hover:bg-surface-100 border border-white/10 text-white backdrop-blur-md transition-colors hover:scale-110"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Slide Dots */}
        <div className="flex items-center gap-1.5">
          {activeItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-6 bg-brand-red' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="p-2.5 rounded-full bg-surface-200/70 hover:bg-surface-100 border border-white/10 text-white backdrop-blur-md transition-colors hover:scale-110"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
