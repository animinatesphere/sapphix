import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Products from "../component/Products";
import { FaStar } from "react-icons/fa";
import store from "../foestaimages/store.png";
import "../componentcss/ProductDetails.css";
import NavbarHead from "../navbar-component/NavbarHead";
import Navbar from "../navbar-component/navbar";
import Similar from "./Similar";
import { useCart } from "./CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [quantity, setQuantity] = useState(1);
  const stock = 12; // Example stock value
  const { addToCart } = useCart();

  useEffect(() => {
    // Simulate fetching product details
    setTimeout(() => {
      const foundProduct = Products.find((p) => p.id === parseInt(id));
      setProduct(foundProduct);
      setLoading(false);
    }, 2000); // Simulated API delay (2s)
  }, [id]);

  const increaseQuantity = () => {
    if (quantity < stock) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // Animated Loading Screen
  if (loading) {
    return (
      <motion.div
        className="loading-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="loading-icon"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          🛍️
        </motion.div>
        <motion.h2
          className="loading-text"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Finding the best deals for you...
        </motion.h2>
      </motion.div>
    );
  }

  if (!product) return <h2>Product not found</h2>;

  return (
    <>
      <NavbarHead />
      <Navbar />
      <h1 className="title">
        Women / Clothing / <span className="title-name">{product.name}</span>
      </h1>
      <div className="product-details">
        <div className="product-images">
          <img src={product.image} alt={product.name} className="main-image" />
          <div className="thumbnails">
            <img src={product.image1} alt={product.name} className="thumb" />
            <img src={product.image3} alt={product.name} className="thumb" />
            <img src={product.image2} alt={product.name} className="thumb" />
          </div>
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="description">{product.description}</p>

          <div className="rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={
                  i < Math.round(product.rating) ? "filled-star" : "star"
                }
              />
            ))}
            <span className="re">({product.reviews})</span>
          </div>

          <h3 className="co">Choose a Color</h3>
          <div className="color-options">
            {product.colors.map((color, index) => (
              <span
                key={index}
                className="color-circle"
                style={{ backgroundColor: color }}
              ></span>
            ))}
          </div>

          <h3 className="six">Select Size</h3>
          <div className="size-options">
            {product.sizes.map((size) => (
              <button key={size} className="size-btn">
                {size}
              </button>
            ))}
          </div>

          <div className="quantity-section">
            <h3 className="quan">Quantity</h3>
            <div className="quantity-paren">
              <div className="quantity-box">
                <button className="quantity-btn" onClick={decreaseQuantity}>
                  -
                </button>
                <span className="quantity">{quantity}</span>
                <button className="quantity-btn" onClick={increaseQuantity}>
                  +
                </button>
              </div>
              <span className="stock-msg">
                Only {stock} items left!
                <br />
                Don’t miss it
              </span>
            </div>
          </div>

          <div className="actions">
            <button className="buy-now">Buy Now</button>
            <button className="add-to-cart" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>

          <div className="free-delivery">
            <img src={store} alt="" />
            <div className="deli">
              <p className="deli1">Free Delivery</p>
              <p className="deli2">
                Enter your Postal Code for Delivery Availability
              </p>
            </div>
          </div>
        </div>
      </div>
      <Similar />
    </>
  );
};

export default ProductDetails;
