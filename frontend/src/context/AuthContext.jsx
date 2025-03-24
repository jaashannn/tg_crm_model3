import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const UserContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL ;

  useEffect(() => {
    const verifyUser = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(`${apiUrl}/api/auth/verify`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        // toast.error(
        //   error.response?.data?.message 
        // );
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, [apiUrl]);

  const login = (userData) => {
    setUser(userData);
    toast.success("Login successful!");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
export default AuthContextProvider;
