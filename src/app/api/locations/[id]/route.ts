import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { deleteUploadedImage } from '@/lib/file-utils';
import path from 'path';
import fs from 'fs';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const hours = formData.get('hours') as string;
    const description = formData.get('description') as string;
    const featuresJson = formData.get('features') as string;
    const coordinatesLat = formData.get('coordinatesLat') as string;
    const coordinatesLng = formData.get('coordinatesLng') as string;
    const imagesToDeleteJson = formData.get('images_to_delete') as string;
    const images = formData.getAll('images') as File[];

    const result = db.prepare(`
      UPDATE locations 
      SET name = ?, address = ?, phone = ?, email = ?, hours = ?, description = ?, 
          features = ?, coordinates_lat = ?, coordinates_lng = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run([
      name, 
      address, 
      phone, 
      email, 
      hours, 
      description, 
      featuresJson || '[]', 
      coordinatesLat ? parseFloat(coordinatesLat) : null,
      coordinatesLng ? parseFloat(coordinatesLng) : null,
      id
    ]);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    // Handle images to delete
    if (imagesToDeleteJson) {
      try {
        const imagesToDelete = JSON.parse(imagesToDeleteJson);
        for (const filename of imagesToDelete) {
          // Delete from database
          db.prepare('DELETE FROM location_images WHERE location_id = ? AND filename = ?').run([id, filename]);
          
          // Delete file from filesystem
          try {
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
            const filePath = path.join(uploadsDir, filename);
            await fs.promises.unlink(filePath);
          } catch (error) {
            console.error('Failed to delete file:', filename, error);
          }
        }
      } catch (error) {
        console.error('Error parsing images to delete:', error);
      }
    }

    // Handle new image uploads
    const uploadedImages = [];
    for (const file of images) {
      if (file instanceof Blob && file.size > 0) {
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
        const imageResult = db.prepare(`
          INSERT INTO location_images (location_id, filename, original_name, file_size, is_primary) 
          VALUES (?, ?, ?, ?, ?)
        `).run([id, filename, file.name, file.size, false]);
        
        uploadedImages.push({
          id: imageResult.lastInsertRowid,
          filename,
          original_name: file.name,
          file_size: file.size,
          is_primary: false
        });
      }
    }

    return NextResponse.json({ 
      message: 'Location updated successfully',
      uploaded_images: uploadedImages.length,
      deleted_images: imagesToDeleteJson ? JSON.parse(imagesToDeleteJson).length : 0
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = db.prepare("DELETE FROM locations WHERE id = ?").run([id]);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Location deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}