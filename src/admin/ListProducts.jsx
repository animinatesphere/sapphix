import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import "../admin/ProductList.css";
import { FiMoreVertical, FiEdit, FiTrash } from "react-icons/fi";
import house from "../admin/admin-folder/house.png";
import television from "../admin/admin-folder/television.png";
import spend from "../admin/admin-folder/spend.png";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

const ListProducts = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [random6Digit, setRandom6Digit] = useState("");
  const [random5Digit, setRandom5Digit] = useState("");
  const [random2Digit, setRandom2Digit] = useState("");
  const [random1Digit, setRandom1Digit] = useState("");
  const [menuOpen, setMenuOpen] = useState(null); // Track which row's menu is open
  const [loading, setLoading] = useState(false);

  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    setLoading(true);

    // 🔍 Try deleting and log the response
    const { error, data } = await supabase
      .from("Admin-product")
      .delete()
      .eq("id", productId);

    console.log("🗑 Delete response:", { data, error }); // Debug log

    if (error) {
      console.error("🚨 Error deleting product:", error.message);
      alert("Failed to delete product: " + error.message);
    } else {
      alert("✅ Product deleted successfully!");

      // Remove product from local state
      setProducts((prev) => prev.filter((product) => product.id !== productId));
    }

    setLoading(false);
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("Admin-product")
          .select("*");
        if (error) {
          console.error("Error fetching products:", error.message);
        } else {
          console.log("Fetched products:", data);
          setProducts(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const generateRandomNumbers = () => {
      setRandom6Digit(
        Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
      );
      setRandom2Digit(Math.floor(Math.random() * (99 - 10 + 1)) + 10);
      setRandom5Digit(Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000);
      setRandom1Digit(Math.floor(Math.random() * (9 - 1 + 1)) + 1);
    };
    generateRandomNumbers();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // Function to toggle menu for each product row

  return (
    <div className="product-list">
      <h2 className="header">List of Products</h2>
      <p className="list-head2">
        This contains the total number of products and their prices.
      </p>
      <div className="list-card">
        <div className="list-card1">
          <div className="list-card1-left">
            <h1 className="card1-left-text">
              &#x20A6;{random6Digit.toLocaleString()}
            </h1>
            <p className="card1-left-text2">In store sales</p>
            <p className="card1-left-text2">
              {random1Digit}k Orders{" "}
              <span className="card-sa">{random2Digit}%</span>
            </p>
          </div>
          <div className="list-card2-right">
            <img src={house} alt="" />
          </div>
        </div>
        <div className="list-card1">
          <div className="list-card1-left">
            <h1 className="card1-left-text">
              &#x20A6;{random6Digit.toLocaleString()}
            </h1>
            <p className="card1-left-text2">Website sales</p>
            <p className="card1-left-text2">
              {random1Digit}k Orders{" "}
              <span className="card-sa">{random2Digit}%</span>
            </p>
          </div>
          <div className="list-card2-right">
            <img src={spend} alt="" />
          </div>
        </div>
        <div className="list-card1">
          <div className="list-card1-left">
            <h1 className="card1-left-text">
              &#x20A6;{random5Digit.toLocaleString()}
            </h1>
            <p className="card1-left-text2">Discount</p>
            <p className="card1-left-text2">
              {random1Digit}k Orders{" "}
              <span className="card-sa">{random2Digit}%</span>
            </p>
          </div>
          <div className="list-card2-right">
            <img src={television} alt="" />
          </div>
        </div>
      </div>
      <div className="search-butt-list">
        <div className="search-list">
          <FiSearch />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="search-list-butt">
          <Link to="/admin/dashboard/products/add">
            <button>+ Add Product</button>
          </Link>
        </div>
      </div>
      <table className="product-table">
        <thead>
          <tr className="tab">
            <th className="tab1">Product</th>
            <th>Category</th>
            <th>Stock</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.length === 0 ? (
            <tr>
              <td colSpan="8">No products found</td>
            </tr>
          ) : (
            currentProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="product-info">
                    <div className="square"></div>
                    <img
                      src={product.image || "/placeholder.png"}
                      alt={product.name}
                    />
                    <div>
                      <p className="product-name">{product.name}</p>
                      <p className="product-description">
                        {product.description.slice(0, 20)}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <p className="tab-cat">{product.category}</p>
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={product.quantity > 0}
                    readOnly
                  />
                </td>
                <td>
                  <p className="tab-sku">{product.sku}</p>
                </td>
                <td>
                  <p className="retail">&#x20A6;{product.price}</p>
                </td>
                <td>
                  <p className="tab-qua">{product.quantity}</p>
                </td>
                <td>
                  <span
                    className={`status ${
                      product.quantity > 0 ? "published" : "inactive"
                    }`}
                  >
                    {product.quantity > 0 ? "Published" : "Inactive"}
                  </span>
                </td>
                <td className="action-cell">
                  <button
                    className="action-button"
                    onClick={() => toggleMenu(product.id)}
                  >
                    <FiMoreVertical />
                  </button>
                  {menuOpen === product.id && (
                    <div className="action-menu">
                      <Link
                        to={`/admin/dashboard/products/edit/${product.id}`}
                        className="action-item"
                      >
                        <FiEdit /> Edit
                      </Link>
                      <button
                        className="action-item delete"
                        onClick={() => handleDelete(product.id)}
                        disabled={loading}
                      >
                        {loading ? (
                          "Deleting..."
                        ) : (
                          <>
                            <FiTrash /> Delete
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={currentPage === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default ListProducts;
