"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Artist {
  name: string;
  artworks: string[];
}

interface ArtistsContextType {
  artists: Artist[];
  addArtists: (newArtists: Artist[]) => void;
  getArtistArtworks: (artistName: string) => string[];
  clearArtists: () => void;
}

const STORAGE_KEY = 'art-gallery-artists';

const ArtistsContext = createContext<ArtistsContextType | undefined>(undefined);

export function ArtistsProvider({ children }: { children: ReactNode }) {
  const [artists, setArtists] = useState<Artist[]>([]);

  // Charger les artistes depuis le localStorage au démarrage
  useEffect(() => {
    const storedArtists = localStorage.getItem(STORAGE_KEY);
    if (storedArtists) {
      try {
        setArtists(JSON.parse(storedArtists));
      } catch (error) {
        console.error('Erreur lors du chargement des artistes:', error);
      }
    }
  }, []);

  // Sauvegarder les artistes dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(artists));
  }, [artists]);

  const addArtists = (newArtists: Artist[]) => {
    setArtists(currentArtists => {
      const updatedArtists = [...currentArtists];

      newArtists.forEach(newArtist => {
        const existingArtistIndex = updatedArtists.findIndex(
          a => a.name === newArtist.name
        );

        if (existingArtistIndex === -1) {
          // Nouvel artiste
          updatedArtists.push(newArtist);
        } else {
          // Fusionner les œuvres de l'artiste existant
          const existingArtist = updatedArtists[existingArtistIndex];
          const mergedArtworks = [...new Set([
            ...existingArtist.artworks,
            ...newArtist.artworks
          ])];
          updatedArtists[existingArtistIndex] = {
            ...existingArtist,
            artworks: mergedArtworks
          };
        }
      });

      return updatedArtists;
    });
  };

  const getArtistArtworks = (artistName: string) => {
    const artist = artists.find(a => a.name === artistName);
    return artist?.artworks || [];
  };

  const clearArtists = () => {
    setArtists([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ArtistsContext.Provider value={{ artists, addArtists, getArtistArtworks, clearArtists }}>
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
