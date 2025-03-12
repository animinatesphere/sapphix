import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Products from "../component/Products";
import { FaStar } from "react-icons/fa";
import cartIcon from "../assets/Cart.png";
import store from "../foestaimages/store.png";
import "../componentcss/ProductDetails.css";
import NavbarHead from "../navbar-component/NavbarHead";
import Navbar from "../navbar-component/navbar";
import Similar from "./Similar";
import FooterSection from "./FooterSection";

const ProductDetails = () => {
  const { id } = useParams();
  const product = Products.find((p) => p.id === parseInt(id));

  if (!product) return <h2>Product not found</h2>;

  const [quantity, setQuantity] = useState(1);
  const stock = 12; // Example stock value

  const increaseQuantity = () => {
    if (quantity < stock) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <>
      <NavbarHead />
      <Navbar />
      <h1 className="title">
        Women / Clothing / <span className="title-name">{product.name}</span>
      </h1>
      <div className="product-details">
        {/* Left Side: Product Images */}
        <div className="product-images">
          <img src={product.image} alt={product.name} className="main-image" />
          <div className="thumbnails">
            <img src={product.image1} alt={product.name} className="thumb" />
            <img src={product.image3} alt={product.name} className="thumb" />
            <img src={product.image2} alt={product.name} className="thumb" />
          </div>
        </div>

        {/* Right Side: Product Info */}
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="description">{product.description}</p>

          {/* Rating Section */}
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
            {product.colors.map((color, index) => (
              <span
                key={index}
                className="color-circle"
                style={{ backgroundColor: color }}
              ></span>
            ))}
          </div>

          {/* Size Selection */}
          <h3 className="six">Select Size</h3>
          <div className="size-options">
            {product.sizes.map((size) => (
              <button key={size} className="size-btn">
                {size}
              </button>
            ))}
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
                Only {stock} items left!
                <br />
                Don’t miss it
              </span>
            </div>
          </div>

          {/* Actions (Buy Now & Add to Cart) */}
          <div className="actions">
            <button className="buy-now">Buy Now</button>
            <button className="add-to-cart">
              <img src={cartIcon} alt="Cart" /> Add to Cart
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
      <FooterSection />
    </>
  );
};

export default ProductDetails;
