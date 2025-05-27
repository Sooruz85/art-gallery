import fs from 'fs/promises';
import path from 'path';

interface Artist {
  name: string;
  images: string[];
}

const DATA_FILE = path.join(process.cwd(), 'data', 'artists.json');

export async function getArtists(): Promise<Artist[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erreur lors de la lecture des artistes:', error);
    return [];
  }
}

export async function saveArtists(artists: Artist[]): Promise<void> {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(artists, null, 2));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des artistes:', error);
    throw error;
  }
}

export async function addArtist(artist: Artist): Promise<void> {
  const artists = await getArtists();
  const existingArtistIndex = artists.findIndex(a => a.name === artist.name);

  if (existingArtistIndex === -1) {
    artists.push(artist);
  } else {
    // Fusionner les images de l'artiste existant
    const existingArtist = artists[existingArtistIndex];
    const mergedImages = [...new Set([...existingArtist.images, ...artist.images])];
    artists[existingArtistIndex] = {
      ...existingArtist,
      images: mergedImages
    };
  }

  await saveArtists(artists);
}

export async function clearArtists(): Promise<void> {
  await saveArtists([]);
}
