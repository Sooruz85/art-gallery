"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Lightbox from './Lightbox';

interface GalleryGridProps {
  artworks: string[];
  artistName: string;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ artworks, artistName }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {artworks.map((artwork, index) => (
          <div
            key={index}
            className="relative aspect-square cursor-pointer overflow-hidden group"
            onClick={() => setSelectedImage(artwork)}
          >
            <Image
              src={artwork}
              alt={`${artistName} - Œuvre ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <Lightbox
          image={selectedImage}
          alt={`${artistName} - Œuvre en plein écran`}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default GalleryGrid;
