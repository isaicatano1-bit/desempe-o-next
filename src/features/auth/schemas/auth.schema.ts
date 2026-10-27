import { z } from 'zod';

const nameSchema = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters long.')
  .max(100, 'Name must be at most 100 characters long.');

const emailSchema = z
  .string()
  .trim()
  .email('Please enter a valid email address.')
  .max(254, 'Email must be at most 254 characters long.')
  .transform((value) => value.toLowerCase());

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long.')
  .max(72, 'Password must be at most 72 characters long.');

const loginPasswordSchema = z
  .string()
  .min(1, 'Password is required.')
  .max(72, 'Password must be at most 72 characters long.');

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
