import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { deleteUploadedImage } from '@/lib/file-utils';
import path from 'path';
import fs from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = db.prepare("SELECT * FROM menu_items WHERE id = ?").get(id) as any;
    
    if (!item) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }
    
    // Get tags for this menu item
    const tags = db.prepare(`
      SELECT t.name FROM tags t 
      JOIN menu_item_tags mit ON t.id = mit.tag_id 
      WHERE mit.menu_item_id = ?
    `).all(id) as { name: string }[];
    
    // Get images for this menu item
    const images = db.prepare(`
      SELECT id, filename, original_name, file_size, created_at 
      FROM menu_item_images 
      WHERE menu_item_id = ?
      ORDER BY created_at DESC
    `).all(id);
    
    item.tags = tags.map(tag => tag.name);
    item.popular = Boolean(item.popular);
    item.images = images;
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const categoryId = formData.get('categoryId') as string;
    const popular = formData.get('popular') === 'true';
    const tagsJson = formData.get('tags') as string;
    const images = formData.getAll('images') as File[];
    const imagesToDelete = formData.getAll('images_to_delete') as string[];
    
    // Update menu item basic info
    db.prepare(`
      UPDATE menu_items 
      SET name = ?, description = ?, price = ?, category_id = ?, popular = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run([name, description, price, categoryId, popular ? 1 : 0, id]);
    
    // Handle image deletions
    if (imagesToDelete && imagesToDelete.length > 0) {
      for (const imageId of imagesToDelete) {
        // Get image info before deletion
        const image = db.prepare("SELECT filename FROM menu_item_images WHERE id = ? AND menu_item_id = ?").get(imageId, id) as any;
        if (image) {
          // Delete file from filesystem
          await deleteUploadedImage(`/uploads/${image.filename}`);
          // Delete from database
          db.prepare("DELETE FROM menu_item_images WHERE id = ? AND menu_item_id = ?").run([imageId, id]);
        }
      }
    }
    
    // Handle new image uploads
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
          `).run([id, filename, imageFile.name, imageFile.size]);
          
          uploadedImages.push({
            id: imageResult.lastInsertRowid,
            filename,
            original_name: imageFile.name,
            file_size: imageFile.size
          });
        }
      }
    }
    
    // Update tags - remove existing tags and add new ones
    db.prepare('DELETE FROM menu_item_tags WHERE menu_item_id = ?').run([id]);
    
    if (tagsJson) {
      try {
        const tags = JSON.parse(tagsJson);
        tags.forEach((tagName: string) => {
          db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)').run([tagName]);
          
          const tag = db.prepare('SELECT id FROM tags WHERE name = ?').get(tagName) as { id: number } | undefined;
          if (tag) {
            db.prepare('INSERT OR IGNORE INTO menu_item_tags (menu_item_id, tag_id) VALUES (?, ?)').run([id, tag.id]);
          }
        });
      } catch (error) {
        console.error('Error parsing tags:', error);
      }
    }
    
    return NextResponse.json({ 
      message: 'Menu item updated successfully',
      uploaded_images: uploadedImages.length,
      deleted_images: imagesToDelete?.length || 0
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
    
    // Get all associated images before deletion
    const images = db.prepare("SELECT filename FROM menu_item_images WHERE menu_item_id = ?").all(id) as { filename: string }[];
    
    // Delete all associated image files
    for (const image of images) {
      await deleteUploadedImage(`/uploads/${image.filename}`);
    }
    
    // Delete menu item tags first
    db.prepare('DELETE FROM menu_item_tags WHERE menu_item_id = ?').run([id]);
    
    // Delete menu item images (will be auto-deleted by ON DELETE CASCADE, but let's be explicit)
    db.prepare('DELETE FROM menu_item_images WHERE menu_item_id = ?').run([id]);
    
    // Then delete the menu item
    db.prepare('DELETE FROM menu_items WHERE id = ?').run([id]);
    
    return NextResponse.json({ 
      message: 'Menu item deleted successfully',
      deleted_images: images.length
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}