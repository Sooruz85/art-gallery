"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import GalleryGrid from '../../../components/GalleryGrid';
import { useArtists } from '../../../context/ArtistsContext';

export default function ArtistPage() {
  const params = useParams();
  const artistName = decodeURIComponent(params.name as string);
  const { getArtistArtworks } = useArtists();
  const artworks = getArtistArtworks(artistName);

  if (artworks.length === 0) {
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
          <p className="text-lg text-gray-600">Aucune œuvre trouvée pour cet artiste.</p>
        </div>
      </div>
    );
  }

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

        <h1 className="text-5xl font-light mb-12">{artistName}</h1>

        <GalleryGrid artworks={artworks} artistName={artistName} />
      </div>
    </div>
  );
}
