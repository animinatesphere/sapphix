import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./Auttts/AuthContext";
import { CartProvider } from "./component/CartContext";
import Login from "./login/Login";
import Dashboard from "../src/Page/DashBoard";
// import { useContext } from "react";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ProductListing from "./women/ProductListing";
import ProductDetails from "./component/ProductDetails";
import ProtectedRoute from "./component/ProtectedRoute";
// import HandleAuthRedirect from "./component/HandleAuthRedirect";

// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useContext(AuthContext);
//   if (loading) return <p>Loading...</p>;
//   return user ? children : <Navigate to="/login" />;
// };

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/Admin-Login" element={<AdminLogin />} />
            <Route path="/women" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetails />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admindashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
