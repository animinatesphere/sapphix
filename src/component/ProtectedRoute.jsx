import { Navigate } from "react-router-dom";
import { useAuth } from "../Auttts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/adminlogin" replace />;
  return children;
};

export default ProtectedRoute;
