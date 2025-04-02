import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import cart from "../assets/Cart.png";
import { useCart } from "../component/CartContext";
import { Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import "../women/ProductListing.css";

const Latest = () => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { wishlistItems, addToWishlist } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("Admin-product")
        .select("*")
        .eq("category", "Women")
        .limit(4); // Only fetch 4 products

      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <>
      {/* Product Grid */}
      <h1 className="like" style={{ textAlign: "center", marginTop: "2rem" }}>
        Latest Women wears
      </h1>
      <div className="product-grid2">
        {loading ? (
          <p>Loading...</p>
        ) : products.length > 0 ? (
          products.map((product) => {
            const isInWishlist = wishlistItems.some(
              (item) => item.id === product.id
            );

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
                  onClick={() => addToWishlist(product)}
                  className={`love-button ${isInWishlist ? "active" : ""}`}
                >
                  {isInWishlist ? (
                    <FaHeart color="red" size={20} />
                  ) : (
                    <FiHeart size={20} />
                  )}
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
          })
        ) : (
          <p className="no-results">No products found.</p>
        )}
      </div>
    </>
  );
};

export default Latest;
