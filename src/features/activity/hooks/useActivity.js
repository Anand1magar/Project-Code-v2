import { useCallback, useEffect, useState } from 'react';
import { activityService } from '../activityService.js';

export function useActivity(caseId) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!caseId) return;
    setLoading(true);
    try { setEntries(await activityService.listForCase(caseId)); }
    finally { setLoading(false); }
  }, [caseId]);

  useEffect(() => { refresh(); }, [refresh]);

  return {
    entries,
    loading,
    refresh,
    create: async (data) => {
      await activityService.create({ caseId, ...data });
      await refresh();
    },
  };
}
