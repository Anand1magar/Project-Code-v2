import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '@/services/apiClient';

export function usePipeline() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setConfig(await apiClient.get('/config/pipeline'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const update = useCallback(async (patch) => {
    const next = await apiClient.patch('/config/pipeline', patch);
    setConfig(next);
    return next;
  }, []);

  return { config, loading, refresh, update };
}
