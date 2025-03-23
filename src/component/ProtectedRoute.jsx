import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Auttts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Debug logs to help track issues
  console.log("Protected Route Check:", {
    loading,
    authenticated: !!user,
    userDetails: user ? `${user.email} (${user.role || "user"})` : "none",
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  return user ? children : <Navigate to="/adminlogin" />;
};

export default ProtectedRoute;
