import { createContext, useContext, useMemo, useState } from 'react';
import { loginUser, registerUser } from '../api/authApi.js';

const AuthContext = createContext(null);

const readStoredUser = () => {
  const stored = localStorage.getItem('authUser');
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState(readStoredUser);

  const persistSession = (session) => {
    localStorage.setItem('authToken', session.token);
    localStorage.setItem('authUser', JSON.stringify(session.user));
    setToken(session.token);
    setUser(session.user);
  };

  const login = async (credentials) => {
    const { data } = await loginUser(credentials);
    persistSession(data);
  };

  const register = async (payload) => {
    const { data } = await registerUser(payload);
    persistSession(data);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ isAuthenticated: Boolean(token), login, logout, register, token, user }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
