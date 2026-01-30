import { useState, useEffect } from 'react';
import { fetchPublicCycles } from '../services/feed-service';
import type { PublicCycle } from '../types';

export function usePublicCycles(category: string, searchQuery: string) {
  const [cycles, setCycles] = useState<PublicCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadCycles() {
      try {
        setLoading(true);
        const cycles = await fetchPublicCycles(category, searchQuery);
        setCycles(cycles);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    loadCycles();
  }, [category, searchQuery]);

  return { cycles, loading, error };
}
