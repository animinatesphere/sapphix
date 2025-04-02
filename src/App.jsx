import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CartProvider } from "./component/CartContext";
import Dashboard from "../src/Page/DashBoard";
import AdminDashboard from "./admin/AdminDashboard";
import ProductListing from "./women/ProductListing";
import ProductDetails from "./component/ProductDetails";
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
import Register from "./login/Register";
import LoginPage from "./Page/LoginPage";
import Wrspper from "./Page/Wrspper";
import AdminLogin from "./admin/AdminLogin";
import Wishlist from "./Page/Wishlist";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />

          <Route path="/AdminLogin" element={<AdminLogin />} />

          <Route path="/women" element={<ProductListing />} />
          <Route path="/men" element={<Men />} />
          <Route path="/onsale" element={<OnSale />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/men-product/:id" element={<MenDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <Wrspper>
                <Dashboard />
              </Wrspper>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admindashboard"
            element={
              <Wrspper>
                <AdminDashboard />
              </Wrspper>
            }
          />

          <Route
            path="/admin/dashboard/"
            element={
              <Wrspper>
                {" "}
                <AdminDashboard2 />
              </Wrspper>
            }
          >
            <Route path="DashboardContent" element={<DashboardContent />} />
            <Route path="products/list" element={<ListProducts />} />
            <Route path="products/add" element={<AddProducts />} />
            <Route path="order/list" element={<Orders />} />
            <Route path="order/details" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="reviews" element={<ManageReviews />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch-all Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
