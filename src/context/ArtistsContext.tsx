"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Artist {
  name: string;
  artworks: string[];
}

interface ArtistsContextType {
  artists: Artist[];
  setArtists: (artists: Artist[]) => void;
  getArtistArtworks: (artistName: string) => string[];
}

const ArtistsContext = createContext<ArtistsContextType | undefined>(undefined);

export function ArtistsProvider({ children }: { children: ReactNode }) {
  const [artists, setArtists] = useState<Artist[]>([]);

  const getArtistArtworks = (artistName: string) => {
    const artist = artists.find(a => a.name === artistName);
    return artist?.artworks || [];
  };

  return (
    <ArtistsContext.Provider value={{ artists, setArtists, getArtistArtworks }}>
      {children}
    </ArtistsContext.Provider>
  );
}

export function useArtists() {
  const context = useContext(ArtistsContext);
  if (context === undefined) {
    throw new Error('useArtists must be used within an ArtistsProvider');
  }
  return context;
}
