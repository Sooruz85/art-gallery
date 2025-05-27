import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileName = formData.get('fileName') as string;

    if (!file || !fileName) {
      console.error('[Upload] Fichier ou nom de fichier manquant:', { file, fileName });
      return NextResponse.json(
        { error: 'Fichier ou nom de fichier manquant' },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      console.error('[Upload] Type de fichier non supporté:', file.type);
      return NextResponse.json(
        { error: 'Type de fichier non supporté' },
        { status: 400 }
      );
    }

    // Créer le dossier uploads s'il n'existe pas
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      console.log('[Upload] Création du dossier uploads:', uploadDir);
      await mkdir(uploadDir, { recursive: true });
    }

    // Nettoyer le nom du fichier
    const cleanFileName = fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/\s+/g, '_')
      .toLowerCase();

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sauvegarder le fichier
    const filePath = path.join(uploadDir, cleanFileName);
    await writeFile(filePath, buffer);

    console.log('[Upload] Fichier sauvegardé avec succès:', {
      originalName: fileName,
      cleanName: cleanFileName,
      path: filePath,
      size: buffer.length,
      url: `/uploads/${cleanFileName}`
    });

    return NextResponse.json({
      success: true,
      fileName: cleanFileName,
      url: `/uploads/${cleanFileName}`
    });
  } catch (error) {
    console.error('[Upload] Erreur lors de l\'upload:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    );
  }
}
