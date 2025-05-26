import React from 'react';

interface ArtistCardProps {
  name: string;
  onClick: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ name, onClick }) => {
  return (
    <div
      className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <h2 className="text-xl font-light">{name}</h2>
    </div>
  );
};

export default ArtistCard;
