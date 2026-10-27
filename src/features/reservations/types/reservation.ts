import type { Prisma, ReservationStatus, SpaceType } from '@prisma/client';

export type ReservationStatusValue = ReservationStatus | 'IN_PROCESS';

export type ReservationListOptions = {
  skip: number;
  take: number;
  filters?: {
    userId?: string;
    spaceId?: string;
    status?: ReservationStatusValue;
  };
};

export type ReservationListResult = {
  items: Array<{
    id: string;
    userId: string;
    spaceId: string;
    startAt: Date;
    endAt: Date;
    totalPrice: Prisma.Decimal | number | string;
    status: ReservationStatus;
    expiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    space?: {
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
    user?: {
      id: string;
      name: string;
      email: string;
      role: 'USER' | 'ADMIN';
      createdAt: Date;
    };
  }>;
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
};
