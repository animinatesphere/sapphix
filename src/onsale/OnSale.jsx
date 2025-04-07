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
import filter from "../men/filter-line.png";

const OnSale = () => {
  const { addToCart } = useCart();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const itemsPerPage = 10;
  const { wishlistItems, addToWishlist } = useCart();
  const [open, setOpen] = useState(false);
  // Add missing state for categories
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredByCategory, setFilteredByCategory] = useState([]);

  // Fetch all products from the "Men" category that are visible
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("Admin-product")
        .select("*")
        .eq("visible", true); // Only get visible products

      if (error) {
        // console.error("Error fetching products:", error.message);
      } else {
        setProducts(data);

        // Extract unique categories (subcategories)
        const uniqueCategories = [
          ...new Set(data.map((product) => product.type).filter(Boolean)),
        ];
        setCategories(uniqueCategories);

        // Initially show all products
        setFilteredByCategory(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      // If clicking the same category again, show all products
      setSelectedCategory(null);
      setFilteredByCategory(products);
    } else {
      // Filter products by the selected category
      setSelectedCategory(category);
      const filtered = products.filter((product) => product.type === category);
      setFilteredByCategory(filtered);
    }
  };

  // Apply search filter to the category-filtered products
  const searchFilteredProducts = filteredByCategory.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(searchFilteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = searchFilteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) return <ProductListingLoading />;

  return (
    <>
      <NavbarHead />
      <Navbar />
      <div className="bread">
        <p>
          <Link to="/dashboard">Home</Link> / <Link to="/men">Men</Link> /
          Lifestyle
        </p>
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

          {categories.map((category, index) => (
            <button
              key={index}
              className={`category-btn ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}{" "}
              <span className="plus">
                {selectedCategory === category ? "-" : "+"}
              </span>
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
              <div className="sort-opt">
                <p>Sort by:</p> <span className="sort">Most Popular</span>
              </div>

              <div className="dropdown-container">
                <button className="filter-but" onClick={() => setOpen(!open)}>
                  <img src={filter} alt="Filter" />
                </button>

                {open && (
                  <div className="dropdown-menu-container">
                    <ul>
                      {categories.map((category, index) => (
                        <li key={index}>
                          <button
                            className={`dropdown-menu2 ${
                              selectedCategory === category ? "active" : ""
                            }`}
                            onClick={() => handleCategoryClick(category)}
                          >
                            {category}
                            <span className="plus">
                              {selectedCategory === category ? "-" : "+"}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="product-grid2">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => {
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

export default OnSale;
