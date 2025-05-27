"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Dropzone from '../components/Dropzone';
import ArtistCard from '../components/ArtistCard';
import { useArtists } from '../context/ArtistsContext';

export default function Home() {
  const router = useRouter();
  const { artists = [], addArtists, clearArtists } = useArtists();
  const [isClient, setIsClient] = useState(false);

  // Vérification que nous sommes côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Log pour le débogage
  useEffect(() => {
    if (isClient) {
      console.log('[Home] État actuel des artistes:', artists);
    }
  }, [artists, isClient]);

  const handleDrop = (newArtists: { name: string; images: string[] }[]) => {
    try {
      if (!Array.isArray(newArtists)) {
        console.error('[Home] Les nouveaux artistes ne sont pas un tableau valide');
        return;
      }
      console.log('[Home] Nouveaux artistes reçus:', newArtists);
      addArtists(newArtists);
    } catch (error) {
      console.error('[Home] Erreur lors du traitement des nouveaux artistes:', error);
    }
  };

  const handleArtistClick = (artistName: string) => {
    try {
      if (!artistName) {
        console.error('[Home] Nom d\'artiste invalide');
        return;
      }
      router.push(`/artist/${encodeURIComponent(artistName)}`);
    } catch (error) {
      console.error('[Home] Erreur lors de la navigation:', error);
    }
  };

  // Vérification de la validité des artistes
  const validArtists = React.useMemo(() => {
    if (!isClient) return [];

    return Array.isArray(artists) ? artists.filter(artist =>
      artist &&
      typeof artist === 'object' &&
      typeof artist.name === 'string' &&
      Array.isArray(artist.images)
    ) : [];
  }, [artists, isClient]);

  // Si nous ne sommes pas encore côté client, afficher un état de chargement
  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-4">Chargement...</h1>
        </div>
      </div>
    );
  }

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

        {validArtists.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-light">Artistes ({validArtists.length})</h2>
              <button
                onClick={() => {
                  try {
                    clearArtists();
                  } catch (error) {
                    console.error('[Home] Erreur lors de la suppression des artistes:', error);
                  }
                }}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                Effacer la bibliothèque
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {validArtists.map((artist, index) => {
                try {
                  // Vérification sécurisée de l'image
                  const firstImage = artist?.images?.[0] || null;
                  const totalImages = artist?.images?.length || 0;

                  console.log(`[Home] Rendu de l'artiste ${artist.name}:`, {
                    firstImage,
                    totalImages
                  });

                  return (
                    <ArtistCard
                      key={`${artist.name}-${index}`}
                      name={artist.name || 'Artiste sans nom'}
                      imageUrl={firstImage}
                      onClick={() => handleArtistClick(artist.name)}
                    />
                  );
                } catch (error) {
                  console.error(`[Home] Erreur lors du rendu de l'artiste ${index}:`, error);
                  return null;
                }
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
