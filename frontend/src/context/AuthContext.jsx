import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAPI, registerAPI, getWristbandAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wristband, setWristband] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          // Load wristband info
          await fetchWristband(parsedUser.id);
        } catch (e) {
          console.error("Failed to parse stored user", e);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const fetchWristband = async (userId) => {
    try {
      const response = await getWristbandAPI(userId);
      if (response.success && response.data) {
        // Response data might be an array of wristbands or single wristband.
        // Assuming it returns array or object:
        const wb = Array.isArray(response.data) ? response.data[0] : response.data;
        setWristband(wb || null);
      }
    } catch (error) {
      console.error("Failed to fetch wristband info:", error);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await loginAPI(email, password);
      if (response.success && response.data) {
        const { token, user: userData } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        await fetchWristband(userData.id);
        return { success: true };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (firstName, lastName, email, password) => {
    setLoading(true);
    try {
      const response = await registerAPI(firstName, lastName, email, password);
      if (response.success) {
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message || 'Registration failed' };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setWristband(null);
  };

  const updateWristbandState = (newWristband) => {
    setWristband(newWristband);
  };

  return (
    <AuthContext.Provider value={{
      user,
      wristband,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refreshWristband: () => user && fetchWristband(user.id),
      updateWristbandState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
