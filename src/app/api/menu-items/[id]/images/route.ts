import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import path from 'path';
import fs from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: menuItemId } = await params;
    const images = db.prepare("SELECT * FROM menu_item_images WHERE menu_item_id = ? ORDER BY created_at DESC").all(menuItemId);
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: menuItemId } = await params;
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }
    
    const uploadedImages = [];
    
    for (const file of files) {
      if (file instanceof Blob && file.size > 0) {
        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = (file.name.split('.').pop() || 'jpg').toLowerCase();
        const filename = `${timestamp}_${randomString}.${fileExtension}`;
        
        // Ensure public/uploads directory exists
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        // Save file to public/uploads directory
        const buffer = await file.arrayBuffer();
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, Buffer.from(buffer));
        
        // Save to database
        const result = db.prepare(`
          INSERT INTO menu_item_images (menu_item_id, filename, original_name, file_size) 
          VALUES (?, ?, ?, ?)
        `).run([menuItemId, filename, file.name, file.size]);
        
        uploadedImages.push({
          id: result.lastInsertRowid,
          filename,
          original_name: file.name,
          file_size: file.size
        });
      }
    }
    
    return NextResponse.json({ 
      message: `${uploadedImages.length} images uploaded successfully`,
      images: uploadedImages 
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}