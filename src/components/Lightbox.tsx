"use client";

import React from 'react';
import Image from 'next/image';

interface LightboxProps {
  image: string;
  alt: string;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ image, alt, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-contain"
          priority
        />
        <button
          className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Lightbox;
