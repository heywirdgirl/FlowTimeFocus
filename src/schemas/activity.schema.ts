import { z } from 'zod';

export const UserActivitySchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  username: z.string(),
  type: z.enum(['publish', 'clone', 'like', 'complete']),
  cycleId: z.string().optional(),
  cycleName: z.string().optional(),
  createdAt: z.number(),
});

export type UserActivity = z.infer<typeof UserActivitySchema>;
