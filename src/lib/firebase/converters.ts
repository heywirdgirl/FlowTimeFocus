import { 
  DocumentData, 
  FirestoreDataConverter, 
  QueryDocumentSnapshot,
  SnapshotOptions 
} from 'firebase/firestore';
import { z } from 'zod';

/**
 * Generic Firestore converter with Zod validation
 */
export function createConverter<T>(
  schema: z.ZodSchema<T>
): FirestoreDataConverter<T> {
  return {
    toFirestore(data: T): DocumentData {
      // Validate before writing
      const validated = schema.parse(data);
      return validated as DocumentData;
    },
    
    fromFirestore(
      snapshot: QueryDocumentSnapshot,
      options?: SnapshotOptions
    ): T {
      const data = snapshot.data(options);
      // Validate on read
      return schema.parse({ id: snapshot.id, ...data });
    },
  };
}
