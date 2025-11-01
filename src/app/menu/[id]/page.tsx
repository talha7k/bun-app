import { notFound } from 'next/navigation';
import MenuItemDetailClient from './MenuItemDetailClient';

async function getMenuItem(id: number) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/menu-items/${id}`, {
      cache: 'no-store' // Ensure fresh data is fetched
    });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch menu item:', error);
    return null;
  }
}

export default async function MenuItemDetail({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    notFound();
  }

  const menuItem = await getMenuItem(id);

  if (!menuItem) {
    notFound();
  }

  return <MenuItemDetailClient menuItem={menuItem} />;
}