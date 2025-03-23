import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import store from "../foestaimages/store.png";
import "../componentcss/ProductDetails.css";
import NavbarHead from "../navbar-component/NavbarHead";
import Navbar from "../navbar-component/Navbars1";
import Similar from "../component/Similar";
import { useCart } from "../component/CartContext";
import { supabase } from "../../supabase"; // Import Supabase instance

const MenDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const { addToAdminCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("Admin-product")
        .select("*")
        .eq("id", id)
        .single(); // Get a single product

      if (error) {
        console.error("Error fetching product:", error.message);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const increaseQuantity = () => {
    if (quantity < product?.quantity) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  const handleAddToCart = () => {
    console.log("🔍 Product data:", product); // Debugging

    if (!product || typeof product.id === "undefined") {
      console.error("❌ Invalid productId:", product?.id);
      alert("Error: Product details are missing. Please try again.");
      return;
    }

    if (!selectedColor || !selectedSize) {
      alert("Please select a color and size before adding to cart.");
      return;
    }

    addToAdminCart({
      productId: Number(product.id), // ✅ Ensure productId is a number
      quantity,
      color: selectedColor, // ✅ Use selectedColor
      size: selectedSize, // ✅ Use selectedSize
    });
  };

  // Loading Animation
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
          Loading product details...
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
        <Link to="/dashboard">Home</Link> / {product.category} /{" "}
        <span className="title-name">{product.name}</span>
      </h1>
      <div className="product-details">
        <div className="product-images">
          <img src={product.image} alt={product.name} className="main-image" />
        </div>

        <div className="product-inf">
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
          {/* Color Selection */}
          <h3 className="co">Choose a Color</h3>
          <div className="color-options">
            {Array.isArray(product.color) && product.color.length > 0 ? (
              product.color.map((color, index) => (
                <span
                  key={index}
                  className={`color-circle ${
                    selectedColor === color ? "selected" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                ></span>
              ))
            ) : (
              <p>No colors available</p>
            )}
          </div>

          {/* Size Selection */}
          <h3 className="six">Select Size</h3>
          <div className="size-options">
            {Array.isArray(product.sizes) && product.sizes.length > 0 ? (
              product.sizes.map((sizes, index) => (
                <button
                  key={index}
                  className={`size-btn ${
                    selectedSize === sizes ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSize(sizes)}
                >
                  {sizes}
                </button>
              ))
            ) : (
              <p>No sizes available</p>
            )}
          </div>

          {/* Quantity Selection */}
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
                Only {product.quantity} items left!
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="actions">
            <button className="buy-now">Buy Now</button>
            {/* <button
              className="add-to-cart"
              onClick={() => {
                if (!selectedColor || !selectedSize) {
                  alert(
                    "Please select a color and size before adding to cart."
                  );
                  return;
                }
                addToAdminCart(product, selectedColor, selectedSize, quantity);
              }}
            >
              Add to Cart
            </button> */}
            <button className="add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>

          {/* Free Delivery Section */}
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

export default MenDetails;
