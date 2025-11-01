import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const locations: any[] = db.prepare(`
      SELECT l.*, 
             GROUP_CONCAT(li.filename) as images
      FROM locations l
      LEFT JOIN location_images li ON l.id = li.location_id
      GROUP BY l.id
      ORDER BY l.created_at DESC
    `).all();

    const locationsWithImages = locations.map(location => {
      const images = db.prepare(`
        SELECT id, filename, original_name, file_size, is_primary, created_at 
        FROM location_images 
        WHERE location_id = ?
        ORDER BY is_primary DESC, created_at DESC
      `).all(location.id);

      return {
        ...location,
        features: location.features ? JSON.parse(location.features) : [],
        images: images
      };
    });

    return NextResponse.json(locationsWithImages);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
    const images = formData.getAll('images') as File[];

    const result = db.prepare(`
      INSERT INTO locations (name, address, phone, email, hours, description, features, coordinates_lat, coordinates_lng) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run([
      name, 
      address, 
      phone, 
      email, 
      hours, 
      description, 
      featuresJson || '[]', 
      coordinatesLat ? parseFloat(coordinatesLat) : null,
      coordinatesLng ? parseFloat(coordinatesLng) : null
    ]);

    const locationId = result.lastInsertRowid as number;

    // Handle multiple image uploads
    const uploadedImages = [];
    for (const [index, file] of images.entries()) {
      if (file instanceof Blob && file.size > 0) {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = (file.name.split('.').pop() || 'jpg').toLowerCase();
        const filename = `${timestamp}_${randomString}.${fileExtension}`;
        
        // Ensure public/uploads directory exists
        const fs = await import('fs');
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
        `).run([locationId, filename, file.name, file.size, index === 0 ? 1 : 0]);
        
        uploadedImages.push({
          id: imageResult.lastInsertRowid,
          filename,
          original_name: file.name,
          file_size: file.size,
          is_primary: index === 0
        });
      }
    }

    return NextResponse.json({ 
      message: 'Location created successfully',
      locationId,
      images: uploadedImages 
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}