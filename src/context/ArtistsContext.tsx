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
  deleteArtist: (artistName: string) => void;
  updateArtistMainImage: (artistName: string, newImageUrl: string) => void;
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

  const deleteArtist = async (artistName: string) => {
    try {
      const response = await fetch(`/api/artists/${encodeURIComponent(artistName)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setArtists(prevArtists => prevArtists.filter(artist => artist.name !== artistName));
      } else {
        throw new Error('Erreur lors de la suppression de l\'artiste');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'artiste:', error);
      throw error;
    }
  };

  const updateArtistMainImage = async (artistName: string, newImageUrl: string) => {
    try {
      const response = await fetch(`/api/artists/${encodeURIComponent(artistName)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mainImage: newImageUrl }),
      });

      if (response.ok) {
        setArtists(prevArtists =>
          prevArtists.map(artist =>
            artist.name === artistName
              ? { ...artist, images: [newImageUrl, ...artist.images.filter(img => img !== newImageUrl)] }
              : artist
          )
        );
      } else {
        throw new Error('Erreur lors de la mise à jour de l\'image principale');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'image principale:', error);
      throw error;
    }
  };

  return (
    <ArtistsContext.Provider value={{
      artists,
      addArtists,
      getArtistImages,
      clearArtists,
      deleteArtist,
      updateArtistMainImage
    }}>
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
