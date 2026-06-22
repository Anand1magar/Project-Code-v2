import { useEffect, useState } from 'react';
import { dashboardService } from '../dashboardService.js';

export function useDashboard({ role, userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    dashboardService.get({ role, userId })
      .then((d) => { if (alive) setData(d); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [role, userId]);

  return { data, loading };
}
