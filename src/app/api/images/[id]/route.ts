import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { deleteUploadedImage } from '@/lib/file-utils';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: imageId } = await params;
    
    // Get image info before deletion
    const image = db.prepare("SELECT * FROM menu_item_images WHERE id = ?").get(imageId) as any;
    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }
    
    // Delete file from filesystem
    await deleteUploadedImage(`/uploads/${image.filename}`);
    
    // Delete from database
    db.prepare("DELETE FROM menu_item_images WHERE id = ?").run([imageId]);
    
    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}