import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const images = db.prepare(`
      SELECT mii.*, mi.name as menu_item_name 
      FROM menu_item_images mii
      LEFT JOIN menu_items mi ON mii.menu_item_id = mi.id
      ORDER BY mii.created_at DESC
    `).all();
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}