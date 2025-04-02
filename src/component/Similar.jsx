import React, { useEffect, useState } from "react";
import cart from "../assets/Cart.png";
import { useCart } from "../component/CartContext";
import { Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import FooterSection from "./FooterSection";
import { supabase } from "../../supabase";

const Similar = ({ category = "Clothing", currentProductId }) => {
  const { addToCart } = useCart();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!currentProductId) {
        setError("No product ID provided");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Query products with the same category but exclude current product
        const { data, error } = await supabase
          .from("Admin-product")
          .select("*")
          .eq("categories", category)
          .neq("id", currentProductId)
          .limit(4);

        if (error) {
          throw error;
        }

        setSimilarProducts(data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching similar products:", err.message);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [category, currentProductId]);

  if (loading) {
    return <p>Loading similar items...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      {/* Product Grid */}
      <h1 className="like" style={{ textAlign: "center" }}>
        Similar Items You Might Like
      </h1>
      <div className="product-grid2">
        {similarProducts && similarProducts.length > 0 ? (
          similarProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <Link to={`/product/${product.id}`} className="product-link">
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                  className="product-image"
                />
              </Link>
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
          ))
        ) : (
          <p className="no-results">No similar products found.</p>
        )}
      </div>
      <FooterSection />
    </>
  );
};

export default Similar;
