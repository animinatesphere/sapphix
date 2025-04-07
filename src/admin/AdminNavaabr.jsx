import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Lock, RefreshCw, Key, MapPin, LogOut } from "lucide-react";
import { useCart } from "../component/CartContext";
import eagle from "../assets/Sapphix logo editable 1.png";
import profile from "../assets/Profile.png";
import wishlist from "../assets/Wishlist.png";
import cart from "../assets/Cart.png";
import SearchBar from "../componentcss/SearchBar";
import CartSidebar from "../component/CartSidebar";
import "../navbar-component/navbar2.css";
import { supabase } from "../../supabase";
// import defaultProfile from "../foestaimages/Air1.png";

const AdminNavaabr = () => {
  const { adminCartItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [open, itOpen] = useState(false);
  const [user, setUser] = useState(null); // Store user data
  const [desOpen, desItOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const adminEmail = localStorage.getItem("adminEmail");

      if (data?.user) {
        setUser({ email: data.user.email, role: "user" }); // Normal User
      } else if (adminEmail) {
        setUser({ email: adminEmail, role: "admin" }); // Admin Login
      }
    };

    fetchUser();
  }, []);
  return (
    <>
      <div className="nav-container">
        <div className="nav-left-container">
          <div className="harm" onClick={() => setIsOpen(!isOpen)}>
            <div className="harm-1"></div>
            <div className="harm-1"></div>
            <div className="harm-1"></div>
          </div>
          {isOpen && (
            <div className="dropdown-menu">
              <Link to="/men">Men</Link>
              <Link to="/women">Women</Link>
              <Link to="/junior">Junior</Link>
              <Link to="/onsale">On Sale</Link>
            </div>
          )}
          <div className="nav-left-image">
            <img src={eagle} alt="Logo" />
          </div>
          <div className="nav-left-link">
            <ul>
              <Link to="/admindashboard">Home</Link>
              <p className="cat" onClick={() => desItOpen(!desOpen)}>
                Category
              </p>
              <Link to="/onsale">On Sale</Link>
            </ul>
            {desOpen && (
              <div className="desktop-drop">
                <div className="desktop-li">
                  <Link to="/men">Men</Link>
                  <Link to="/women">Junior</Link>
                  <Link to="/junior">Women</Link>
                </div>
              </div>
            )}
            {/* <ul>
                       
         
                       
                     </ul> */}
          </div>
        </div>

        <div className="right-nav">
          <SearchBar />
          <div className="right-nav-images">
            <div className="nav-images">
              <img
                src={profile}
                alt="Profile"
                onClick={() => itOpen(!open)}
                style={{ cursor: "pointer" }}
              />
            </div>

            {/* Dropdown Menu */}
            {open && (
              <div className="profile-dropdown">
                <div className="profile-header">
                  <div className="profile-info">
                    <h4>
                      {user?.email === "admin@sapphix.com" ? "Admin" : "User"}
                    </h4>
                    <p>{user?.email || "No Email"}</p>
                  </div>
                </div>

                <ul className="profile-menu">
                  <li>
                    <Lock size={18} /> <a href="/admin/dashboard">Dashboard</a>
                  </li>
                  <li>
                    <Lock size={18} /> <a href="">Order History</a>
                  </li>
                  <li>
                    <RefreshCw size={18} /> <a href="">Return Orders</a>
                  </li>
                  <li>
                    <User size={18} /> <a href="">Account Info</a>
                  </li>
                  <li>
                    <Key size={18} /> <a href="">Change Password</a>
                  </li>
                  <li>
                    <MapPin size={18} /> <a href="">Address</a>
                  </li>
                  <li
                    className="logout"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      localStorage.removeItem("userRole"); // Clear admin role
                      localStorage.removeItem("adminEmail"); // Remove stored admin email
                      window.location.href = "/adminlogin"; // Redirect to login page
                    }}
                  >
                    <LogOut size={18} /> Logout
                  </li>
                </ul>
              </div>
            )}
            <div className="nav-images">
              <img src={wishlist} alt="Wishlist" />
              {/* {wishlistItems.length > 0 && (
                <span className="wishlist-count">{wishlistItems.length}</span>
              )} */}
            </div>
            {/* Cart Icon Clickable */}
            <div className="nav-images" onClick={() => setIsCartOpen(true)}>
              <img src={cart} alt="Cart" />
              {adminCartItems.length > 0 && (
                <span className="cart-count">{adminCartItems.length}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Component */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default AdminNavaabr;
