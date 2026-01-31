import { z } from 'zod';
import { PhaseSchema } from './phase.schema';

// ✅ Public Cycle (denormalized for social feed)
export const PublicCycleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  phases: z.array(PhaseSchema).min(1),
  
  // Author info (denormalized)
  authorId: z.string(),
  authorName: z.string(),
  authorAvatar: z.string().url().optional(),
  authorUsername: z.string(),
  
  // Discovery
  tags: z.array(z.string()).max(10),
  category: z.enum(['work', 'meditation', 'fitness', 'custom']),
  
  // Engagement
  clones: z.number().min(0).default(0),
  
  // Timestamps
  publishedAt: z.number(),
  updatedAt: z.number(),
});

export type PublicCycle = z.infer<typeof PublicCycleSchema>;

// ✅ Comment schema
export const CommentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  username: z.string(),
  text: z.string().min(1).max(500),
  createdAt: z.number(),
});

export type Comment = z.infer<typeof CommentSchema>;

// ✅ Official Template schema
export const OfficialTemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  phases: z.array(PhaseSchema).min(1),
  category: z.string(),
  tags: z.array(z.string()),
  featured: z.boolean().default(false),
  order: z.number().min(0).default(0),
  createdAt: z.number(),
});

export type OfficialTemplate = z.infer<typeof OfficialTemplateSchema>;
