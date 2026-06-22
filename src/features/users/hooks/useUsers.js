import { useCallback, useEffect, useState } from 'react';
import { usersService } from '../usersService.js';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await usersService.list());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return {
    users,
    loading,
    refresh,
    create: async (d) => { const u = await usersService.create(d); await refresh(); return u; },
    update: async (id, p) => { const u = await usersService.update(id, p); await refresh(); return u; },
  };
}
