import bcrypt from 'bcryptjs';

import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

export async function main(): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminEmail.trim()) {
    throw new Error('ADMIN_EMAIL is required. Set it in the environment before running the seed.');
  }

  if (!adminPassword || !adminPassword.trim()) {
    throw new Error('ADMIN_PASSWORD is required. Set it in the environment before running the seed.');
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: 'Admin CoSpace',
      passwordHash,
      role: UserRole.ADMIN,
    },
    create: {
      name: 'Admin CoSpace',
      email: adminEmail,
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  console.log(`Seeded admin user ${adminEmail} with role ADMIN.`);
}

void main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error('Seed failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
