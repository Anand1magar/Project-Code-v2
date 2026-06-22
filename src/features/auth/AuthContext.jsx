import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authService } from './authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    authService.me()
      .then((u) => { if (alive) setCurrentUser(u); })
      .catch(() => { /* no session */ })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const login = useCallback(async ({ email, role }) => {
    const u = await authService.login({ email, role });
    setCurrentUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setCurrentUser(null);
  }, []);

  const value = {
    currentUser,
    loading,
    isAdmin: currentUser?.role === 'admin',
    isCounsellor: currentUser?.role === 'counsellor',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
