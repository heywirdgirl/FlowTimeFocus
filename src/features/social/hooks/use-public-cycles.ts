import { useState, useEffect } from 'react';
import { fetchPublicCycles } from '../services/feed-service';

export function usePublicCycles(category, searchQuery) {
  const [cycles, setCycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCycles() {
      try {
        setLoading(true);
        const cycles = await fetchPublicCycles(category, searchQuery);
        setCycles(cycles);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }

    loadCycles();
  }, [category, searchQuery]);

  return { cycles, loading, error };
}
