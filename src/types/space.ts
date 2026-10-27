import type { Prisma, SpaceType } from '@prisma/client';

export type SpaceRecord = {
  id: string;
  name: string;
  description: string;
  type: SpaceType;
  capacity: number;
  hourlyPrice: Prisma.Decimal | number | string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type SpaceFilters = {
  isActive?: boolean;
  type?: SpaceType;
};
