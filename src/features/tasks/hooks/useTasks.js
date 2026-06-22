import { useCallback, useEffect, useState } from 'react';
import { tasksService } from '../tasksService.js';

export function useTasks(params = {}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const key = JSON.stringify(params);

  const refresh = useCallback(async () => {
    setLoading(true);
    try { setTasks(await tasksService.list(params)); }
    finally { setLoading(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => { refresh(); }, [refresh]);

  return {
    tasks,
    loading,
    refresh,
    create: async (d) => { const t = await tasksService.create(d); await refresh(); return t; },
    toggle: async (id, done) => { await tasksService.update(id, { done }); await refresh(); },
  };
}
