"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneProps {
  onDrop: (artists: { name: string; images: string[] }[]) => void;
}

interface FileSystemDirectoryHandle {
  values(): AsyncIterable<FileSystemHandle>;
}

declare global {
  interface Window {
    showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>;
  }
}

const Dropzone: React.FC<DropzoneProps> = ({ onDrop }) => {
  const [error, setError] = useState<string | null>(null);
  const isFileSystemAccessSupported = typeof window !== 'undefined' && 'showDirectoryPicker' in window;

  const saveFileToPublic = async (file: File, artistName: string): Promise<string> => {
    const timestamp = Date.now();
    const cleanFileName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .toLowerCase();
    const fileName = `${artistName}_${timestamp}_${cleanFileName}`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);

    try {
      console.log('[Dropzone] Upload du fichier:', {
        originalName: file.name,
        cleanName: cleanFileName,
        finalName: fileName
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload du fichier');
      }

      const data = await response.json();
      const imageUrl = `/uploads/${data.fileName}`;
      console.log('[Dropzone] Fichier uploadé avec succès:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('[Dropzone] Erreur lors de la sauvegarde du fichier:', error);
      throw error;
    }
  };

  const handleFileSystemAccess = useCallback(async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      const artists: { name: string; images: string[] }[] = [];

      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'directory') {
          const images: string[] = [];
          for await (const file of entry.values()) {
            if (file.kind === 'file' && file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
              const fileHandle = await entry.getFileHandle(file.name);
              const fileObj = await fileHandle.getFile();
              const imageUrl = await saveFileToPublic(fileObj, entry.name);
              images.push(imageUrl);
            }
          }
          if (images.length > 0) {
            artists.push({ name: entry.name, images });
          }
        }
      }
      onDrop(artists);
      setError(null);
    } catch (error) {
      console.error('Erreur lors de la lecture du dossier:', error);
      setError('Une erreur est survenue lors de la lecture du dossier.');
    }
  }, [onDrop]);

  const handleLegacyFileInput = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const artists: { [key: string]: string[] } = {};

    for (const file of Array.from(files)) {
      if (file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        const path = file.webkitRelativePath;
        const artistName = path.split('/')[0];

        if (!artists[artistName]) {
          artists[artistName] = [];
        }
        const imageUrl = await saveFileToPublic(file, artistName);
        artists[artistName].push(imageUrl);
      }
    }

    const formattedArtists = Object.entries(artists).map(([name, images]) => ({
      name,
      images
    }));

    onDrop(formattedArtists);
    setError(null);
  }, [onDrop]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: isFileSystemAccessSupported ? handleFileSystemAccess : undefined,
    noClick: true,
    noKeyboard: true
  });

  return (
    <div className="space-y-4">
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors">
        {isFileSystemAccessSupported ? (
          <>
            <input {...getInputProps()} />
            <p className="text-gray-600 text-lg">Glissez-déposez un dossier ici, ou cliquez pour sélectionner un dossier</p>
            <p className="text-gray-400 text-sm mt-2">Chaque sous-dossier représentera un artiste</p>
          </>
        ) : (
          <div>
            <p className="text-gray-600 text-lg mb-4">Votre navigateur ne supporte pas la sélection de dossier moderne.</p>
            <label className="inline-block px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
              Sélectionner un dossier
              <input
                type="file"
                webkitdirectory="true"
                directory=""
                multiple
                onChange={handleLegacyFileInput}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-center">{error}</p>
      )}
    </div>
  );
};

export default Dropzone;
