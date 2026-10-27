import { Prisma, type Space, type SpaceType } from '@prisma/client';

import { prisma } from '@/lib/db/prisma';

export type SpaceFilters = {
  isActive?: boolean;
  type?: SpaceType;
};

export type SpaceListOptions = {
  skip: number;
  take: number;
  filters?: SpaceFilters;
};

export async function findSpaces({ skip, take, filters }: SpaceListOptions) {
  const where: Prisma.SpaceWhereInput = {};

  if (filters?.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  if (filters?.type) {
    where.type = filters.type;
  }

  return prisma.space.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip,
    take,
  });
}

export async function countSpaces(filters?: SpaceFilters) {
  const where: Prisma.SpaceWhereInput = {};

  if (filters?.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  if (filters?.type) {
    where.type = filters.type;
  }

  return prisma.space.count({ where });
}

export async function findSpaceById(id: string) {
  return prisma.space.findUnique({
    where: { id },
  });
}

export async function createSpace(data: Prisma.SpaceCreateInput): Promise<Space> {
  return prisma.space.create({ data });
}

export async function updateSpaceById(id: string, data: Prisma.SpaceUpdateInput): Promise<Space> {
  return prisma.space.update({
    where: { id },
    data,
  });
}

export async function deleteSpaceById(id: string): Promise<Space> {
  return prisma.space.delete({
    where: { id },
  });
}
