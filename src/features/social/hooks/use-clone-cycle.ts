import { useState } from 'react';
import { cloneCycle as cloneCycleService } from '../services/feed-service';

export function useCloneCycle() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clone = async (userId: string, cycleId: string) => {
    try {
      setLoading(true);
      const newCycle = await cloneCycleService(userId, cycleId);
      return newCycle;
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  return { clone, loading, error };
}
