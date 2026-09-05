'use client';

import React from 'react';
import { X, Play } from 'lucide-react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoKey?: string;
  title: string;
}

export default function TrailerModal({
  isOpen,
  onClose,
  videoKey,
  title,
}: TrailerModalProps) {
  if (!isOpen || !videoKey) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-surface-300 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand-red flex items-center justify-center text-white">
              <Play className="w-3 h-3 fill-white" />
            </div>
            <h3 className="text-sm font-bold text-white line-clamp-1">{title} • Official Trailer</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-surface-100 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Embed */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
            title={`${title} Trailer`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
