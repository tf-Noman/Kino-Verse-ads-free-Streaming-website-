'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Heart, Shield, Film, Tv, Languages, Sparkles, HelpCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-surface-400/90 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-brand-red flex items-center justify-center shadow-lg shadow-brand-red/30">
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                KINO<span className="text-brand-red">VERSE</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-zinc-400">
              Your personal gateway to discover movies, TV shows, anime & Hindi dubbed content — all in one place, totally free.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Streaming Index Service</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Explore Content
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/movies" className="hover:text-brand-red transition-colors flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5" /> Blockbuster Movies
                </Link>
              </li>
              <li>
                <Link href="/tv" className="hover:text-brand-red transition-colors flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5" /> Trending TV Series
                </Link>
              </li>
              <li>
                <Link href="/hindi" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-amber-400" /> Hindi Dubbed & Bollywood
                </Link>
              </li>
              <li>
                <Link href="/anime" className="hover:text-brand-red transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-violet" /> Anime & Asian Drama
                </Link>
              </li>
            </ul>
          </div>

          {/* Streaming Servers */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Playback Servers
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Server 1 — HINDI (Screenscape • 4K UHD)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Server 2 — ENGLISH &amp; HINDI (Filmu • Full HD)</span>
              </li>
            </ul>
          </div>

          {/* Legal Disclaimer */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Legal Disclaimer
            </h4>
            <p className="text-[11px] text-zinc-500 leading-relaxed space-y-1">
              KinoVerse is a <strong className="text-zinc-400">search and discovery index</strong>. We do
              <strong className="text-zinc-400"> not host, upload, store or distribute</strong> any video, media files or copyrighted content on our servers.
              All streams are sourced from independent third-party embed providers over which we have no control.
              KinoVerse is not responsible for the content, accuracy or legality of any linked third-party streams.
              For DMCA / takedown requests, contact the respective third-party embed provider directly.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} KinoVerse — For entertainment discovery purposes only.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hover:text-zinc-300 transition-colors cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-zinc-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-zinc-300 transition-colors cursor-pointer">DMCA Notice</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
