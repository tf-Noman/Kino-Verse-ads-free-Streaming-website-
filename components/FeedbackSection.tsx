'use client';

import React, { useState } from 'react';
import { 
  MessageSquarePlus, 
  ExternalLink, 
  Sparkles, 
  Radio, 
  Volume2, 
  Copy, 
  Check, 
  HelpCircle,
  Bug,
  Flame
} from 'lucide-react';
import FeedbackModal from './FeedbackModal';

const DISCORD_INVITE_URL = 'https://discord.gg/HfPr7BaSG';

export default function FeedbackSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(DISCORD_INVITE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-[#5865F2]/30 p-6 sm:p-8 bg-gradient-to-r from-[#5865F2]/20 via-surface-300 to-red-950/20 shadow-2xl shadow-black/80">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5865F2]/10 blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5865F2]/30 text-[#8ea1e1] border border-[#5865F2]/40 text-xs font-black">
                <MessageSquarePlus className="w-3.5 h-3.5 text-[#5865F2]" />
                Discord Community & Support
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Developer Chat
              </span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Have a problem, request or feedback?
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Encountered a buffering stream, missing Hindi audio, or want to request a movie or TV show? Join our official Discord server to get direct help, report bugs, and chat directly with me!
            </p>

            {/* Feature points */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 pt-1">
              <span className="flex items-center gap-1">
                <Bug className="w-3.5 h-3.5 text-red-400" /> Report Broken Links
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" /> Request Hindi Audio
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Request Movies & TV
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto flex-shrink-0">
            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs sm:text-sm font-bold shadow-xl shadow-[#5865F2]/40 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Join Discord Server</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-surface-100/90 hover:bg-surface-50 border border-white/10 text-white text-xs sm:text-sm font-bold transition-all hover:scale-105"
            >
              <MessageSquarePlus className="w-4 h-4 text-brand-red" />
              <span>Send Quick Feedback</span>
            </button>

            <button
              onClick={handleCopy}
              className="hidden sm:flex items-center justify-center p-3.5 rounded-2xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-zinc-300 hover:text-white transition-colors"
              title="Copy Discord Invite Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
