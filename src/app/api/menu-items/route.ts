import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { deleteUploadedImage } from '@/lib/file-utils';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const popular = searchParams.get('popular');
    
    let query = `
      SELECT mi.*, c.name as category_name 
      FROM menu_items mi 
      LEFT JOIN categories c ON mi.category_id = c.id
    `;
    const params: any[] = [];
    
    if (category) {
      query += " WHERE c.name = ?";
      params.push(category);
    }
    
    if (popular === 'true') {
      query += params.length > 0 ? " AND mi.popular = 1" : " WHERE mi.popular = 1";
    }
    
    query += " ORDER BY mi.created_at DESC";
    
    const menuItems: any[] = db.prepare(query).all(...params);
    
    // Get tags and images for each menu item
    const itemsWithTags = menuItems.map((item: any) => {
      const tags = db.prepare(`
        SELECT t.name FROM tags t 
        JOIN menu_item_tags mit ON t.id = mit.tag_id 
        WHERE mit.menu_item_id = ?
      `).all(item.id) as { name: string }[];
      
      const images = db.prepare(`
        SELECT id, filename, original_name, file_size, created_at 
        FROM menu_item_images 
        WHERE menu_item_id = ?
        ORDER BY created_at DESC
      `).all(item.id);
      
      return {
        ...item,
        popular: Boolean(item.popular),
        tags: tags.map(tag => tag.name),
        images: images
      };
    });
    
    return NextResponse.json(itemsWithTags);
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
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const categoryId = formData.get('categoryId') as string;
    const popular = formData.get('popular') === 'true';
    const tagsJson = formData.get('tags') as string;
    const images = formData.getAll('images') as File[];
    
    const result = db.prepare(`
      INSERT INTO menu_items (name, description, price, image_url, category_id, popular) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).run([name, description, price, null, categoryId, popular ? 1 : 0]);
    
    const menuItemId = result.lastInsertRowid as number;
    
    // Handle multiple image uploads
    const uploadedImages = [];
    if (images && images.length > 0) {
      for (const imageFile of images) {
        if (imageFile.size > 0) {
          // Generate unique filename
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 15);
          const fileExtension = (imageFile.name.split('.').pop() || 'jpg').toLowerCase();
          const filename = `${timestamp}_${randomString}.${fileExtension}`;
          
          // Ensure public/uploads directory exists
          const fs = await import('fs');
          const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          
          // Save file to public/uploads directory
          const buffer = await imageFile.arrayBuffer();
          const filePath = path.join(uploadsDir, filename);
          fs.writeFileSync(filePath, Buffer.from(buffer));
          
          // Save to database
          const imageResult = db.prepare(`
            INSERT INTO menu_item_images (menu_item_id, filename, original_name, file_size) 
            VALUES (?, ?, ?, ?)
          `).run([menuItemId, filename, imageFile.name, imageFile.size]);
          
          uploadedImages.push({
            id: imageResult.lastInsertRowid,
            filename,
            original_name: imageFile.name,
            file_size: imageFile.size
          });
        }
      }
    }
    
    // Add tags if provided
    if (tagsJson) {
      try {
        const tags = JSON.parse(tagsJson);
        tags.forEach((tagName: string) => {
          db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)').run([tagName]);
          
          const tag = db.prepare('SELECT id FROM tags WHERE name = ?').get(tagName) as { id: number } | undefined;
          if (tag) {
            db.prepare('INSERT OR IGNORE INTO menu_item_tags (menu_item_id, tag_id) VALUES (?, ?)').run([menuItemId, tag.id]);
          }
        });
      } catch (error) {
        console.error('Error parsing tags:', error);
      }
    }
    
    return NextResponse.json({ 
      message: 'Menu item created successfully', 
      id: menuItemId,
      uploaded_images: uploadedImages.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}