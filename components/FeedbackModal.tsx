'use client';

import React, { useState } from 'react';
import { 
  MessageSquarePlus, 
  Send, 
  ExternalLink, 
  X, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check,
  Film,
  VolumeX,
  Radio
} from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
  mediaTitle?: string;
}

const DISCORD_INVITE_URL = 'https://discord.gg/HfPr7BaSG';

const CATEGORIES = [
  { id: 'broken_stream', label: 'Broken / Black Screen', icon: Radio },
  { id: 'hindi_audio', label: 'Missing Hindi Audio', icon: VolumeX },
  { id: 'buffering', label: 'Buffering & Slow Speed', icon: AlertTriangle },
  { id: 'movie_request', label: 'Request Movie / Series', icon: Film },
  { id: 'suggestion', label: 'Feature / UI Suggestion', icon: Sparkles },
];

export default function FeedbackModal({
  isOpen,
  onClose,
  defaultCategory = 'broken_stream',
  mediaTitle,
}: FeedbackModalProps) {
  const [category, setCategory] = useState(defaultCategory);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyDiscord = () => {
    navigator.clipboard.writeText(DISCORD_INVITE_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    // Simulate instant local submission
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFeedbackText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-surface-300 rounded-3xl p-6 border border-white/10 shadow-2xl shadow-black space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5865F2]/20 text-[#5865F2] flex items-center justify-center border border-[#5865F2]/30 shadow-lg shadow-[#5865F2]/20">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Community Feedback & Support</h3>
              <p className="text-xs text-zinc-400">Report issues, request titles or talk to us on Discord</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-surface-100 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Discord Direct CTA Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#5865F2]/25 via-surface-200 to-[#5865F2]/10 border border-[#5865F2]/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wide">
                Direct Discord Server
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5865F2] text-white font-extrabold">
              Active Support
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            Join our official Discord community for instant problem resolution, Hindi audio fixes, and movie requests directly with the developer.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold shadow-lg shadow-[#5865F2]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Join Discord Server</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleCopyDiscord}
              className="p-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-zinc-300 hover:text-white transition-colors"
              title="Copy Discord Invite Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Feedback Submission Form */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mediaTitle && (
              <div className="text-[11px] px-3 py-1.5 rounded-xl bg-surface-100 border border-white/10 text-zinc-300">
                Reporting for title: <span className="font-bold text-white">{mediaTitle}</span>
              </div>
            )}

            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Feedback Category
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-brand-red/20 border-brand-red text-white font-bold shadow-md shadow-brand-red/20'
                          : 'bg-surface-100/60 hover:bg-surface-50 border-white/5 text-zinc-300'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-brand-red flex-shrink-0" />
                      <span className="truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback textarea */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Describe the problem / request
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Example: Server 1 is buffering on episode 3, or please add Hindi audio for Inception..."
                rows={3}
                required
                className="w-full bg-surface-100/80 text-white placeholder-zinc-500 text-xs rounded-xl p-3 border border-white/10 focus:border-brand-red focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Submit & Action buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-red hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-brand-red/30 transition-all hover:scale-[1.01]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Quick Feedback</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* Submission Success State */
          <div className="py-6 text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">Thank You for Your Feedback!</h4>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Your feedback has been noted. For real-time updates and direct developer chat, feel free to join our Discord!
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold shadow-lg flex items-center gap-1.5"
              >
                <span>Go to Discord</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-surface-100 hover:bg-surface-50 border border-white/10 text-xs font-semibold text-zinc-300"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
