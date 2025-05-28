import { NextRequest, NextResponse } from 'next/server';
import { getArtists, saveArtists } from '../../../../services/artistService';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const artistName = decodeURIComponent(params.name);
    const artists = await getArtists();
    const updatedArtists = artists.filter(artist => artist.name !== artistName);

    if (updatedArtists.length === artists.length) {
      return NextResponse.json(
        { error: 'Artiste non trouvé' },
        { status: 404 }
      );
    }

    await saveArtists(updatedArtists);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'artiste:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const artistName = decodeURIComponent(params.name);
    const { mainImage } = await request.json();

    if (!mainImage) {
      return NextResponse.json(
        { error: 'Image principale manquante' },
        { status: 400 }
      );
    }

    const artists = await getArtists();
    const artistIndex = artists.findIndex(artist => artist.name === artistName);

    if (artistIndex === -1) {
      return NextResponse.json(
        { error: 'Artiste non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que l'image existe dans la liste des images de l'artiste
    const artist = artists[artistIndex];
    if (!artist.images.includes(mainImage)) {
      return NextResponse.json(
        { error: 'Image non trouvée dans la galerie de l\'artiste' },
        { status: 400 }
      );
    }

    // Réorganiser les images pour mettre l'image principale en première position
    artist.images = [mainImage, ...artist.images.filter(img => img !== mainImage)];
    await saveArtists(artists);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'image principale:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
