import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { User, Lock, RefreshCw, Key, MapPin, LogOut } from "lucide-react";
import { useCart } from "../component/CartContext";
import eagle from "../assets/Sapphix logo editable 1.png";
import profile from "../assets/Profile.png";
import wishlist from "../assets/Wishlist.png";
import cart from "../assets/Cart.png";
import SearchBar from "../componentcss/SearchBar";
import CartSidebar from "../component/CartSidebar";
import "../navbar-component/navbar2.css";
// import { supabase } from "../../supabase";

const LoginNavbar = () => {
  const { adminCartItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [open, itOpen] = useState(false);
  const [desOpen, desItOpen] = useState(false);
  // const [user, setUser] = useState(null); // Store user data
  const { wishlistItems } = useCart();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const { data: userData, error } = await supabase.auth.getUser();
  //     if (userData?.user) {
  //       setUser(userData.user);
  //     }
  //   };

  //   fetchUser();
  // }, []);
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
              <Link to="/dashboard">Home</Link>
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
              <Link to="/dashboard">Home</Link>
              <Link>
                <p className="cat" onClick={() => desItOpen(!desOpen)}>
                  Category
                </p>
              </Link>
              <Link to="/onsale">On Sale</Link>
            </ul>
            {desOpen && (
              <div className="desktop-drop">
                <div className="desktop-li">
                  <Link to="/men">Men</Link>
                  <Link to="/junior">Junior</Link>
                  <Link to="/women">Women</Link>
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
                <ul className="profile-menu-but">
                  <li>
                    <Link to="/" className="log-menu">
                      <button className="menu-sign-in">Sign in </button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="log-menu">
                      <button className="menu-sign-up">Sign up</button>
                    </Link>
                  </li>
                </ul>
              </div>
            )}
            <Link to="/wishlist">
              <div className="nav-images">
                <img src={wishlist} alt="Wishlist" />

                {wishlistItems.length > 0 && (
                  <span className="wishlist-count">{wishlistItems.length}</span>
                )}
              </div>
            </Link>
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

export default LoginNavbar;
