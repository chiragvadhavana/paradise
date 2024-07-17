import React, { createContext, useState, useCallback } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // const login = useCallback(async (email, password) => {
  //   try {
  //     const response = await authService.login(email, password);
  //     setUser(response.data.user);
  //     console.log("login successful");
  //     // return true;
  //     navigate("/booklist");
  //   } catch (error) {
  //     console.error("Login failed", error);
  //     return false; // indicate failure
  //   }
  // }, []);
  const login = useCallback(
    async (email, password) => {
      try {
        const response = await authService.login(email, password);
        setUser(response.data.user);
        localStorage.setItem("token", response.data.token);
        console.log("Login successful");
        navigate("/");
        return true;
      } catch (error) {
        console.error("Login failed", error);
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
      return true; // indicate success
    } catch (error) {
      console.error("Registration failed", error);
      return false; // indicate failure
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

// import React, { createContext, useState } from "react";
// import { useNavigate } from "react-router-dom"; //TODO
// import authService from "../services/authService";

// export const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   const login = async (email, password) => {
//     try {
//       const response = await authService.login(email, password);
//       setUser(response.data.user);
//       navigate("/");
//     } catch (error) {
//       console.error("Login failed", error);
//     }
//   };

//   const register = async (email, password) => {
//     try {
//       const response = await authService.register(email, password);
//       setUser(response.data.user);
//       navigate("/");
//     } catch (error) {
//       console.error("Registration failed", error);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     navigate("/login");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;
