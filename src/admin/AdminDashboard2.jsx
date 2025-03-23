import React, { useState, useEffect } from "react";
import { FiSearch, FiSettings, FiChevronDown, FiLogOut } from "react-icons/fi";
import { supabase } from "../../supabase";
// import { AiOutlineDashboard } from "react-icons/ai";
import dash from "../admin/admin-folder/dashboard.png";
import shop from "../admin/admin-folder/shop.png";
import shopping from "../admin/admin-folder/shopping-cart.png";
import people from "../admin/admin-folder/people.png";
import edit from "../admin/admin-folder/edit.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../admin/admindashboard2.css";
// Adjust the path to your Supabase client
import eagle from "../assets/Sapphix logo editable 1.png";
import AdminNav from "./AdminNav";
const AdminDashboard2 = () => {
  const [showProducts, setShowProducts] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user data from Supabase on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        navigate("/Admin-Login"); // Redirect to login if not authenticated
        return;
      }

      setUser(session.user);
    };

    fetchUser();
  }, [navigate]);

  // Log out function
  const handleLogout = async () => {
    await supabase.auth.signOut();
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
                  </div>{" "}
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
            <li>
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

        {/* User Profile */}
        <div className="user-profile">
          <img src="https://via.placeholder.com/40" alt="User" />
          <div>
            <p>{user ? user.user_metadata.full_name : "Loading..."}</p>
            <span>{user ? user.email : "Loading..."}</span>
          </div>
          <FiLogOut onClick={handleLogout} style={{ cursor: "pointer" }} />
        </div>
      </aside>
      <div className="con">
        <AdminNav />
        {/* Main Content Area */}
        <main className="main-content">
          <Outlet /> {/* Display the nested routes here */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard2;
