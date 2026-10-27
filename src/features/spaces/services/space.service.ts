import type { Prisma, Space, SpaceType } from '@prisma/client';

import {
  countSpaces,
  createSpace,
  deleteSpaceById,
  findSpaceById,
  findSpaces,
  updateSpaceById,
} from '@/features/spaces/repositories/space.repository';
import type { CreateSpaceInput, ListSpacesQuery, UpdateSpaceInput } from '@/features/spaces/schemas/space.schema';

export type SpaceListResult = {
  items: Space[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
};

export async function listSpaces(input: ListSpacesQuery): Promise<SpaceListResult> {
  const page = input.page;
  const pageSize = input.pageSize;
  const skip = (page - 1) * pageSize;
  const filters = {
    isActive: input.includeInactive ? undefined : true,
    type: input.type,
  };

  const [items, totalCount] = await Promise.all([
    findSpaces({ skip, take: pageSize, filters }),
    countSpaces(filters),
  ]);

  return {
    items,
    totalCount,
    totalPages: totalCount === 0 ? 0 : Math.ceil(totalCount / pageSize),
    page,
    pageSize,
  };
}

export async function getSpaceById(id: string): Promise<Space | null> {
  return findSpaceById(id);
}

export async function createSpaceRecord(input: CreateSpaceInput): Promise<Space> {
  const data: Prisma.SpaceCreateInput = {
    name: input.name,
    description: input.description,
    type: input.type,
    capacity: input.capacity,
    hourlyPrice: input.hourlyPrice,
    isActive: input.isActive,
  };

  return createSpace(data);
}

export async function updateSpaceRecord(id: string, input: UpdateSpaceInput): Promise<Space> {
  return updateSpaceById(id, input as Prisma.SpaceUpdateInput);
}

export async function deleteSpaceRecord(id: string): Promise<Space> {
  return deleteSpaceById(id);
}
