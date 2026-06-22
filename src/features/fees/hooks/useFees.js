import { useCallback, useEffect, useState } from 'react';
import { feesService } from '../feesService.js';

export function useFees(caseId) {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!caseId) return;
    setLoading(true);
    try { setFees(await feesService.listForCase(caseId)); }
    finally { setLoading(false); }
  }, [caseId]);

  useEffect(() => { refresh(); }, [refresh]);

  return {
    fees,
    loading,
    refresh,
    create: async (data) => {
      await feesService.create(caseId, data);
      await refresh();
    },
    voidFee: async (feeId, reason) => {
      await feesService.void(feeId, reason);
      await refresh();
    },
  };
}
