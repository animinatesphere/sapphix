import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { useParams, useNavigate } from "react-router-dom";
import { FiAlertCircle, FiX } from "react-icons/fi";
import "../admin/EditProduct.css"; // You might need to create this CSS file
import { Link } from "react-router-dom";
function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // Product state
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    sku: "",
    quantity: "",
    visible: true,
    image: "",
  });

  // Form validation
  const [errors, setErrors] = useState({});

  // Categories (you might want to fetch these from the database)
  const categories = [
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Books",
    "Sports",
    "Toys",
    "Beauty",
    "Other",
  ];

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("Admin-product")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching product:", error);
          setModalMessage("Failed to fetch product: " + error.message);
          setShowModal(true);
          setSuccess(false);
        } else if (data) {
          console.log("Fetched product:", data);
          setProduct(data);
        } else {
          setModalMessage("Product not found");
          setShowModal(true);
          setSuccess(false);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setModalMessage("An unexpected error occurred: " + err.message);
        setShowModal(true);
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle different input types
    const newValue = type === "checkbox" ? checked : value;

    // Handle numeric fields
    if (name === "price" || name === "quantity") {
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setProduct({ ...product, [name]: newValue });
      }
    } else {
      setProduct({ ...product, [name]: newValue });
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!product.name?.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!product.description?.trim()) {
      newErrors.description = "Description is required";
    }

    if (!product.price) {
      newErrors.price = "Price is required";
    } else if (
      isNaN(parseFloat(product.price)) ||
      parseFloat(product.price) <= 0
    ) {
      newErrors.price = "Price must be a positive number";
    }

    if (!product.quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (
      isNaN(parseInt(product.quantity)) ||
      parseInt(product.quantity) < 0
    ) {
      newErrors.quantity = "Quantity must be a non-negative integer";
    }

    if (!product.category) {
      newErrors.category = "Please select a category";
    }

    if (!product.sku?.trim()) {
      newErrors.sku = "SKU is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);

    try {
      const updatedProduct = {
        // ... your existing update data ...
        updated_at: new Date().toISOString(),
      };

      console.log("Updating product ID:", id, typeof id);

      const { data, error } = await supabase
        .from("Admin-product")
        .update(updatedProduct)
        .eq("id", id)
        .select("*"); // Critical change here

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Update succeeded but no data returned");
      }

      console.log("Updated record:", data[0]);
      setModalMessage("Product updated successfully!");
      setSuccess(true);
      setTimeout(() => navigate("/admin/dashboard/products/list"), 1500);
    } catch (err) {
      console.error("Update failed:", err);
      setModalMessage(
        err.message.includes("RLS")
          ? "Permission denied (check RLS policies)"
          : err.message
      );
    } finally {
      setSaving(false);
      setShowModal(true);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrors({ ...errors, image: "Image size must be less than 2MB" });
      return;
    }

    try {
      setLoading(true);

      // Create a unique file name
      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("product-images") // Make sure this bucket exists in your Supabase project
        .upload(fileName, file);

      if (error) {
        console.error("Error uploading image:", error);
        setErrors({
          ...errors,
          image: "Failed to upload image: " + error.message,
        });
      } else {
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        setProduct({ ...product, image: urlData.publicUrl });
      }
    } catch (err) {
      console.error("Unexpected error during upload:", err);
      setErrors({ ...errors, image: "Failed to upload image" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-product-container">
      <div className="edit-product-header">
        <h2>Edit Product</h2>
        <button
          className="back-button"
          onClick={() => navigate("/admin/dashboard/products/list")}
        >
          Back to Products
        </button>
      </div>

      {loading ? (
        <div className="loading-indicator">Loading product data...</div>
      ) : (
        <form className="edit-product-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Product Name */}
            <div className="form-group">
              <label htmlFor="name">Product Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && (
                <div className="error-message">{errors.name}</div>
              )}
            </div>

            {/* SKU */}
            <div className="form-group">
              <label htmlFor="sku">SKU*</label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={product.sku}
                onChange={handleChange}
                className={errors.sku ? "input-error" : ""}
              />
              {errors.sku && <div className="error-message">{errors.sku}</div>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">Category*</label>
              <select
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
                className={errors.category ? "input-error" : ""}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div className="error-message">{errors.category}</div>
              )}
            </div>

            {/* Price */}
            <div className="form-group">
              <label htmlFor="price">Price (₦)*</label>
              <input
                type="text"
                id="price"
                name="price"
                value={product.price}
                onChange={handleChange}
                className={errors.price ? "input-error" : ""}
              />
              {errors.price && (
                <div className="error-message">{errors.price}</div>
              )}
            </div>

            {/* Quantity */}
            <div className="form-group">
              <label htmlFor="quantity">Quantity*</label>
              <input
                type="text"
                id="quantity"
                name="quantity"
                value={product.quantity}
                onChange={handleChange}
                className={errors.quantity ? "input-error" : ""}
              />
              {errors.quantity && (
                <div className="error-message">{errors.quantity}</div>
              )}
            </div>

            {/* Visibility */}
            <div className="form-group checkbox-group">
              <label htmlFor="visible" className="checkbox-label">
                <input
                  type="checkbox"
                  id="visible"
                  name="visible"
                  checked={product.visible}
                  onChange={handleChange}
                />
                Visible on store
              </label>
            </div>
          </div>

          {/* Description - full width */}
          <div className="form-group full-width">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              rows={5}
              className={errors.description ? "input-error" : ""}
            ></textarea>
            {errors.description && (
              <div className="error-message">{errors.description}</div>
            )}
          </div>

          {/* Image Upload */}
          <div className="form-group full-width">
            <label htmlFor="image">Product Image</label>
            <div className="image-upload-container">
              {product.image && (
                <div className="image-preview">
                  <img src={product.image} alt="Product" />
                </div>
              )}
              <div className="upload-controls">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={errors.image ? "input-error" : ""}
                />
                <p className="upload-hint">Max file size: 2MB</p>
                {errors.image && (
                  <div className="error-message">{errors.image}</div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/admin/dashboard/products/list")}
            >
              Cancel
            </button>
            <button type="submit" className="save-button" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {/* Notification Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{success ? "Success" : "Error"}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="close-button"
              >
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className={`modal-icon ${success ? "success" : "error"}`}>
                {success ? "✓" : <FiAlertCircle />}
              </div>
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
}

export default EditProduct;
