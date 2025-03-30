import React from "react";
import Products from "../component/Products";
import cart from "../assets/Cart.png";
import { useCart } from "../component/CartContext";
import { Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
// import FooterSection from "./FooterSection";
const Latest = () => {
  const { addToCart } = useCart();
  return (
    <>
      {/* Product Grid */}
      <h1 className="like" style={{ textAlign: "center", marginTop: "2rem" }}>
        Latest Women wears
      </h1>
      <div className="product-grid">
        {Products.slice(0, 4).map((product) => (
          <div className="product-card" key={product.id}>
            <Link to={`/product/${product.id}`} className="product-link">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
            </Link>
            <div className="title-price">
              <p className="product-title">{product.name}</p>
              <p className="product-price">N{product.price.toLocaleString()}</p>
            </div>
            <p className="product-color">{product.colors}</p>

            {/* Star Ratings */}
            <div className="product-rating">
              {Array.from({ length: 5 }, (_, index) =>
                index < Math.round(product.rating) ? (
                  <FaStar key={index} className="star filled" />
                ) : (
                  <FaRegStar key={index} className="star" />
                )
              )}
              <span className="review-count">({product.reviews})</span>
            </div>

            <button className="add-to-cart" onClick={() => addToCart(product)}>
              <img src={cart} alt="" />
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Latest;
