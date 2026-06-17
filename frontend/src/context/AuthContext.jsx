/**
 * AuthContext
 *
 * TEACHING NOTE: React Context API
 *
 * PROBLEM: "Prop drilling" — passing data through many component layers
 *   App → Navbar → UserMenu → Avatar (passing user prop down every level)
 *
 * SOLUTION: Context API — a global state accessible from any component
 *   Any component can call useAuth() to get user, login, logout functions
 *
 * THREE STEPS:
 * 1. createContext() — create the context object
 * 2. <AuthProvider> — provide the value to all children
 * 3. useContext(AuthContext) — consume the value in any component
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

// Step 1: Create the context
const AuthContext = createContext(null);

// Step 2: Create the Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // True while checking auth on app load

  /**
   * On app load, check if a token exists in localStorage.
   * If it does, fetch the user's data from the backend.
   * This keeps the user "logged in" even after page refresh.
   */
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await authAPI.getMe();
          setUser(data.user);
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function — called after successful login API response
  const login = useCallback((userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  // Logout function — clears all auth state
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  // Update user state (e.g., after profile update)
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  // Computed values
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Step 3: Custom hook for easy consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
};

export default AuthContext;
