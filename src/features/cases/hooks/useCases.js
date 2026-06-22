import { useCallback, useEffect, useState } from 'react';
import { casesService } from '../casesService.js';

export function useCases(params = {}) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const key = JSON.stringify(params);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setCases(await casesService.list(params));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => { refresh(); }, [refresh]);

  const updateStage = useCallback(async (id, stage) => {
    setCases((cur) => cur.map((c) => (c.id === id ? { ...c, stage } : c)));
    try {
      await casesService.updateStage(id, stage);
    } catch (e) {
      await refresh();
      throw e;
    }
  }, [refresh]);

  const create = useCallback(async (data) => {
    const created = await casesService.create(data);
    await refresh();
    return created;
  }, [refresh]);

  return { cases, loading, error, refresh, updateStage, create };
}
