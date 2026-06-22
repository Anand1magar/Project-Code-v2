import { useCallback, useEffect, useState } from 'react';
import { studentsService } from '../studentsService.js';

export function useStudents(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async (q = query) => {
    setLoading(true);
    try {
      const data = await studentsService.list(q);
      setStudents(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => { refresh(query); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [query]);

  const create = useCallback(async (data) => {
    const created = await studentsService.create(data);
    await refresh();
    return created;
  }, [refresh]);

  return { students, loading, error, query, setQuery, refresh, create };
}
