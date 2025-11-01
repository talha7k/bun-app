import { notFound } from 'next/navigation';
import LocationDetailClient from './LocationDetailClient';
import { type Location, type LocationWithImages } from '@/types/menu';

async function getLocation(id: number) {
  try {
    // In a real implementation, this would fetch from an API or database
    // For now, we'll fetch from our own API route to get the location
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/locations`);
    if (!res.ok) {
      return null;
    }
    const locations: LocationWithImages[] = await res.json();
    return locations.find((location: LocationWithImages) => location.id === id);
  } catch (error) {
    console.error('Failed to fetch location:', error);
    return null;
  }
}

export default async function LocationDetailPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    notFound();
  }

  const location = await getLocation(id);

  if (!location) {
    notFound();
  }

  return <LocationDetailClient location={location} />;
}