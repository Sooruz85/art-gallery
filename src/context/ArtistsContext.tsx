"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Artist {
  name: string;
  images: string[];
}

interface ArtistsContextType {
  artists: Artist[];
  addArtists: (newArtists: Artist[]) => void;
  getArtistImages: (artistName: string) => string[];
  clearArtists: () => void;
}

const ArtistsContext = createContext<ArtistsContextType | undefined>(undefined);

export function ArtistsProvider({ children }: { children: ReactNode }) {
  const [artists, setArtists] = useState<Artist[]>([]);

  // Charger les artistes depuis l'API au démarrage
  useEffect(() => {
    const loadArtists = async () => {
      try {
        const response = await fetch('/api/artists');
        if (response.ok) {
          const data = await response.json();
          setArtists(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des artistes:', error);
      }
    };

    loadArtists();
  }, []);

  const addArtists = async (newArtists: Artist[]) => {
    try {
      // Sauvegarder chaque artiste via l'API
      for (const artist of newArtists) {
        await fetch('/api/artists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(artist),
        });
      }

      // Recharger les artistes depuis l'API
      const response = await fetch('/api/artists');
      if (response.ok) {
        const data = await response.json();
        setArtists(data);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout des artistes:', error);
    }
  };

  const getArtistImages = (artistName: string) => {
    const artist = artists.find(a => a.name === artistName);
    return artist?.images || [];
  };

  const clearArtists = async () => {
    try {
      await fetch('/api/artists', { method: 'DELETE' });
      setArtists([]);
    } catch (error) {
      console.error('Erreur lors de la suppression des artistes:', error);
    }
  };

  return (
    <ArtistsContext.Provider value={{ artists, addArtists, getArtistImages, clearArtists }}>
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
