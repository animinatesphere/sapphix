import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiSettings,
  FiChevronDown,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import dash from "../admin/admin-folder/dashboard.png";
import shop from "../admin/admin-folder/shop.png";
import shopping from "../admin/admin-folder/shopping-cart.png";
import people from "../admin/admin-folder/people.png";
import edit from "../admin/admin-folder/edit.png";
import eagle from "../assets/Sapphix logo editable 1.png";
import AdminNav from "./AdminNav";
import "../admin/admindashboard2.css";
import { supabase } from "../../supabase";

const AdminDashboard2 = () => {
  const [showProducts, setShowProducts] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if path is active
  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  // Set open state for dropdowns based on current path
  useEffect(() => {
    if (location.pathname.includes("/products")) {
      setShowProducts(true);
    }
    if (location.pathname.includes("/order")) {
      setShowOrder(true);
    }
  }, [location.pathname]);

  // Get user from Supabase
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setUser({
            email: session.user.email,
            id: session.user.id,
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getUserDetails();
  }, []);

  // Logout Function
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("userRole");
      navigate("/Admin-Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Mobile menu toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          display: "none", // Hidden by default, shown in mobile via media query
          position: "fixed",
          zIndex: 100,
          top: "20px",
          left: "20px",
          padding: "8px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #e5e7eb",
        }}
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div>
          <h2 className="logo">
            <img src={eagle} alt="Sapphix Logo" />
            Sapphix
          </h2>
          <div className="search-ba">
            <FiSearch />
            <input type="text" placeholder="Search..." />
          </div>

          <nav className="nav-links">
            <ul>
              <li className={isActive("DashboardContent") ? "active" : ""}>
                <Link to="DashboardContent">
                  <img src={dash} alt="Dashboard icon" />
                  Dashboard
                </Link>
              </li>

              <li className={isActive("products") ? "active" : ""}>
                <div className="show">
                  <div
                    className="fiv"
                    onClick={() => setShowProducts(!showProducts)}
                  >
                    <div className="fiv-im">
                      <img src={shop} alt="Products icon" />
                      Products
                    </div>
                    <FiChevronDown
                      style={{
                        transform: showProducts
                          ? "rotate(180deg)"
                          : "rotate(0)",
                      }}
                    />
                  </div>
                  <ul
                    className={`sub-menu ${showProducts ? "active" : ""}`}
                    style={{ height: showProducts ? "auto" : "0" }}
                  >
                    <li>
                      <Link
                        to="products/list"
                        className={isActive("products/list") ? "active" : ""}
                      >
                        List of Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="products/add"
                        className={isActive("products/add") ? "active" : ""}
                      >
                        Add Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="products/category"
                        className={
                          isActive("products/category") ? "active" : ""
                        }
                      >
                        Category
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li className={isActive("order") ? "active" : ""}>
                <div className="show">
                  <div className="fiv" onClick={() => setShowOrder(!showOrder)}>
                    <div className="fiv-im">
                      <img src={shopping} alt="Order icon" />
                      Order
                    </div>
                    <FiChevronDown
                      style={{
                        transform: showOrder ? "rotate(180deg)" : "rotate(0)",
                      }}
                    />
                  </div>
                  <ul
                    className={`sub-menu ${showOrder ? "active" : ""}`}
                    style={{ height: showOrder ? "auto" : "0" }}
                  >
                    <li>
                      <Link
                        to="order/list"
                        className={isActive("order/list") ? "active" : ""}
                      >
                        List of Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="order/details"
                        className={isActive("order/details") ? "active" : ""}
                      >
                        Order Details
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li className={isActive("customers") ? "active" : ""}>
                <Link to="customers">
                  <img src={people} alt="Customers icon" />
                  Customers
                </Link>
              </li>

              <li className={isActive("reviews") ? "active" : ""}>
                <Link to="reviews">
                  <img src={edit} alt="Reviews icon" />
                  Manage Reviews
                </Link>
              </li>

              <li className={isActive("settings") ? "active" : ""}>
                <Link to="settings">
                  <FiSettings />
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* User Profile Section */}
        <div className="user-profile">
          <div>
            <img
              src={`https://ui-avatars.com/api/?name=${
                user?.email || "User"
              }&background=f3f4f6&color=4f46e5`}
              alt="User avatar"
            />
            <span>{user ? user.email : "Loading..."}</span>
          </div>
          <FiLogOut onClick={handleLogout} size={20} title="Logout" />
        </div>
      </aside>

      {/* Main Content */}
      <div className="con">
        <AdminNav />
        <main className="main-content">
          <Outlet /> {/* Display nested routes */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard2;
