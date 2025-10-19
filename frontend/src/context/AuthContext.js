"use client";
import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Only access localStorage on the client after mount to avoid SSR/hydration issues
  useEffect(() => {
    try {
      const storedToken =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : null;
      const storedUser =
        typeof window !== "undefined" ? localStorage.getItem("authUser") : null;
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch {
      // ignore localStorage errors in some browsers or restricted environments
    }
  }, []);

  const login = async (credentials) => {
    try {
      const data = await api.loginUser(credentials);
      if (!data || !data.token) throw new Error("Invalid login response");
      setUser(data.user || null);
      setToken(data.token);
      setIsAuthenticated(true);
      try {
        localStorage.setItem("authUser", JSON.stringify(data.user));
        localStorage.setItem("authToken", data.token);
      } catch {
        // ignore localStorage write errors
      }
      return data;
    } catch (error) {
      console.warn("Login failed:", error);
      // Rethrow so callers can show messages
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
