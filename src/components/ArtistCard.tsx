"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Camera } from 'lucide-react';
import { useArtists } from '../context/ArtistsContext';

interface ArtistCardProps {
  name: string;
  imageUrl?: string;
  onClick?: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ name, imageUrl, onClick }) => {
  const { deleteArtist, updateArtistMainImage } = useArtists();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'artiste "${name}" ?`)) {
      try {
        setIsDeleting(true);
        await deleteArtist(name);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Une erreur est survenue lors de la suppression de l\'artiste.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUpdating(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', `${name}_${Date.now()}_${file.name}`);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload de l\'image');
      }

      const data = await response.json();
      const newImageUrl = `/uploads/${data.fileName}`;
      await updateArtistMainImage(name, newImageUrl);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'image:', error);
      alert('Une erreur est survenue lors de la mise à jour de l\'image.');
    } finally {
      setIsUpdating(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const content = (
    <div className="group relative aspect-[3/4] min-h-[180px] overflow-hidden rounded-lg bg-gray-100">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
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
          const target = e.target as HTMLElement;
          target.style.display = 'none';
          target.parentElement?.insertAdjacentHTML(
            'beforeend',
            `<div class='absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm'>Image non disponible</div>`
          );
        }}
      />
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={handleImageClick}
          disabled={isUpdating}
          className="p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          title="Changer l'image principale"
        >
          <Camera className="w-5 h-5 text-blue-600" />
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          title="Supprimer l'artiste"
        >
          <Trash2 className="w-5 h-5 text-red-600" />
        </button>
      </div>
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
