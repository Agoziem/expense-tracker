import { z } from 'zod';
import { imageSchema } from './custom-validation';
import { isValidPhoneNumber } from 'react-phone-number-input';

// ---------- User ----------
export const UserCreateSchema = z.object({
  first_name: z.string().max(25),
  last_name: z.string().max(25),
  email: z.email().max(40),
  password: z.string().min(6),
});

export type UserCreateType = z.infer<typeof UserCreateSchema>;

export const UserUpdateSchema = z.object({
  first_name: z.string(),
  last_name: z.string().nullable().optional(),
  email: z.email().nullable().optional(),
  phone: z.string().refine(isValidPhoneNumber, {
      message: 'Please enter a valid phone number.',
    }),
  address: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  avatar: imageSchema,
  bio: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  profile_completed: z.boolean().nullable().optional(),
});

export type UserUpdateType = z.infer<typeof UserUpdateSchema>;