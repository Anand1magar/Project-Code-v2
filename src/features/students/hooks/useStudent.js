import { useCallback, useEffect, useState } from 'react';
import { studentsService } from '../studentsService.js';

export function useStudent(id) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      setStudent(await studentsService.get(id));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { refresh(); }, [refresh]);

  const update = useCallback(async (patch) => {
    const updated = await studentsService.update(id, patch);
    setStudent(updated);
    return updated;
  }, [id]);

  const remove = useCallback(async () => {
    await studentsService.remove(id);
  }, [id]);

  return { student, loading, error, refresh, update, remove };
}
