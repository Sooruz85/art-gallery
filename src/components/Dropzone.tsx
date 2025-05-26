"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneProps {
  onDrop: (artists: { name: string; artworks: string[] }[]) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onDrop }) => {
  const [error, setError] = useState<string | null>(null);
  const isFileSystemAccessSupported = typeof window !== 'undefined' && 'showDirectoryPicker' in window;

  const handleFileSystemAccess = useCallback(async () => {
    try {
      const dirHandle = await window.showDirectoryPicker();
      const artists: { name: string; artworks: string[] }[] = [];

      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'directory') {
          const artworks: string[] = [];
          for await (const file of entry.values()) {
            if (file.kind === 'file' && file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
              const fileHandle = await entry.getFileHandle(file.name);
              const fileObj = await fileHandle.getFile();
              artworks.push(URL.createObjectURL(fileObj));
            }
          }
          if (artworks.length > 0) {
            artists.push({ name: entry.name, artworks });
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

  const handleLegacyFileInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const artists: { [key: string]: string[] } = {};

    Array.from(files).forEach((file) => {
      if (file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        const path = file.webkitRelativePath;
        const artistName = path.split('/')[0];

        if (!artists[artistName]) {
          artists[artistName] = [];
        }
        artists[artistName].push(URL.createObjectURL(file));
      }
    });

    const formattedArtists = Object.entries(artists).map(([name, artworks]) => ({
      name,
      artworks
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
