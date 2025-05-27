"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';

interface LightboxProps {
  image: string;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ image, onClose }) => {
  useEffect(() => {
    console.log('[Lightbox] Image reçue:', image);
  }, [image]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const isValidImage = image && image.trim() !== '';

  if (!isValidImage) {
    console.warn('[Lightbox] Image invalide:', image);
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
      onClick={onClose}
    >
      <div className="relative w-[80vw] h-[80vh] min-h-[180px] max-h-[90vh] max-w-[90vw]">
        <Image
          src={image}
          alt="Œuvre en plein écran"
          fill
          sizes="90vw"
          className="object-contain"
          onClick={(e) => e.stopPropagation()}
          onError={(e) => {
            console.error('[Lightbox] Erreur de chargement:', e);
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement?.classList.add('bg-gray-100');
          }}
        />
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-300"
          onClick={onClose}
        >
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Lightbox;
