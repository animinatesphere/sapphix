import React, { useState, useEffect } from "react";
import { FiSearch, FiSettings, FiChevronDown, FiLogOut } from "react-icons/fi";
import { Link, Outlet, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  // ✅ Get user from localStorage (No Supabase)
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        // Get the current session from Supabase
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          // User is authenticated, set user details
          setUser({
            email: session.user.email,
            id: session.user.id,
            // Add any other user data you need from the session
          });

          // If you need additional user details from a profile table
          // You can fetch them here
          // const { data: profile } = await supabase
          //   .from('profiles')
          //   .select('*')
          //   .eq('id', session.user.id)
          //   .single();
          //
          // if (profile) {
          //   setUser(prev => ({
          //     ...prev,
          //     ...profile
          //   }));
          // }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getUserDetails();
  }, []);
  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("userRole");
    navigate("/Admin-Login");
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-search">
          <h2 className="logo">
            <img src={eagle} alt="" />
            Sapphix
          </h2>
          <div className="search-ba">
            <FiSearch />
            <input type="text" placeholder="Search" />
          </div>
        </div>

        <nav className="nav-links">
          <ul>
            <li>
              <Link to="DashboardContent">
                <img src={dash} alt="" />
                Dashboard
              </Link>
            </li>
            <li onClick={() => setShowProducts(!showProducts)}>
              <div className="show">
                <div className="fiv">
                  <div className="fiv-im">
                    <img src={shop} alt="" /> Products
                  </div>
                  <FiChevronDown />
                </div>
                {showProducts && (
                  <ul className="sub-menu">
                    <li>
                      <Link to="products/list">List of Products</Link>
                    </li>
                    <li>
                      <Link to="products/add">Add Products</Link>
                    </li>
                    <li>
                      <Link to="products/category">Category</Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>

            <li onClick={() => setShowOrder(!showOrder)}>
              <div className="show">
                <div className="fiv">
                  <div className="fiv-im">
                    <img src={shopping} alt="" /> Order
                  </div>
                  <FiChevronDown />
                </div>
                {showOrder && (
                  <ul className="sub-menu">
                    <li>
                      <Link to="order/list">List of Orders</Link>
                    </li>
                    <li>
                      <Link to="order/details">Order Details</Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>

            <li>
              <Link to="customers">
                <img src={people} alt="" /> Customers
              </Link>
            </li>
            <li>
              <Link to="reviews">
                <img src={edit} alt="" /> Manage Reviews
              </Link>
            </li>
            <li>
              <Link to="settings">
                <FiSettings /> Settings
              </Link>
            </li>
          </ul>
        </nav>

        {/* ✅ Fixed User Profile Section */}
        <div className="user-profile">
          <div>
            <img
              src={`https://ui-avatars.com/api/?name=${user?.email || "User"}`}
              alt="User"
            />
            <span>{user ? user.email : "Loading..."}</span>
          </div>
          <FiLogOut onClick={handleLogout} style={{ cursor: "pointer" }} />
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
