"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface GalleryGridProps {
  images: string[];
  onImageClick?: (image: string) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ images, onImageClick }) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Log pour le débogage
  useEffect(() => {
    console.log('[GalleryGrid] Images reçues:', {
      count: images?.length || 0,
      images: images
    });
  }, [images]);

  // Vérification de la validité des images
  const validImages = Array.isArray(images)
    ? images.filter(url => {
        const isValid = url && typeof url === 'string' && url.trim() !== '';
        if (!isValid) {
          console.warn('[GalleryGrid] Image invalide ignorée:', url);
        }
        return isValid;
      })
    : [];

  if (!validImages.length) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">Aucune image disponible</p>
      </div>
    );
  }

  const handleImageLoad = (url: string) => {
    setLoadedImages(prev => new Set(prev).add(url));
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(url);
      return newSet;
    });
  };

  const handleImageError = (url: string, e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setFailedImages(prev => new Set(prev).add(url));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {validImages.map((imageUrl, index) => {
        // Vérification et nettoyage de l'URL
        const cleanUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
        const isLoaded = loadedImages.has(cleanUrl);
        const hasFailed = failedImages.has(cleanUrl);

        return (
          <div
            key={`${cleanUrl}-${index}`}
            className="relative aspect-square min-h-[180px] h-full w-full cursor-pointer overflow-hidden rounded-lg bg-gray-100 group border border-gray-200"
            style={{ minHeight: 180 }}
            tabIndex={0}
            aria-label={hasFailed ? 'Image non disponible' : `Image ${index + 1}`}
            onClick={() => !hasFailed && onImageClick?.(cleanUrl)}
            onKeyDown={e => {
              if (!hasFailed && (e.key === 'Enter' || e.key === ' ')) {
                onImageClick?.(cleanUrl);
              }
            }}
          >
            {!isLoaded && !hasFailed && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" aria-label="Chargement de l'image"></div>
              </div>
            )}
            {hasFailed ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4 z-20">
                <svg
                  className="w-12 h-12 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p className="text-gray-500 text-sm text-center">
                  Image non disponible
                </p>
              </div>
            ) : (
              <Image
                src={cleanUrl}
                alt={`Image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-cover transition-all duration-300 ${
                  isLoaded ? 'opacity-100 group-hover:scale-105' : 'opacity-0'
                }`}
                onLoad={() => handleImageLoad(cleanUrl)}
                onError={(e) => handleImageError(cleanUrl, e)}
                priority={index < 4}
                quality={90}
                unoptimized
                draggable={false}
              />
            )}
            {!hasFailed && (
              <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-300 group-hover:bg-opacity-20 pointer-events-none" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GalleryGrid;
