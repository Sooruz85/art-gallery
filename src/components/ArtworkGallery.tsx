"use client";

import React, { useState } from 'react';
import Image from 'next/image';

interface ArtworkGalleryProps {
  artworks: string[];
  artistName: string;
}

const ArtworkGallery: React.FC<ArtworkGalleryProps> = ({ artworks, artistName }) => {
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
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
            <Image
              src={selectedImage}
              alt="Œuvre en plein écran"
              fill
              className="object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworkGallery;
