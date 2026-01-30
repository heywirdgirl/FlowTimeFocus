import { useState } from 'react';
import { cloneCycle as cloneCycleService } from '../services/feed-service';

export function useCloneCycle() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clone = async (userId, cycleId) => {
    try {
      setLoading(true);
      const newCycle = await cloneCycleService(userId, cycleId);
      return newCycle;
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return { clone, loading, error };
}
