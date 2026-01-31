import { z } from 'zod';
import { PhaseSchema } from './phase.schema';

// ✅ Private Cycle schema
export const CycleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  phases: z.array(PhaseSchema).min(1).max(20), // At least 1, max 20 phases
  
  // Privacy
  isPublic: z.boolean().default(false),
  
  // Ownership
  userId: z.string(),
  
  // Metadata
  tags: z.array(z.string()).max(10).optional(),
  category: z.enum(['work', 'meditation', 'fitness', 'custom']).optional(),
  
  // Timestamps (Firestore Timestamp or number)
  createdAt: z.union([z.number(), z.any()]),
  updatedAt: z.union([z.number(), z.any()]),
  publishedAt: z.number().optional(),
});

export type Cycle = z.infer<typeof CycleSchema>;

// ✅ Firestore data (without id)
export const CycleFirestoreSchema = CycleSchema.omit({ id: true });
export type CycleFirestore = z.infer<typeof CycleFirestoreSchema>;

// ✅ Create/Update schemas
export const CycleCreateSchema = CycleSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type CycleCreate = z.infer<typeof CycleCreateSchema>;

export const CycleUpdateSchema = CycleSchema.partial().omit({ 
  id: true, 
  userId: true,
  createdAt: true 
});
export type CycleUpdate = z.infer<typeof CycleUpdateSchema>;
