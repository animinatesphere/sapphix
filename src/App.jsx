import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./Auttts/AuthContext";
import { CartProvider } from "./component/CartContext";
import Login from "./login/Login";
import Dashboard from "../src/Page/DashBoard";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ProductListing from "./women/ProductListing";
import ProductDetails from "./component/ProductDetails";
import HandleAuthRedirect from "./component/HandleAuthRedirect";
import ProtectedRoute from "./component/ProtectedRoute"; // Make sure this is using the auth context
import Checkout from "./check/Checkout";
import Men from "./men/Men";
import OnSale from "./onsale/OnSale";
import AdminDashboard2 from "./admin/AdminDashboard2";

import DashboardContent from "./admin/DashboardContent";
import ListProducts from "./admin/ListProducts";
import AddProducts from "./admin/AddProducts";
import Orders from "./admin/Orders";
import Customers from "./admin/Customers";
import ManageReviews from "./admin/ManageReviews";
import Settings from "./admin/Settings";
import MenDetails from "./men/MenDetails";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route />
            {/* Fix the path to match what's used in your ProtectedRoute component */}
            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route
              path="/Admin-Login"
              element={<Navigate to="/adminlogin" />}
            />{" "}
            {/* Add redirect for old path */}
            <Route path="/women" element={<ProductListing />} />
            <Route path="/men" element={<Men />} />
            <Route path="/onsale" element={<OnSale />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/men-product/:id" element={<MenDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            {/* Handle Supabase OAuth Redirect */}
            <Route path="/auth/callback" element={<HandleAuthRedirect />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" />} />
            <Route
              path="/admindashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            {/* Admin Dashboard Layout with Nested Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard2 />
                </ProtectedRoute>
              }
            >
              <Route path="DashboardContent" element={<DashboardContent />} />
              <Route path="products/list" element={<ListProducts />} />
              <Route path="products/add" element={<AddProducts />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="reviews" element={<ManageReviews />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
