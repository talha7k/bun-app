import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { type Category } from '@/types/menu';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, icon } = await request.json();
    
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const result = db.prepare(`
      UPDATE categories 
      SET name = ?, icon = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run([name.trim(), icon || null, id]);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const updatedCategory = db.prepare("SELECT * FROM categories WHERE id = ?").get(id) as Category;
    return NextResponse.json(updatedCategory);
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

    // Check if category has menu items
    const menuItemsCount = db.prepare("SELECT COUNT(*) as count FROM menu_items WHERE category_id = ?").get(id) as { count: number };
    
    if (menuItemsCount.count > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete category with existing menu items. Please delete or reassign the menu items first.' 
        },
        { status: 400 }
      );
    }

    const result = db.prepare("DELETE FROM categories WHERE id = ?").run([id]);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}