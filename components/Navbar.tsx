'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, 
  Film, 
  Tv, 
  Flame, 
  Sparkles, 
  Bookmark, 
  Menu, 
  X, 
  Play, 
  Globe2, 
  Star,
  Clapperboard,
  Languages
} from 'lucide-react';
import { useWatchlist } from '@/lib/watchlist-context';
import { MediaItem } from '@/lib/types';
import { getPosterUrl, getTitle, formatYear } from '@/lib/tmdb';

const NAV_LINKS = [
  { name: 'Home', href: '/', icon: Clapperboard },
  { name: 'Movies', href: '/movies', icon: Film },
  { name: 'TV Shows', href: '/tv', icon: Tv },
  { name: 'Hindi Dubbed', href: '/hindi', icon: Languages, badge: 'Hindi' },
  { name: 'Anime', href: '/anime', icon: Sparkles },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { watchlist } = useWatchlist();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Instant search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Preferred audio mode toggle (aesthetic UI indicator)
  const [audioPreference, setAudioPreference] = useState<'hindi' | 'dual' | 'multi'>('hindi');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced live search autocomplete
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'f3b7a61154e3a50426a7dcbbcd83d3a0';
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(
            searchQuery
          )}&include_adult=false`
        );
        if (res.ok) {
          const data = await res.json();
          // Filter only movie & tv with poster or backdrop
          const filtered = (data.results || []).filter(
            (item: MediaItem) => (item.media_type === 'movie' || item.media_type === 'tv') && (item.poster_path || item.backdrop_path)
          ).slice(0, 6);
          setSearchResults(filtered);
          setShowDropdown(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleResultClick = (item: MediaItem) => {
    setShowDropdown(false);
    setSearchQuery('');
    const type = item.media_type || (item.title ? 'movie' : 'tv');
    router.push(`/watch/${type}/${item.id}`);
  };

  const toggleAudioPreference = () => {
    const next = audioPreference === 'hindi' ? 'dual' : audioPreference === 'dual' ? 'multi' : 'hindi';
    setAudioPreference(next);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-nav py-3 shadow-2xl shadow-black/80'
          : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-brand-red to-red-800 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 group-hover:shadow-red-600/50 transition-all duration-300 border border-white/10">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center">
                KINO<span className="text-brand-red">VERSE</span>
              </span>
              <span className="text-[9px] font-semibold tracking-widest text-zinc-400 uppercase -mt-1">
                Movies &bull; Series &bull; Anime
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-surface-200/40 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-red text-white shadow-md shadow-brand-red/30'
                      : 'text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded font-bold border border-amber-500/30">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search Bar & Actions */}
          <div className="flex items-center gap-3">
            {/* Live Search Input with Dropdown */}
            <div className="relative" ref={searchContainerRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                  placeholder="Search movies, Hindi dubbed, anime..."
                  className="w-40 sm:w-64 md:w-80 bg-surface-200/80 hover:bg-surface-100/90 focus:bg-surface-300 text-white placeholder-zinc-400 text-xs rounded-full pl-9 pr-9 py-2 border border-white/10 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red transition-all duration-200"
                />
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setShowDropdown(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Instant Search Autocomplete Dropdown */}
              {showDropdown && (searchResults.length > 0 || isSearching) && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 glass-panel rounded-2xl p-2 shadow-2xl shadow-black/90 border border-white/10 z-50 animate-fade-in">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 text-[11px] text-zinc-400 font-medium">
                    <span>{isSearching ? 'Searching TMDB...' : 'Top Results'}</span>
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery)}`}
                      onClick={() => setShowDropdown(false)}
                      className="text-brand-red hover:underline"
                    >
                      View All
                    </Link>
                  </div>

                  <div className="divide-y divide-white/5 max-h-[380px] overflow-y-auto">
                    {searchResults.map((item) => {
                      const type = item.media_type || (item.title ? 'movie' : 'tv');
                      const title = getTitle(item);
                      const year = formatYear(item.release_date || item.first_air_date);
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleResultClick(item)}
                          className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-xl cursor-pointer transition-colors group"
                        >
                          <div className="relative w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-surface-300">
                            <Image
                              src={getPosterUrl(item.poster_path, 'w185')}
                              alt={title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-white truncate group-hover:text-brand-red transition-colors">
                              {title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                              <span className="uppercase text-[9px] font-bold px-1.5 py-0.5 rounded bg-surface-100 text-zinc-300">
                                {type}
                              </span>
                              {year && <span>{year}</span>}
                              {item.vote_average > 0 && (
                                <span className="flex items-center gap-0.5 text-amber-400 font-medium">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  {item.vote_average.toFixed(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Audio Toggle Indicator */}
            <button
              onClick={toggleAudioPreference}
              title="Toggle Audio Priority"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-200/60 hover:bg-surface-100 border border-white/10 text-xs font-medium text-zinc-200 transition-colors"
            >
              <Globe2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="capitalize">{audioPreference === 'hindi' ? '🇮🇳 Hindi' : audioPreference === 'dual' ? 'Dual Audio' : 'Multi'}</span>
            </button>

            {/* Discord Community Link */}
            <a
              href="https://discord.gg/HfPr7BaSG"
              target="_blank"
              rel="noopener noreferrer"
              title="Join Discord Community & Feedback"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5865F2]/20 hover:bg-[#5865F2] border border-[#5865F2]/40 text-xs font-bold text-white transition-all shadow-sm hover:shadow-md hover:shadow-[#5865F2]/40"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Discord</span>
            </a>

            {/* Watchlist Link */}
            <Link
              href="/watchlist"
              className={`relative p-2 rounded-full border transition-all ${
                pathname === '/watchlist'
                  ? 'bg-brand-red/20 border-brand-red text-brand-red'
                  : 'bg-surface-200/60 hover:bg-surface-100 border-white/10 text-zinc-300 hover:text-white'
              }`}
              title="My Watchlist"
            >
              <Bookmark className="w-4 h-4" />
              {watchlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-red text-white text-[9px] font-bold flex items-center justify-center shadow-lg shadow-brand-red/50">
                  {watchlist.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-surface-200/60 border border-white/10 text-zinc-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel mt-3 border-t border-white/10 py-4 px-6 animate-fade-in">
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-red text-white'
                      : 'text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <a
              href="https://discord.gg/HfPr7BaSG"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold bg-[#5865F2]/20 text-[#8ea1e1] hover:bg-[#5865F2] hover:text-white border border-[#5865F2]/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Join Discord & Support</span>
              </div>
              <span className="text-xs font-bold text-white bg-[#5865F2] px-2 py-0.5 rounded-md">
                Chat
              </span>
            </a>

            <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
              <span>Playback Audio Priority:</span>
              <button
                onClick={toggleAudioPreference}
                className="px-3 py-1 bg-surface-100 rounded-lg text-amber-300 font-bold border border-white/10"
              >
                {audioPreference === 'hindi' ? 'Hindi First' : 'Dual Audio'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
