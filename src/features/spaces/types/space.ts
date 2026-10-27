import type { Prisma, SpaceType } from '@prisma/client';

export type SpaceFilters = {
  isActive?: boolean;
  type?: SpaceType;
};

export type SpaceListOptions = {
  skip: number;
  take: number;
  filters?: SpaceFilters;
};

export type SpaceListResult = {
  items: Prisma.SpaceGetPayload<{}>[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
};
