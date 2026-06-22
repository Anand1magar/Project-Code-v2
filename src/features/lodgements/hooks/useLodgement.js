import { useCallback, useEffect, useState } from 'react';
import { lodgementsService } from '../lodgementsService.js';

export function useLodgement(caseId) {
  const [lodgement, setLodgement] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!caseId) return;
    setLoading(true);
    try { setLodgement(await lodgementsService.getForCase(caseId)); }
    finally { setLoading(false); }
  }, [caseId]);

  useEffect(() => { refresh(); }, [refresh]);

  return {
    lodgement,
    loading,
    refresh,
    create: async (data) => {
      const result = await lodgementsService.create(caseId, data);
      await refresh();
      return result;
    },
  };
}
