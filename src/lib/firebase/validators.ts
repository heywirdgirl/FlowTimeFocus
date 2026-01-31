import { z } from 'zod';

/**
 * Validate data against schema
 * Throws error if invalid
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Safe validation (returns success/error)
 */
export function validateSafe<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

/**
 * Validate before writing to Firestore
 */
export async function validateAndWrite<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  writeFn: (validData: T) => Promise<void>
): Promise<void> {
  const validData = validate(schema, data);
  await writeFn(validData);
}
