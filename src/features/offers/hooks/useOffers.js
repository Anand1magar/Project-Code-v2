import { useCallback, useEffect, useState } from 'react';
import { offersService } from '../offersService.js';

export function useOffers(caseId) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!caseId) return;
    setLoading(true);
    try { setOffers(await offersService.listForCase(caseId)); }
    finally { setLoading(false); }
  }, [caseId]);

  useEffect(() => { refresh(); }, [refresh]);

  return {
    offers,
    loading,
    refresh,
    create: async (data) => {
      await offersService.create(caseId, data);
      await refresh();
    },
    updateStatus: async (offerId, status) => {
      await offersService.update(offerId, { status });
      await refresh();
    },
  };
}
