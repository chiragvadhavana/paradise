import React, { createContext, useState, useCallback } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = useCallback(
    async (email, password) => {
      try {
        const response = await authService.login(email, password);
        setUser(response.data.user);
        localStorage.setItem("token", response.data.token);
        console.log("logine successful");
        navigate("/");
        return true;
      } catch (error) {
        console.error("login failed", error);
        return false;
      }
    },
    [navigate]
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  }, [navigate]);

  const register = useCallback(async (email, password) => {
    try {
      const response = await authService.register(email, password);
      setUser(response.data.user);
      return true;
    } catch (error) {
      console.error("could not register - error in authcontext", error);
      return false;
    }
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
