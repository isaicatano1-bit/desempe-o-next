import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

function getPrismaClient(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set. Add it to your local environment before connecting Prisma to the database.');
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
      datasourceUrl: databaseUrl,
    });
  }

  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, receiver);

    return typeof value === 'function' ? value.bind(client) : value;
  },
});
