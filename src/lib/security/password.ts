// Password hashing is intentionally left as a placeholder for the upcoming
// authentication feature. This task focuses only on the Prisma database layer.
export function hashPassword(_password: string): string {
  throw new Error('Password hashing is not implemented yet.');
}

export function verifyPassword(_password: string, _hashedPassword: string): boolean {
  throw new Error('Password verification is not implemented yet.');
}
