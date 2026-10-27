import type { Space, SpaceType } from '@prisma/client';

import { prisma } from '@/lib/db/prisma';

export type PublicSpace = {
  id: string;
  name: string;
  slug: string;
  type: string;
  neighborhood: string;
  address: string;
  city: string;
  capacity: number;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  status: string;
  description: string;
  amenities: string[];
  isFavorite?: boolean;
  distanceMinutes?: number;
  meetingLabel?: string;
};

export type PublicSpaceFilters = {
  type?: string;
  capacity?: number;
  limit?: number;
};

const defaultImages: Record<SpaceType, string> = {
  DESK: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  MEETING_ROOM: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
  PHONE_BOOTH: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
};

export function resolveSpaceTypeLabel(type: SpaceType): string {
  switch (type) {
    case 'DESK':
      return 'Escritorio dedicado';
    case 'MEETING_ROOM':
      return 'Sala de reuniones';
    case 'PHONE_BOOTH':
      return 'Cabina telefónica';
    default:
      return 'Espacio';
  }
}

export function mapSpaceToPublic(space: Space): PublicSpace {
  const typeLabel = resolveSpaceTypeLabel(space.type);
  const price = Number(space.hourlyPrice ?? 0);

  return {
    id: space.id,
    name: space.name,
    slug: space.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    type: typeLabel,
    neighborhood: 'Zona general',
    address: 'Consulta la ubicación exacta en la ficha del espacio',
    city: 'Ubicación disponible',
    capacity: space.capacity,
    rating: 4.8,
    reviews: 0,
    price,
    image: defaultImages[space.type],
    status: space.isActive ? 'Disponible ahora' : 'No disponible',
    description:
      space.description ||
      'Espacio disponible para trabajar o reunirse con reserva por horas.',
    amenities: getAmenitiesForType(space.type),
    distanceMinutes: 8,
    meetingLabel: 'Disponible hoy',
    isFavorite: false,
  };
}

export function getAmenitiesForType(type: SpaceType): string[] {
  switch (type) {
    case 'DESK':
      return ['Wifi', 'Café', 'Aire'];
    case 'MEETING_ROOM':
      return ['Wifi', 'Proyector', 'Café', 'Aire'];
    case 'PHONE_BOOTH':
      return ['Wifi', 'Aire'];
    default:
      return ['Wifi'];
  }
}

export async function getPublicSpaces(limitOrFilters?: number | PublicSpaceFilters): Promise<PublicSpace[]> {
  const filters: PublicSpaceFilters =
    typeof limitOrFilters === 'number' ? { limit: limitOrFilters } : (limitOrFilters ?? {});

  const { type, capacity, limit } = filters;

  const spaces = await prisma.space.findMany({
    where: {
      isActive: true,
      ...(type ? { type: type as SpaceType } : {}),
      ...(capacity ? { capacity: { gte: Number(capacity) } } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return spaces.map(mapSpaceToPublic);
}

export async function getPublicSpaceById(id: string) {
  const space = await prisma.space.findUnique({
    where: { id, isActive: true },
  });

  return space ? mapSpaceToPublic(space) : null;
}
