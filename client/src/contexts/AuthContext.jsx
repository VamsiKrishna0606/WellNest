import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../axios";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setIsAuthenticated(true);
    } catch (err) {
      alert("Invalid credentials or server issue.");
    }
  };

  const register = async (email, password) => {
    try {
      await axios.post("/api/auth/register", {
        email,
        password,
        username: email.split("@")[0],
      });
      await login(email, password);
    } catch (err) {
      alert("Registration failed or user already exists.");
    }
  };

  const logout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      setIsAuthenticated(false);
      setIsLoggingOut(false);
      localStorage.removeItem("token");
    }, 2000);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout, isLoggingOut }}>
      {children}
    </AuthContext.Provider>
  );
};
