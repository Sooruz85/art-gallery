"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ArtistCardProps {
  name: string;
  imageUrl?: string;
  onClick?: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ name, imageUrl, onClick }) => {
  // Log pour le débogage
  useEffect(() => {
    console.log(`[ArtistCard] Données reçues pour ${name}:`, {
      imageUrl,
      isValid: imageUrl && imageUrl.startsWith('/uploads/')
    });
  }, [imageUrl, name]);

  // Vérification stricte de l'URL de l'image
  const isValidImage = imageUrl &&
    typeof imageUrl === 'string' &&
    imageUrl.trim() !== '';

  // Construction du chemin de l'image avec encodage
  const imagePath = isValidImage
    ? `/uploads/${encodeURIComponent(imageUrl.split('/').pop() || '')}`
    : '/placeholder.jpg';

  console.log(`[ArtistCard] Chemin de l'image pour ${name}:`, {
    original: imageUrl,
    processed: imagePath
  });

  const content = (
    <div className="group relative aspect-[3/4] min-h-[180px] overflow-hidden rounded-lg bg-gray-100">
      <Image
        src={imagePath}
        alt={`Œuvre de ${name}`}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        onError={(e) => {
          console.error(`[ArtistCard] Erreur de chargement pour ${name}:`, {
            originalUrl: imageUrl,
            processedPath: imagePath,
            error: e
          });
          // Remplacer l'image par un message d'erreur
          const target = e.target as HTMLElement;
          target.style.display = 'none';
          target.parentElement?.insertAdjacentHTML(
            'beforeend',
            `<div class='absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm'>Image non disponible</div>`
          );
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-white/70 p-4">
        <h3 className="text-lg font-medium text-gray-900">{name}</h3>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <div onClick={onClick} className="cursor-pointer">
        {content}
      </div>
    );
  }

  return (
    <Link href={`/artist/${encodeURIComponent(name)}`}>
      {content}
    </Link>
  );
};

export default ArtistCard;
