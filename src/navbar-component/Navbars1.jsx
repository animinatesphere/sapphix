import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../component/CartContext";
import eagle from "../assets/Sapphix logo editable 1.png";
import profile from "../assets/Profile.png";
import wishlist from "../assets/Wishlist.png";
import cart from "../assets/Cart.png";
import SearchBar from "../componentcss/SearchBar";
import CartSidebar from "../component/CartSidebar";
import "../navbar-component/navbar2.css";

const Navbar = () => {
  const { cartItems, wishlistItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <div className="nav-container">
        <div className="nav-left-container">
          <div className="harm">
            <div className="harm-1"></div>
            <div className="harm-1"></div>
            <div className="harm-1"></div>
          </div>
          <div className="nav-left-image">
            <img src={eagle} alt="Logo" />
          </div>
          <div className="nav-left-link">
            <ul>
              <Link to="#">Menu</Link>
              <Link to="/women">Women</Link>
              <Link to="#">On Sale</Link>
            </ul>
          </div>
        </div>

        <div className="right-nav">
          <SearchBar />
          <div className="right-nav-images">
            <div className="nav-images">
              <img src={profile} alt="Profile" />
            </div>
            <div className="nav-images">
              <img src={wishlist} alt="Wishlist" />
              {wishlistItems.length > 0 && (
                <span className="wishlist-count">{wishlistItems.length}</span>
              )}
            </div>
            {/* Cart Icon Clickable */}
            <div className="nav-images" onClick={() => setIsCartOpen(true)}>
              <img src={cart} alt="Cart" />
              {cartItems.length > 0 && (
                <span className="cart-count">{cartItems.length}</span>
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

export default Navbar;
