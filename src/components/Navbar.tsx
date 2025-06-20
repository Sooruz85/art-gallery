"use client";

import React from 'react';
import Image from 'next/image';

interface NavbarProps {
  onSearch?: (value: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const [search, setSearch] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (onSearch) onSearch(value);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo et Titre */}
        <div className="flex items-center space-x-3">
          <div className="relative h-10 w-10">
            <Image
              src="/logo.jpeg"
              alt="Logo Galerie Joséphine"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="text-2xl font-bold text-gray-900 tracking-tight">
            Galerie Joséphine
          </div>
        </div>
        {/* Barre de recherche */}
        <div className="flex items-center">
          <input
            type="text"
            value={search}
            onChange={handleChange}
            placeholder="Rechercher un artiste..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-64 text-gray-800"
            aria-label="Rechercher un artiste"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
