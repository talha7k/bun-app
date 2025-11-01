import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const categories = db.prepare("SELECT * FROM categories ORDER BY name").all();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, icon } = await request.json();
    
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const result = db.prepare(`
      INSERT INTO categories (name, icon) 
      VALUES (?, ?)
    `).run([name.trim(), icon || null]);

    const newCategory = db.prepare("SELECT * FROM categories WHERE id = ?").get(result.lastInsertRowid) as any;
    return NextResponse.json(newCategory);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}