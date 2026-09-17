import { createContext, useContext, useState } from 'react';
import { loginUser, logoutUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kenakata_user');
    return saved && localStorage.getItem('token') ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    const result = await loginUser(email.trim().toLowerCase(), password);
    const found = result.user || result;
    const safe = { id: found.user_id || found.id, name: found.name, email: found.email || email, role: found.role };
    if (result.token) localStorage.setItem('token', result.token);
    setUser(safe);
    localStorage.setItem('kenakata_user', JSON.stringify(safe));
    return safe;
  };

  const register = async ({ name, email, password, role, business_name }) => {
    const result = await registerUser({ name, email, password, role, business_name });
    const created = result.user || result;
    const safe = { id: created.user_id || created.id, name: created.name, email: created.email, role: created.role };
    if (result.token) localStorage.setItem('token', result.token);
    setUser(safe);
    localStorage.setItem('kenakata_user', JSON.stringify(safe));
    return safe;
  };

  const logout = async () => {
    try {
      if (localStorage.getItem('token')) await logoutUser();
    } catch (error) {
      console.error('Logout request failed', error);
    }

    setUser(null);
    localStorage.removeItem('kenakata_user');
    localStorage.removeItem('token');
    localStorage.removeItem('kenakata_cart_guest');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('kenakata_user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}