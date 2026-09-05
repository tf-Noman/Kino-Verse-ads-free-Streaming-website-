'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Languages, 
  Trophy, 
  Tv, 
  Sparkles, 
  Zap, 
  Film, 
  Flame,
  Clapperboard,
  LucideIcon
} from 'lucide-react';
import { MediaItem } from '@/lib/types';
import MovieCard from './MovieCard';

const ICONS_MAP: Record<string, LucideIcon> = {
  trending: TrendingUp,
  hindi: Languages,
  trophy: Trophy,
  tv: Tv,
  anime: Sparkles,
  zap: Zap,
  film: Film,
  flame: Flame,
  clapperboard: Clapperboard,
};

interface ContentCarouselProps {
  title: string;
  subtitle?: string;
  iconName?: 'trending' | 'hindi' | 'trophy' | 'tv' | 'anime' | 'zap' | 'film' | 'flame' | 'clapperboard';
  badge?: string;
  items: MediaItem[];
  viewAllLink?: string;
}

export default function ContentCarousel({
  title,
  subtitle,
  iconName,
  badge,
  items,
  viewAllLink,
}: ContentCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const Icon = iconName ? ICONS_MAP[iconName] : null;

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.75;
    scrollRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative group/carousel my-8 sm:my-12">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6">
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-9 h-9 rounded-xl bg-brand-red/15 border border-brand-red/30 flex items-center justify-center text-brand-red shadow-lg shadow-brand-red/10">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {title}
                </h2>
                {badge && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>

          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-xs font-semibold text-zinc-400 hover:text-brand-red transition-colors flex items-center gap-1 group/link"
            >
              <span>Explore All</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-2 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/80 hover:bg-brand-red border border-white/20 text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-2xl hover:scale-110 backdrop-blur-md hidden sm:flex items-center justify-center"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrolling items row */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto no-scrollbar py-2 scroll-smooth"
        >
          {items.map((item, index) => (
            <div key={`${item.id}-${index}`} className="w-36 sm:w-44 md:w-48 lg:w-52 flex-shrink-0">
              <MovieCard item={item} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-2 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/80 hover:bg-brand-red border border-white/20 text-white opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-2xl hover:scale-110 backdrop-blur-md hidden sm:flex items-center justify-center"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
