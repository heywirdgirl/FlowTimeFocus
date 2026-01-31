import { z } from 'zod';

// ✅ Zod schema (runtime validation)
export const PhaseSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  duration: z.number().min(1).max(1440), // Max 24 hours
  soundFile: z.object({
    url: z.string().url(),
    name: z.string(),
  }).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  description: z.string().max(500).optional(),
});

// ✅ TypeScript type (inferred from schema)
export type Phase = z.infer<typeof PhaseSchema>;

// ✅ Partial schemas for updates
export const PhaseUpdateSchema = PhaseSchema.partial().omit({ id: true });
export type PhaseUpdate = z.infer<typeof PhaseUpdateSchema>;

// ✅ Creation schema (no ID yet)
export const PhaseCreateSchema = PhaseSchema.omit({ id: true });
export type PhaseCreate = z.infer<typeof PhaseCreateSchema>;
