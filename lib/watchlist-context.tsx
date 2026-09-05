'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { MediaItem, MediaType, WatchlistItem } from './types';
import { getReleaseDate, getTitle } from './tmdb';

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (item: MediaItem) => void;
  removeFromWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
  toggleWatchlist: (item: MediaItem) => void;
  clearWatchlist: () => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem('kinoverse_watchlist');
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load watchlist from localStorage', e);
    }
  }, []);

  const saveWatchlist = (items: WatchlistItem[]) => {
    setWatchlist(items);
    try {
      localStorage.setItem('kinoverse_watchlist', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save watchlist to localStorage', e);
    }
  };

  const addToWatchlist = (item: MediaItem) => {
    if (watchlist.some((i) => i.id === item.id)) return;
    const newItem: WatchlistItem = {
      id: item.id,
      title: getTitle(item),
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      media_type: (item.media_type as MediaType) || (item.title ? 'movie' : 'tv'),
      vote_average: item.vote_average,
      release_date: getReleaseDate(item),
      addedAt: Date.now(),
    };
    saveWatchlist([newItem, ...watchlist]);
  };

  const removeFromWatchlist = (id: number) => {
    saveWatchlist(watchlist.filter((i) => i.id !== id));
  };

  const isInWatchlist = (id: number) => {
    return watchlist.some((i) => i.id === id);
  };

  const toggleWatchlist = (item: MediaItem) => {
    if (isInWatchlist(item.id)) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist(item);
    }
  };

  const clearWatchlist = () => {
    saveWatchlist([]);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist: isMounted ? watchlist : [],
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        toggleWatchlist,
        clearWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
