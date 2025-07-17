
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Check if user was previously logged in
    const savedAuth = localStorage.getItem('wellnest-auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email, password) => {
    // Simple auth simulation - in real app, this would call an API
    if (email && password) {
      setIsAuthenticated(true);
      localStorage.setItem('wellnest-auth', 'true');
      
      // Request microphone permission for voice assistant
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        console.log('Microphone permission denied or unavailable');
      }
    }
  };

  const logout = () => {
    setIsLoggingOut(true);
    
    // Show logout message and redirect after 2 seconds
    setTimeout(() => {
      setIsAuthenticated(false);
      setIsLoggingOut(false);
      localStorage.removeItem('wellnest-auth');
    }, 2000);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoggingOut }}>
      {children}
    </AuthContext.Provider>
  );
};
