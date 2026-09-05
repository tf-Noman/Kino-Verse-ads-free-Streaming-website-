'use client';

import React from 'react';
import { SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react';

interface FilterBarProps {
  selectedGenre: number | null;
  onSelectGenre: (genreId: number | null) => void;
  sortBy: string;
  onSelectSort: (sort: string) => void;
  genres: { id: number; name: string }[];
}

export default function FilterBar({
  selectedGenre,
  onSelectGenre,
  sortBy,
  onSelectSort,
  genres,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-white/10 mb-8">
      {/* Genre Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto py-1">
        <button
          onClick={() => onSelectGenre(null)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
            selectedGenre === null
              ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/30'
              : 'bg-surface-100/60 hover:bg-surface-50 text-zinc-300 border-white/10'
          }`}
        >
          All Genres
        </button>

        {genres.map((g) => {
          const isSelected = selectedGenre === g.id;
          return (
            <button
              key={g.id}
              onClick={() => onSelectGenre(isSelected ? null : g.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                isSelected
                  ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/30'
                  : 'bg-surface-100/60 hover:bg-surface-50 text-zinc-300 border-white/10'
              }`}
            >
              {g.name}
            </button>
          );
        })}
      </div>

      {/* Sort By Dropdown */}
      <div className="flex items-center gap-2 self-end md:self-auto flex-shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
          <ArrowUpDown className="w-3.5 h-3.5 text-brand-red" />
          <span>Sort:</span>
        </div>
        <select
          value={sortBy}
          onChange={(e) => onSelectSort(e.target.value)}
          className="bg-surface-100 text-white text-xs font-semibold rounded-xl px-3 py-1.5 border border-white/10 focus:border-brand-red focus:outline-none cursor-pointer"
        >
          <option value="popularity.desc">Most Popular</option>
          <option value="vote_average.desc">Highest Rated (IMDb)</option>
          <option value="primary_release_date.desc">Newest Release</option>
        </select>
      </div>
    </div>
  );
}
