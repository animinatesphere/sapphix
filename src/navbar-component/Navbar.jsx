import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../component/CartContext";
import eagle from "../assets/Sapphix logo editable 1.png";
import profile from "../assets/Profile.png";
import wishlist from "../assets/Wishlist.png";
import cart from "../assets/Cart.png";
import SearchBar from "../componentcss/SearchBar";
import "../navbar-component/navbar2.css";

const Navbar = () => {
  const { cartItems, wishlistItems } = useCart(); // Get cart and wishlist state

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
            <img src={eagle} alt="" />
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
              <img src={profile} alt="" />
            </div>
            <div className="nav-images">
              <img src={wishlist} alt="" />
              {wishlistItems.length > 0 && (
                <span className="wishlist-count">{wishlistItems.length}</span>
              )}
            </div>
            <div className="nav-images">
              <img src={cart} alt="" />
              {cartItems.length > 0 && (
                <span className="cart-count">{cartItems.length}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
