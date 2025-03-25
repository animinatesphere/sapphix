import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const adminEmail = localStorage.getItem("adminEmail");
    setIsAuthenticated(!!adminEmail);
  }, []);

  const login = (email) => {
    localStorage.setItem("adminEmail", email);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("adminEmail");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
