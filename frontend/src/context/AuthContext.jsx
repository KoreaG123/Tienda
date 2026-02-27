import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('hombr-admin-token'));

  const login = (t) => {
    localStorage.setItem('hombr-admin-token', t);
    setToken(t);
  };

  const logout = () => {
    localStorage.removeItem('hombr-admin-token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
