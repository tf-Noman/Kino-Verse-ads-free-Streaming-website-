'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Star, 
  Calendar, 
  Clock, 
  Film, 
  Tv, 
  Play, 
  Bookmark, 
  Check, 
  Share2, 
  Sparkles, 
  Languages, 
  AlertCircle,
  Clapperboard,
  ChevronRight,
  Info
} from 'lucide-react';
import { tmdb, getPosterUrl, getBackdropUrl, getProfileUrl, getTitle, formatYear, formatRuntime } from '@/lib/tmdb';
import { MediaItem, MediaType, CastMember } from '@/lib/types';
import { useWatchlist } from '@/lib/watchlist-context';
import Player from '@/components/Player';
import EpisodeSelector from '@/components/EpisodeSelector';
import TrailerModal from '@/components/TrailerModal';
import MovieCard from '@/components/MovieCard';
import FeedbackSection from '@/components/FeedbackSection';
import FeedbackModal from '@/components/FeedbackModal';
import { MessageSquarePlus } from 'lucide-react';

function WatchContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const type = (params?.type as MediaType) || 'movie';
  const id = params?.id as string;

  const initialSeason = Number(searchParams.get('s')) || 1;
  const initialEpisode = Number(searchParams.get('e')) || 1;

  const [media, setMedia] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TV Episode State
  const [currentSeason, setCurrentSeason] = useState(initialSeason);
  const [currentEpisode, setCurrentEpisode] = useState(initialEpisode);

  // Cinema Mode State
  const [isCinemaMode, setIsCinemaMode] = useState(false);

  // Trailer & Feedback Modals
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Share Toast
  const [copied, setCopied] = useState(false);

  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  useEffect(() => {
    async function loadMediaDetails() {
      if (!id || !type) return;
      setLoading(true);
      setError(null);
      try {
        const data = await tmdb.getMediaDetails(type, id);
        setMedia(data);
      } catch (err: any) {
        console.error('Failed to load media details:', err);
        setError('Failed to fetch media details from TMDB. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    loadMediaDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id, type]);

  const handleSelectEpisode = (season: number, episode: number) => {
    setCurrentSeason(season);
    setCurrentEpisode(episode);
    router.replace(`/watch/${type}/${id}?s=${season}&e=${episode}`, { scroll: false });
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-brand-red border-t-transparent animate-spin" />
        <p className="text-sm font-semibold text-zinc-400">Loading Cinema Stream & Details...</p>
      </div>
    );
  }

  if (error || !media) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto px-4 pt-32 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-brand-red flex items-center justify-center mx-auto border border-red-500/30">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Playback Error</h2>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">{error || 'Media not found.'}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-red text-white text-sm font-bold shadow-lg hover:bg-red-700 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const title = getTitle(media);
  const year = formatYear(media.release_date || media.first_air_date);
  const runtime = formatRuntime(media.runtime);
  const inWatchlist = isInWatchlist(media.id);
  const isHindi = media.original_language === 'hi' || media.original_language === 'te' || media.original_language === 'ta';

  const trailer = media.videos?.results?.find(
    (v) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
  );

  const cast = (media.credits?.cast || []).slice(0, 10);
  const similarItems = (media.similar?.results || media.recommendations?.results || []).slice(0, 10);

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-20 relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-radial from-red-600/10 via-transparent to-transparent pointer-events-none -z-10" />

      {/* Theater Dimmer */}
      {isCinemaMode && <div className="theater-mode-dimmer" />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link
            href={type === 'movie' ? '/movies' : '/tv'}
            className="hover:text-white transition-colors uppercase"
          >
            {type === 'movie' ? 'Movies' : 'TV Shows'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-zinc-200 font-semibold truncate max-w-xs">{title}</span>
        </div>

        {/* Video Player Component */}
        <Player
          tmdbId={media.id}
          imdbId={media.imdb_id}
          type={type}
          title={title}
          season={currentSeason}
          episode={currentEpisode}
          onCinemaModeToggle={(active) => setIsCinemaMode(active)}
        />

        {/* TV Series Episode Selector */}
        {type === 'tv' && media.seasons && media.seasons.length > 0 && (
          <EpisodeSelector
            tvId={media.id}
            seasons={media.seasons}
            currentSeason={currentSeason}
            currentEpisode={currentEpisode}
            onSelectEpisode={handleSelectEpisode}
          />
        )}

        {/* Details Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-lg bg-surface-100 border border-white/10 text-xs font-bold text-zinc-300 uppercase">
                  {type === 'movie' ? 'Movie' : 'TV Series'}
                </span>

                {isHindi && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                    🇮🇳 Hindi Audio
                  </span>
                )}

                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  4K UHD
                </span>

                {media.status && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-400 font-medium">
                    {media.status}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {title}
                </h1>
                {media.tagline && (
                  <p className="text-xs sm:text-sm text-zinc-400 italic mt-1 font-medium">
                    &ldquo;{media.tagline}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-300 font-medium pt-1">
                {media.vote_average > 0 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{media.vote_average.toFixed(1)} IMDb</span>
                    <span className="text-[10px] text-amber-300/70 font-normal">({media.vote_count})</span>
                  </div>
                )}

                {year && (
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{year}</span>
                  </div>
                )}

                {type === 'movie' && media.runtime ? (
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{runtime}</span>
                  </div>
                ) : null}

                {type === 'tv' && media.number_of_seasons ? (
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Tv className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{media.number_of_seasons} Seasons • {media.number_of_episodes} Episodes</span>
                  </div>
                ) : null}
              </div>

              {media.genres && media.genres.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {media.genres.map((g) => (
                    <Link
                      key={g.id}
                      href={`/${type === 'movie' ? 'movies' : 'tv'}?genre=${g.id}`}
                      className="px-2.5 py-1 rounded-lg bg-surface-100/70 hover:bg-surface-50 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
                    >
                      {g.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap sm:flex-col gap-2.5 w-full lg:w-48 flex-shrink-0">
              <button
                onClick={() => toggleWatchlist(media)}
                className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border text-xs font-bold transition-all shadow-md ${
                  inWatchlist
                    ? 'bg-brand-red text-white border-brand-red shadow-brand-red/30'
                    : 'bg-surface-100 hover:bg-surface-50 border-white/10 text-zinc-200 hover:text-white'
                }`}
              >
                {inWatchlist ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>In Watchlist</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Add to Watchlist</span>
                  </>
                )}
              </button>

              {trailer && (
                <button
                  onClick={() => setIsTrailerOpen(true)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-xs font-bold text-zinc-200 hover:text-white transition-colors"
                >
                  <Play className="w-4 h-4 text-brand-red fill-brand-red" />
                  <span>Watch Trailer</span>
                </button>
              )}

              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-xs font-bold text-zinc-200 hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>{copied ? 'Link Copied!' : 'Share Stream'}</span>
              </button>

              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2] border border-[#5865F2]/40 text-xs font-bold text-white transition-all shadow-sm"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Report / Discord</span>
              </button>
            </div>
          </div>

          <div className="border-t border-white/10 pt-5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Storyline & Synopsis
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
              {media.overview || 'No synopsis provided for this title.'}
            </p>
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Clapperboard className="w-4 h-4 text-brand-red" /> Top Cast & Characters
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {cast.map((actor: CastMember) => (
                <div
                  key={actor.id}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-surface-200/40 border border-white/5"
                >
                  <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-surface-300 border border-white/10">
                    <Image
                      src={getProfileUrl(actor.profile_path, 'w185')}
                      alt={actor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{actor.name}</h4>
                    <p className="text-[11px] text-zinc-400 truncate">{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Titles */}
        {similarItems.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> You May Also Like
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {similarItems.map((item) => (
                <MovieCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Community Feedback & Discord Support */}
        <FeedbackSection />
      </div>

      {trailer && (
        <TrailerModal
          isOpen={isTrailerOpen}
          onClose={() => setIsTrailerOpen(false)}
          videoKey={trailer.key}
          title={title}
        />
      )}

      {/* Direct Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        mediaTitle={title}
      />
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center pt-20 gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-brand-red border-t-transparent animate-spin" />
          <p className="text-sm font-semibold text-zinc-400">Loading Cinema Stream...</p>
        </div>
      }
    >
      <WatchContent />
    </Suspense>
  );
}
