import React, { useEffect, useState } from "react";
import { useCart } from "../component/CartContext";
import { Link } from "react-router-dom";
import { FaHeart, FaStar, FaRegStar } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import cart from "../assets/Cart.png"; // Make sure this path is correct
import Navbar from "../navbar-component/Navbars1";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, addToAdminCart } = useCart();

  useEffect(() => {
    document.title = "My Wishlist";
  }, []);

  // Function to add to cart (simplified version)
  const addToCart = (product) => {
    addToAdminCart({
      productId: product.id,
      quantity: 1,
      color: product.color || "",
      size: product.size || "",
    });
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="empty-wishlist-container">
        <h2>Your Wishlist is Empty</h2>
        <p>Add items to your wishlist to save them for later.</p>
        <Link to="/dashboard" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="wishlist-page-container">
        <p className="wish-link">
          {" "}
          <Link to="/dashboard">Home > </Link> <p>Wishlist</p>
        </p>
        <div className="wish-head">
          <h1 className="wishlist-heading">My Wishlist</h1>
          <p className="wishlis-count">
            ({wishlistItems.length} Products Found)
          </p>
        </div>
        <div className="product-grid">
          {wishlistItems.map((product) => {
            // Every item in wishlist should have this set to true
            const isInWishlist = true;

            return (
              <div className="product-card" key={product.id}>
                <Link
                  to={`/men-product/${product.id}`}
                  className="product-link"
                >
                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    className="product-image"
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className={`love-button active`}
                >
                  <FaHeart color="red" size={20} />
                </button>
                <div className="title-price">
                  <p className="product-title">{product.name}</p>
                  <p className="product-price">
                    N{product.price ? product.price.toLocaleString() : "0"}
                  </p>
                </div>
                <p className="product-color">{product.color || "N/A"}</p>

                {/* Star Ratings */}
                <div className="product-rating">
                  {Array.from({ length: 5 }, (_, index) =>
                    index < Math.round(product.rating || 0) ? (
                      <FaStar key={index} className="star filled" />
                    ) : (
                      <FaRegStar key={index} className="star" />
                    )
                  )}
                  <span className="review-count">({product.reviews || 0})</span>
                </div>

                <button
                  className="add-to-cart"
                  onClick={() => addToCart(product)}
                >
                  <img src={cart} alt="" />
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
