"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Dropzone from '../components/Dropzone';
import ArtistCard from '../components/ArtistCard';
import { useArtists } from '../context/ArtistsContext';

export default function Home() {
  const router = useRouter();
  const { artists, addArtists, clearArtists } = useArtists();

  const handleDrop = (newArtists: { name: string; artworks: string[] }[]) => {
    addArtists(newArtists);
  };

  const handleArtistClick = (artistName: string) => {
    router.push(`/artist/${encodeURIComponent(artistName)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-5xl font-light mb-8 text-center">Galerie d'Art</h1>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
          Bienvenue dans votre galerie d'art locale. Sélectionnez un dossier contenant des sous-dossiers d'artistes pour commencer.
        </p>

        <div className="mb-16">
          <Dropzone onDrop={handleDrop} />
        </div>

        {artists.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-light">Artistes ({artists.length})</h2>
              <button
                onClick={clearArtists}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                Effacer la bibliothèque
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {artists.map((artist, index) => (
                <ArtistCard
                  key={index}
                  name={artist.name}
                  onClick={() => handleArtistClick(artist.name)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
