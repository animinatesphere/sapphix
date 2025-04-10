import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import "../admin/ProductList.css";
import { FiMoreVertical, FiEdit, FiTrash, FiSearch, FiX } from "react-icons/fi";
import house from "../admin/admin-folder/house.png";
import television from "../admin/admin-folder/television.png";
import spend from "../admin/admin-folder/spend.png";
import { Link } from "react-router-dom";

const ListProducts = () => {
  // Keep all existing state variables and functions
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [random6Digit, setRandom6Digit] = useState("");
  const [random5Digit, setRandom5Digit] = useState("");
  const [random2Digit, setRandom2Digit] = useState("");
  const [random1Digit, setRandom1Digit] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [productToDelete, setProductToDelete] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const productsPerPage = 15;

  // Add window resize listener to detect mobile screens
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Keep all existing functions: toggleMenu, openDeleteConfirmModal, handleDelete, etc.
  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  const openDeleteConfirmModal = (productId) => {
    setProductToDelete(productId);
    setConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    setLoading(true);
    setConfirmModalOpen(false);

    try {
      const { error } = await supabase
        .from("Admin-product")
        .delete()
        .eq("id", productToDelete);

      if (error) {
        console.error("🚨 Error deleting product:", error);
        setModalMessage("Failed to delete product: " + error.message);
        setShowModal(true);
      } else {
        setProducts((prev) =>
          prev.filter((product) => product.id !== productToDelete)
        );
        setModalMessage("✅ Product deleted successfully!");
        setShowModal(true);
      }
    } catch (err) {
      console.error("Unexpected error during delete:", err);
      setModalMessage("An unexpected error occurred: " + err.message);
      setShowModal(true);
    } finally {
      setLoading(false);
      setProductToDelete(null);
    }
  };

  const handleVisibilityToggle = async (productId, currentStatus) => {
    const newStatus = !currentStatus;

    try {
      const { error } = await supabase
        .from("Admin-product")
        .update({ visible: newStatus })
        .eq("id", productId);

      if (error) {
        console.error("Error updating product visibility:", error.message);
        setModalMessage(
          "Failed to update product visibility: " + error.message
        );
        setShowModal(true);
      } else {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === productId
              ? { ...product, visible: newStatus }
              : product
          )
        );
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setModalMessage("An unexpected error occurred");
      setShowModal(true);
    }
  };

  // Keep all existing useEffect hooks

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("Admin-product")
          .select("*");

        if (error) {
          console.error("Error fetching products:", error);
          setModalMessage("Failed to fetch products: " + error.message);
          setShowModal(true);
        } else {
          console.log("Fetched products:", data);
          const productsWithVisibility = data.map((product) => ({
            ...product,
            visible: product.visible === undefined ? true : product.visible,
          }));
          setProducts(productsWithVisibility);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setModalMessage("An unexpected error occurred: " + err.message);
        setShowModal(true);
      } finally {
        setLoading(false);
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

  // Filter by search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase())
  );

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

      {!isMobile ? (
        // Default table view for larger screens
        <table className="product-table">
          <thead>
            <tr className="tab">
              <th className="tab1">Product</th>
              <th>Category</th>
              <th>Visibility</th>
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
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={product.visible}
                        onChange={() =>
                          handleVisibilityToggle(product.id, product.visible)
                        }
                      />
                      <span className="slider round"></span>
                    </label>
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
                          onClick={() => openDeleteConfirmModal(product.id)}
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
      ) : (
        // Card view for mobile screens
        <div className="mobile-product-cards">
          {currentProducts.length === 0 ? (
            <div className="empty-product-message">No products found</div>
          ) : (
            currentProducts.map((product) => (
              <div key={product.id} className="mobile-product-card">
                <div className="mobile-product-header">
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
                  <div className="action-cell">
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
                          onClick={() => openDeleteConfirmModal(product.id)}
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
                  </div>
                </div>
                <div className="mobile-product-details">
                  <div className="mobile-product-detail-item">
                    <span className="detail-label">Category:</span>
                    <span className="tab-cat">{product.category}</span>
                  </div>
                  <div className="mobile-product-detail-item">
                    <span className="detail-label">Visibility:</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={product.visible}
                        onChange={() =>
                          handleVisibilityToggle(product.id, product.visible)
                        }
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="mobile-product-detail-item">
                    <span className="detail-label">SKU:</span>
                    <span className="tab-sku">{product.sku}</span>
                  </div>
                  <div className="mobile-product-detail-item">
                    <span className="detail-label">Price:</span>
                    <span className="retail">&#x20A6;{product.price}</span>
                  </div>
                  <div className="mobile-product-detail-item">
                    <span className="detail-label">Quantity:</span>
                    <span className="tab-qua">{product.quantity}</span>
                  </div>
                  <div className="mobile-product-detail-item">
                    <span className="detail-label">Status:</span>
                    <span
                      className={`status ${
                        product.quantity > 0 ? "published" : "inactive"
                      }`}
                    >
                      {product.quantity > 0 ? "Published" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {totalPages <= 5 ? (
          // Show all page numbers if 5 or fewer
          [...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`page-number ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))
        ) : (
          // Show limited page numbers with ellipsis
          <>
            <button
              className={`page-number ${currentPage === 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>

            {currentPage > 3 && <span className="ellipsis">...</span>}

            {currentPage > 2 && currentPage < totalPages && (
              <>
                {currentPage > 2 && (
                  <button
                    className="page-number"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    {currentPage - 1}
                  </button>
                )}

                <button className="page-number active">{currentPage}</button>

                {currentPage < totalPages - 1 && (
                  <button
                    className="page-number"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    {currentPage + 1}
                  </button>
                )}
              </>
            )}

            {currentPage < totalPages - 2 && (
              <span className="ellipsis">...</span>
            )}

            <button
              className={`page-number ${
                currentPage === totalPages ? "active" : ""
              }`}
              onClick={() => setCurrentPage(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          className="pagination-btn"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="close-button"
              >
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this product?</p>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="delete-button"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Notification</h3>
              <button
                onClick={() => setShowModal(false)}
                className="close-button"
              >
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <p>{modalMessage}</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowModal(false)} className="ok-button">
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProducts;
