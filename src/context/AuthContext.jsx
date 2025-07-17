// components/AuthContext.jsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUserData);
      } catch (e) {
        console.error("Error parsing user data from localStorage:", e);
        // Hatalı veri varsa temizle
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  }, []);

  // ✨ login fonksiyonu iki parametre alıyor: userData (object) ve token (string)
  const login = (userData, token) => {
    console.log("AuthContext: Login function called with userData:", userData);
    console.log("AuthContext: Token:", token); // Token'ın geldiğini teyit et

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData)); // userData'yı olduğu gibi kaydet
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
