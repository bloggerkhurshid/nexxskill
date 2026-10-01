import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('nexxskill_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('nexxskill_token');
    if (token) {
      api.get('/auth/me')
        .then((res) => {
          if (res.data?.success) {
            setUser(res.data.data.user);
            localStorage.setItem('nexxskill_user', JSON.stringify(res.data.data.user));
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success) {
        const { user, tokens } = res.data.data;
        setUser(user);
        localStorage.setItem('nexxskill_token', tokens.access_token);
        localStorage.setItem('nexxskill_user', JSON.stringify(user));
        return user;
      }
      throw new Error(res.data?.error?.message || 'Login failed');
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Invalid email or password';
      throw new Error(msg);
    }
  };

  const register = async (name, email, phone, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, phone, password });
      if (res.data?.success) {
        const { user, tokens } = res.data.data;
        setUser(user);
        localStorage.setItem('nexxskill_token', tokens.access_token);
        localStorage.setItem('nexxskill_user', JSON.stringify(user));
        return user;
      }
      throw new Error(res.data?.error?.message || 'Registration failed');
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'Registration failed';
      throw new Error(msg);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexxskill_token');
    localStorage.removeItem('nexxskill_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
