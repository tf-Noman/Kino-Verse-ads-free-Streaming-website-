'use client';

import React, { useState, useEffect } from 'react';
import { 
  Server, 
  RotateCw, 
  Maximize2, 
  Volume2, 
  Sparkles, 
  AlertCircle, 
  Radio, 
  ShieldCheck, 
  ExternalLink,
  Languages,
  Tv,
  Film,
  Settings2,
  Check,
  Zap,
  Layers,
  Monitor,
  Flame,
  HelpCircle,
  X
} from 'lucide-react';
import { SERVERS } from '@/lib/servers';
import { MediaType, ServerOption, ServerCategory, PlayerSettings } from '@/lib/types';

interface PlayerProps {
  tmdbId: number | string;
  imdbId?: string;
  type: MediaType;
  title: string;
  season?: number;
  episode?: number;
  onCinemaModeToggle?: (isCinema: boolean) => void;
}

const QUALITY_OPTIONS = [
  { label: '4K Ultra HD (2160p)', value: '2160p', badge: 'UHD', color: 'text-emerald-400' },
  { label: '1080p Full HD', value: '1080p', badge: 'FHD', color: 'text-cyan-400' },
  { label: '720p HD', value: '720p', badge: 'HD', color: 'text-blue-400' },
  { label: '480p SD (Data Saver)', value: '480p', badge: 'SD', color: 'text-amber-400' },
  { label: 'Auto (Adaptive)', value: 'auto', badge: 'AUTO', color: 'text-zinc-300' },
];

export default function Player({
  tmdbId,
  imdbId,
  type,
  title,
  season = 1,
  episode = 1,
  onCinemaModeToggle,
}: PlayerProps) {
  // Active server
  const [selectedServer, setSelectedServer] = useState<ServerOption>(SERVERS[0]);
  const [serverCategory, setServerCategory] = useState<ServerCategory>('all');
  
  // Audio state
  const [audioLang, setAudioLang] = useState<'hi' | 'eng' | 'dual'>('hi');

  // Player settings state
  const [quality, setQuality] = useState<string>('1080p');
  const [ambientGlow, setAmbientGlow] = useState<boolean>(true);
  const [autoplayNext, setAutoplayNext] = useState<boolean>(true);
  
  // Modals & UI toggles
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isQualityDropdownOpen, setIsQualityDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const storedQuality = localStorage.getItem('kinoverse_quality');
      if (storedQuality) setQuality(storedQuality);
      
      const storedLang = localStorage.getItem('kinoverse_audio_lang');
      if (storedLang === 'hi' || storedLang === 'eng' || storedLang === 'dual') {
        setAudioLang(storedLang);
      }
      
      const storedGlow = localStorage.getItem('kinoverse_ambient_glow');
      if (storedGlow !== null) setAmbientGlow(storedGlow === 'true');
    } catch (e) {
      console.error('Failed to load player settings from localStorage', e);
    }
  }, []);

  const handleQualityChange = (q: string) => {
    setQuality(q);
    setIsQualityDropdownOpen(false);
    try {
      localStorage.setItem('kinoverse_quality', q);
    } catch (e) {}
  };

  const handleAudioLangChange = (lang: 'hi' | 'eng' | 'dual') => {
    setAudioLang(lang);
    try {
      localStorage.setItem('kinoverse_audio_lang', lang);
    } catch (e) {}
  };

  const handleGlowToggle = () => {
    const next = !ambientGlow;
    setAmbientGlow(next);
    try {
      localStorage.setItem('kinoverse_ambient_glow', String(next));
    } catch (e) {}
  };

  // Generate current embed URL
  const embedUrl = selectedServer.getUrl({
    tmdbId,
    imdbId,
    type,
    season,
    episode,
    lang: audioLang,
    quality,
  });

  const handleServerChange = (server: ServerOption) => {
    if (server.id === selectedServer.id) return;
    setIsLoading(true);
    setSelectedServer(server);
  };

  const handleReload = () => {
    setIsLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  const toggleCinema = () => {
    const next = !isCinemaMode;
    setIsCinemaMode(next);
    if (onCinemaModeToggle) {
      onCinemaModeToggle(next);
    }
  };

  // Filtered servers list
  const filteredServers = SERVERS.filter((s) => {
    if (serverCategory === 'all') return true;
    if (serverCategory === 'hindi') return s.isHindiFocus;
    if (serverCategory === 'fast4k') return s.category === 'fast4k';
    return true;
  });

  const currentQualityObj = QUALITY_OPTIONS.find((q) => q.value === quality) || QUALITY_OPTIONS[1];

  return (
    <div className={`flex flex-col gap-4 w-full transition-all duration-300 ${isCinemaMode ? 'z-50 relative' : ''}`}>
      {/* Player Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-3 sm:p-3.5 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-red/20 text-brand-red flex items-center justify-center border border-brand-red/30 flex-shrink-0">
            {type === 'movie' ? <Film className="w-4 h-4" /> : <Tv className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
              {title} {type === 'tv' ? `(S${season} • E${episode})` : ''}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Radio className="w-3 h-3 animate-pulse" /> Active Node:
              </span>
              <span className="text-zinc-300 font-medium truncate max-w-[140px] sm:max-w-none">
                {selectedServer.name}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls: Audio Selector, Quality Dropdown, Settings, Cinema Mode */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Audio Language Switcher */}
          <div className="flex items-center bg-surface-100/90 p-0.5 rounded-xl border border-white/10">
            <button
              onClick={() => handleAudioLangChange('hi')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                audioLang === 'hi'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Force Hindi Audio Stream"
            >
              <span>🇮🇳 Hindi</span>
            </button>
            <button
              onClick={() => handleAudioLangChange('dual')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                audioLang === 'dual'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Dual Audio (Hindi + English)"
            >
              <span>Dual</span>
            </button>
            <button
              onClick={() => handleAudioLangChange('eng')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                audioLang === 'eng'
                  ? 'bg-brand-red text-white shadow-md shadow-brand-red/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Original / English Stream"
            >
              <span>Eng</span>
            </button>
          </div>

          {/* Quality Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsQualityDropdownOpen(!isQualityDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-xs font-bold text-zinc-200 transition-colors"
              title="Select Video Quality"
            >
              <Monitor className="w-3.5 h-3.5 text-emerald-400" />
              <span className={currentQualityObj.color}>{currentQualityObj.badge}</span>
            </button>

            {isQualityDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 glass-panel rounded-2xl p-2 shadow-2xl border border-white/10 z-50 animate-fade-in space-y-1">
                <div className="px-3 py-1.5 border-b border-white/10 text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                  Video Resolution
                </div>
                {QUALITY_OPTIONS.map((q) => (
                  <button
                    key={q.value}
                    onClick={() => handleQualityChange(q.value)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      quality === q.value
                        ? 'bg-brand-red text-white font-bold'
                        : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{q.label}</span>
                    {quality === q.value && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Settings Gear Modal Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-zinc-300 hover:text-white transition-colors"
            title="Player Settings"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          {/* Refresh Player */}
          <button
            onClick={handleReload}
            className="p-2 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-zinc-300 hover:text-white transition-colors"
            title="Reload Video Stream"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Cinema Mode */}
          <button
            onClick={toggleCinema}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isCinemaMode
                ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/40'
                : 'bg-surface-100 hover:bg-surface-50 border-white/10 text-zinc-300 hover:text-white'
            }`}
            title="Toggle Theater / Cinema Mode"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isCinemaMode ? 'Exit Cinema' : 'Cinema'}</span>
          </button>
        </div>
      </div>

      {/* Main Video Player Container (16:9 Aspect Ratio) */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl shadow-black">
        {/* Dynamic Ambient Glow Behind Player */}
        {ambientGlow && (
          <div className="absolute -inset-4 bg-brand-red/10 blur-2xl -z-10 pointer-events-none" />
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-sm gap-3">
            <div className="w-12 h-12 rounded-full border-4 border-brand-red border-t-transparent animate-spin" />
            <div className="text-center space-y-1">
              <p className="text-xs font-bold text-white tracking-wide">
                Connecting to {selectedServer.name}...
              </p>
              <p className="text-[11px] text-zinc-400">
                Resolution target: {currentQualityObj.label} • {audioLang === 'hi' ? '🇮🇳 Hindi Audio' : 'Original Audio'}
              </p>
            </div>
          </div>
        )}

        {/* Video Iframe with robust permissions and sandbox */}
        <iframe
          key={`${selectedServer.id}-${audioLang}-${quality}-${season}-${episode}-${reloadKey}`}
          src={embedUrl}
          title={`${title} Stream Player`}
          className="w-full h-full border-0 absolute inset-0 z-10"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          referrerPolicy="origin"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Server Selection Cards */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-brand-red" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Verified Streaming Servers
            </span>
          </div>
          <span className="text-[11px] text-zinc-400">
            Switch server if stream buffers or audio is missing
          </span>
        </div>

        {/* Server Selection Buttons Grid (2 Servers) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SERVERS.map((server) => {
            const isSelected = server.id === selectedServer.id;
            return (
              <button
                key={server.id}
                onClick={() => handleServerChange(server)}
                className={`flex flex-col text-left p-4 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? 'bg-brand-red/20 border-brand-red text-white shadow-xl shadow-brand-red/30 ring-1 ring-brand-red'
                    : 'bg-surface-100/70 hover:bg-surface-50 border-white/5 text-zinc-300 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-sm font-black truncate">{server.name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${server.badgeColor}`}>
                    {server.badge}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-1 mb-2">
                  {server.description}
                </p>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 border-t border-white/5 pt-2 mt-auto">
                  <span className="font-semibold text-amber-300">🇮🇳 Hindi & Dubbed Available</span>
                  {isSelected ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active Server
                    </span>
                  ) : (
                    <span className="text-zinc-500 hover:text-zinc-300">Click to Switch</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Fallback Guidance and Direct Pop-Out Link */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-amber-300">
                Streaming & Audio Tip:
              </p>
              <p className="text-[11px] text-amber-200/80 leading-relaxed">
                <strong>Server 1 (HINDI)</strong> is the default — best for native Hindi & Bollywood. Switch to <strong>Server 2 (ENGLISH & HINDI)</strong> for English, dubbed & multi-language content.
              </p>
            </div>
          </div>

          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-surface-50 border border-white/10 text-[11px] font-bold text-zinc-200 hover:text-white flex-shrink-0 transition-colors"
          >
            <span>Open Stream in New Tab</span>
            <ExternalLink className="w-3 h-3 text-brand-red" />
          </a>
        </div>
      </div>

      {/* Settings Modal Drawer */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-surface-300 rounded-3xl p-6 border border-white/10 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-red/20 text-brand-red flex items-center justify-center border border-brand-red/30">
                  <Settings2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Player & Stream Settings</h3>
                  <p className="text-xs text-zinc-400">Configure video resolution, audio & playback</p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-2 rounded-full bg-surface-100 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Quality Preference */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-emerald-400" /> Default Video Quality
              </label>
              <div className="grid grid-cols-2 gap-2">
                {QUALITY_OPTIONS.map((q) => (
                  <button
                    key={q.value}
                    onClick={() => handleQualityChange(q.value)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      quality === q.value
                        ? 'bg-brand-red text-white border-brand-red shadow-md shadow-brand-red/30'
                        : 'bg-surface-100/60 hover:bg-surface-50 border-white/5 text-zinc-300'
                    }`}
                  >
                    <span>{q.label}</span>
                    {quality === q.value && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Language Preference */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-amber-400" /> Preferred Audio Track
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'hi', label: '🇮🇳 Hindi Audio' },
                  { id: 'dual', label: '🎧 Dual Audio' },
                  { id: 'eng', label: '🌐 Original English' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleAudioLangChange(item.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                      audioLang === item.id
                        ? 'bg-amber-500 text-black border-amber-500 font-bold shadow-md shadow-amber-500/30'
                        : 'bg-surface-100/60 hover:bg-surface-50 border-white/5 text-zinc-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Ambient Cinema Glow</h4>
                  <p className="text-[11px] text-zinc-400">Dynamic atmospheric backlight behind video</p>
                </div>
                <button
                  onClick={handleGlowToggle}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    ambientGlow ? 'bg-brand-red' : 'bg-surface-100'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      ambientGlow ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Autoplay Next Episode</h4>
                  <p className="text-[11px] text-zinc-400">Automatically load next episode for TV shows</p>
                </div>
                <button
                  onClick={() => setAutoplayNext(!autoplayNext)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    autoplayNext ? 'bg-brand-red' : 'bg-surface-100'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      autoplayNext ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-full py-3 rounded-xl bg-brand-red hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-brand-red/40 transition-colors"
              >
                Save & Close Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
