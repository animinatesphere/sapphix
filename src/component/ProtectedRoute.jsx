import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const adminEmail = localStorage.getItem("adminEmail");
    if (adminEmail) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated) return <Navigate to="/adminlogin" replace />;

  return children;
};

export default ProtectedRoute;
