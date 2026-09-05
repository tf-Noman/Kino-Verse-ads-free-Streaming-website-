'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Calendar, Clock, Star, Tv, Search, CheckCircle } from 'lucide-react';
import { Episode, SeasonSummary } from '@/lib/types';
import { getBackdropUrl } from '@/lib/tmdb';

interface EpisodeSelectorProps {
  tvId: number | string;
  seasons: SeasonSummary[];
  currentSeason: number;
  currentEpisode: number;
  onSelectEpisode: (season: number, episode: number) => void;
}

export default function EpisodeSelector({
  tvId,
  seasons,
  currentSeason,
  currentEpisode,
  onSelectEpisode,
}: EpisodeSelectorProps) {
  const [selectedSeason, setSelectedSeason] = useState(currentSeason);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  // Filter out season 0 (Specials) if preferred, or keep as valid option
  const validSeasons = seasons.filter((s) => s.season_number > 0);

  useEffect(() => {
    async function fetchEpisodes() {
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'f3b7a61154e3a50426a7dcbbcd83d3a0';
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${tvId}/season/${selectedSeason}?api_key=${apiKey}`
        );
        if (res.ok) {
          const data = await res.json();
          setEpisodes(data.episodes || []);
        }
      } catch (err) {
        console.error('Failed to fetch season episodes:', err);
      } finally {
        setLoading(false);
      }
    }

    if (selectedSeason) {
      fetchEpisodes();
    }
  }, [tvId, selectedSeason]);

  const filteredEpisodes = episodes.filter((ep) =>
    ep.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    ep.episode_number.toString().includes(filterQuery)
  );

  return (
    <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-5">
      {/* Header & Season Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-red/20 text-brand-red flex items-center justify-center border border-brand-red/30">
            <Tv className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Episodes & Seasons</h3>
            <p className="text-xs text-zinc-400">Select an episode to start streaming</p>
          </div>
        </div>

        {/* Season Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {validSeasons.map((season) => {
            const isSelected = season.season_number === selectedSeason;
            return (
              <button
                key={season.id}
                onClick={() => setSelectedSeason(season.season_number)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  isSelected
                    ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/30'
                    : 'bg-surface-100/80 hover:bg-surface-50 text-zinc-300 border-white/10'
                }`}
              >
                Season {season.season_number}
              </button>
            );
          })}
        </div>
      </div>

      {/* Episode Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder={`Search in Season ${selectedSeason} episodes...`}
          className="w-full bg-surface-100/60 text-white placeholder-zinc-500 text-xs rounded-xl pl-9 pr-4 py-2.5 border border-white/10 focus:border-brand-red focus:outline-none transition-all"
        />
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Episodes Grid / List */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-zinc-400">
          <div className="w-8 h-8 rounded-full border-2 border-brand-red border-t-transparent animate-spin" />
          <span className="text-xs">Loading Season {selectedSeason} episodes...</span>
        </div>
      ) : filteredEpisodes.length === 0 ? (
        <div className="py-8 text-center text-zinc-500 text-xs">
          No episodes found for this season.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredEpisodes.map((ep) => {
            const isCurrent =
              selectedSeason === currentSeason && ep.episode_number === currentEpisode;
            const still = getBackdropUrl(ep.still_path, 'w780');

            return (
              <div
                key={ep.id}
                onClick={() => onSelectEpisode(selectedSeason, ep.episode_number)}
                className={`group flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200 border ${
                  isCurrent
                    ? 'bg-brand-red/20 border-brand-red shadow-lg shadow-brand-red/20'
                    : 'bg-surface-100/50 hover:bg-surface-50/80 border-white/5 hover:border-white/20'
                }`}
              >
                {/* Episode Thumbnail */}
                <div className="relative w-28 sm:w-32 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-surface-300">
                  <Image
                    src={still}
                    alt={ep.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                        isCurrent
                          ? 'bg-brand-red text-white border-white/40 scale-110 shadow-lg'
                          : 'bg-black/60 text-white border-white/20 group-hover:scale-110 group-hover:bg-brand-red'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                    </div>
                  </div>
                  {/* Episode Number Pill */}
                  <div className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-black/80 text-[10px] font-bold text-zinc-300">
                    E{ep.episode_number}
                  </div>
                </div>

                {/* Episode Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4
                      className={`text-xs sm:text-sm font-bold truncate ${
                        isCurrent ? 'text-brand-red' : 'text-white group-hover:text-zinc-200'
                      }`}
                    >
                      {ep.episode_number}. {ep.name}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-red text-white uppercase flex-shrink-0">
                        Playing
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1">
                    {ep.runtime ? (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {ep.runtime}m
                      </span>
                    ) : null}
                    {ep.vote_average > 0 && (
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {ep.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                    {ep.overview || 'No episode description available.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
