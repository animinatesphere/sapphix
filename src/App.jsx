import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { CartProvider } from "./component/CartContext";
// import Login from "./login/Login";
import Dashboard from "../src/Page/DashBoard";
// import AdminLogin from "./admin/AdminLogin";
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
import Login from "./login/Login";
import LoginPage from "./Page/LoginPage";
import Wrspper from "./Page/Wrspper";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/login" element={<Login />} /> */}
          {/* register */}
          <Route path="/register" element={<Register />} />
          <Route path="/women" element={<ProductListing />} />
          <Route path="/men" element={<Men />} />
          <Route path="/onsale" element={<OnSale />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/men-product/:id" element={<MenDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          {/* login */}

          {/* 🔹 Normal Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <Wrspper>
                {" "}
                <Dashboard />{" "}
              </Wrspper>
            }
          />

          {/* 🔹 Admin Dashboard */}
          <Route path="/admindashboard" element={<AdminDashboard />} />

          {/* 🔹 Admin Panel with Nested Routes */}
          <Route path="/admin/dashboard/" element={<AdminDashboard2 />}>
            <Route path="DashboardContent" element={<DashboardContent />} />
            <Route path="products/list" element={<ListProducts />} />
            <Route path="products/add" element={<AddProducts />} />
            <Route path="order/list" element={<Orders />} />
            <Route path="order/details" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="reviews" element={<ManageReviews />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 🔹 Catch-all Redirect */}
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
