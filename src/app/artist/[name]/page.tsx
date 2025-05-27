"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import GalleryGrid from '../../../components/GalleryGrid';
import { useArtists } from '../../../context/ArtistsContext';
import Lightbox from '../../../components/Lightbox';

export default function ArtistPage() {
  const params = useParams();
  const { artists } = useArtists();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Vérification que nous sommes côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const artistName = decodeURIComponent(params.name as string);
  const artist = artists.find(a => a.name === artistName);

  // Log pour le débogage
  useEffect(() => {
    if (isClient) {
      console.log('[ArtistPage] Données de l\'artiste:', {
        name: artistName,
        found: !!artist,
        imagesCount: artist?.images?.length || 0
      });
    }
  }, [artist, artistName, isClient]);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-4">Chargement...</h1>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-4">Artiste non trouvé</h1>
          <p className="text-gray-600">L'artiste que vous recherchez n'existe pas dans la galerie.</p>
          <Link
            href="/"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800 transition-colors"
          >
            Retour à la galerie
          </Link>
        </div>
      </div>
    );
  }

  // Vérification sécurisée des images
  const validImages = Array.isArray(artist.images)
    ? artist.images.filter(url => url && typeof url === 'string' && url.trim() !== '')
    : [];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-12">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Retour à la galerie
          </Link>
        </div>

        <h1 className="text-5xl font-light mb-8">{artist.name}</h1>

        {validImages.length > 0 ? (
          <>
            <GalleryGrid
              images={validImages}
              onImageClick={setSelectedImage}
            />
            {selectedImage && (
              <Lightbox
                image={selectedImage}
                onClose={() => setSelectedImage(null)}
              />
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600">Aucune œuvre disponible pour cet artiste.</p>
          </div>
        )}
      </div>
    </div>
  );
}
