import { z } from 'zod';

// ✅ Public Profile schema
export const PublicProfileSchema = z.object({
  uid: z.string(),
  username: z.string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  displayName: z.string().min(1).max(100),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
});

export type PublicProfile = z.infer<typeof PublicProfileSchema>;

// ✅ Private Settings schema
export const PrivateSettingsSchema = z.object({
  playSounds: z.boolean().default(true),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications: z.boolean().default(true),
});

export type PrivateSettings = z.infer<typeof PrivateSettingsSchema>;
