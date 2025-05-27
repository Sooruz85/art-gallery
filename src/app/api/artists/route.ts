import { NextResponse } from 'next/server';
import { getArtists, addArtist, clearArtists } from '@/services/artistService';

export async function GET() {
  try {
    const artists = await getArtists();
    return NextResponse.json(artists);
  } catch (error) {
    console.error('Erreur lors de la récupération des artistes:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const artist = await request.json();
    await addArtist(artist);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'artiste:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await clearArtists();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression des artistes:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
