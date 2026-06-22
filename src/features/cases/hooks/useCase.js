import { useCallback, useEffect, useState } from 'react';
import { casesService } from '../casesService.js';

export function useCase(id) {
  const [case_, setCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      setCase(await casesService.get(id));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { refresh(); }, [refresh]);

  const update = useCallback(async (patch) => {
    const updated = await casesService.update(id, patch);
    setCase(updated);
    return updated;
  }, [id]);

  return { case: case_, loading, error, refresh, update };
}
