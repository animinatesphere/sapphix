import React, { useState, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useCart } from "../component/CartContext";
import { Link } from "react-router-dom";
import "../women/ProductListing.css";
import Navbar from "../navbar-component/Navbars1";
import NavbarHead from "../navbar-component/NavbarHead";
import cart from "../assets/Cart.png";
import { FaStar, FaRegStar } from "react-icons/fa";
import FooterSection from "../component/FooterSection";
import ProductListingLoading from "../women/ProductListingLoading";
import { supabase } from "../../supabase";

const categories = ["Clothing", "Bags", "Accessories", "Headwear"];

const Men = () => {
  const { addToCart } = useCart();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const itemsPerPage = 9;
  const { wishlistItems, addToWishlist } = useCart();

  // Fetch products for men from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("Admin-product") // Fetch from correct table
        .select("*")
        .eq("category", "Men"); // Only get Men’s products

      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Check if this product is in the wishlist

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) return <ProductListingLoading />;

  return (
    <>
      <NavbarHead />
      <Navbar />
      <div className="bread">
        <p>Home / Men / Lifestyle</p>
      </div>
      <div className="product-listing">
        {/* Sidebar */}
        <aside className="sideba">
          <h3 className="sidebar-title">Lifestyle</h3>
          <div className="search-container2">
            <input
              type="text"
              className="search-bar"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {categories.map((cat, index) => (
            <button key={index} className="category-btn">
              {cat} <p className="plus">+</p>
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="product-container">
          <div className="filter-parent">
            <div className="filters">
              <span className="fil">Filters:</span>
              <button className="filter-btn">Brand (1)</button>
              <button className="filter-btn">Color</button>
              <button className="filter-btn">Price</button>
            </div>
            <div className="sort-options">
              <p>Sort by:</p> <span className="sort">Most Popular</span>
            </div>
          </div>

          {/* Product Grid */}
          {/* Product Grid */}
          <div className="product-grid">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => {
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
                      <span className="review-count">
                        ({product.reviews || 0})
                      </span>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                &lt; Previous
              </button>
              <div>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`page-number ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                className="pagination-btn"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next &gt;
              </button>
            </div>
          )}
        </main>
      </div>
      <FooterSection />
    </>
  );
};

export default Men;
