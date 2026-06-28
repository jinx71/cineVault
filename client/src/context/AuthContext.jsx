import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loginRequest, registerRequest, meRequest } from '../api/auth';

const TOKEN_KEY = 'cinevault_token';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: if a token exists, restore the session.
  // NOTE: token lives in localStorage for portfolio simplicity.
  // In production, prefer httpOnly cookies to reduce XSS token-theft risk.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        const { user: me } = await meRequest();
        if (active) setUser(me);
      } catch (err) {
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const { user: u, token } = await loginRequest(credentials);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (payload) => {
    const { user: u, token } = await registerRequest(payload);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
