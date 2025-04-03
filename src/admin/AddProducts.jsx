import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import "../admin/AddProductForm.css";
import marked from "../admin/admin-folder/icon-park-twotone_success.png";

const AddProduct = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    quantity: "",
    purchase_price: "",
    price: "",
    brand: "",
    manufacturer: "",
    category: "",

    length: "",
    width: "",
    height: "",
    type: "",
    image: "",
    image1: "",
    image2: "",
    description: "",
    reviews: "",
    color: "",
    sizes: "",
    rating: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "color" || name === "sizes"
          ? value
              .split(",") // Convert to array
              .map((item) => item.trim()) // Remove extra spaces
              .filter((item) => item !== "") // Remove empty strings
          : value, // Keep other fields as strings
    }));
  };

  // File image handling
  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleUpload = async (file) => {
    if (!file) return null;
    try {
      const filePath = `images/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error("Error uploading file:", err.message);
      return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Upload images
    const imageUrls = await Promise.all([
      handleUpload(formData.image),
      handleUpload(formData.image1),
      handleUpload(formData.image2),
    ]);

    // Check if any upload failed
    if (imageUrls.includes(null)) {
      setLoading(false);
      setErrorModal(true);
      return;
    }

    const [imageUrl, image1Url, image2Url] = imageUrls;

    const { data, error } = await supabase.from("Admin-product").insert([
      {
        ...formData,
        image: imageUrl,
        image1: image1Url,
        image2: image2Url,
      },
    ]);

    setLoading(false);
    if (error) {
      console.error("Error saving product:", error.message);
      setErrorModal(true);
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="add-product-container">
      <h2 className="header">Add a New Product</h2>
      <h2 className="head2">Orders placed across your store</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-grou">
          <label className="sk">
            Product SKU*
            <input
              type="text"
              name="sku"
              placeholder="#1242"
              value={formData.sku}
              onChange={handleChange}
              required
            />
          </label>
          <label className="sk">
            Product Name
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label className="sk">
            Quantity
            <input
              type="number"
              name="quantity"
              placeholder="Enter here"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </label>
          <label className="sk">
            Purchase Price
            <input
              type="number"
              name="purchase_price"
              placeholder="N9,280"
              value={formData.purchase_price}
              onChange={handleChange}
              required
            />
          </label>
          <label className="sk">
            Retail Price
            <input
              type="number"
              name="price"
              placeholder="N12,280"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </label>
          <label className="sk">
            Brand
            <input
              type="text"
              name="brand"
              placeholder="Sapphix"
              value={formData.brand}
              onChange={handleChange}
            />
          </label>
          <label className="sk">
            Manufacturer
            <input
              type="text"
              name="manufacturer"
              placeholder="Nigeria"
              value={formData.manufacturer}
              onChange={handleChange}
            />
          </label>
          <label className="sk">
            Category
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Junior">Junior</option>
            </select>
          </label>
          <label className="sk">
            Type
            <select
              name="type" // Change this from "categories" to "type"
              value={formData.type} // Change this to match the new name
              onChange={handleChange}
            >
              <option value="">Select Type</option>
              <option value="Clothing">Clothing</option>
              <option value="Shoe">Shoe</option>
              <option value="Accessories">Accessories</option>
            </select>
          </label>
          <label className="sk">
            Package Dimensions
            <input
              type="number"
              name="length"
              placeholder="Length in inches"
              value={formData.length}
              onChange={handleChange}
            />
          </label>
          <label className="sk">
            <input
              type="number"
              name="width"
              placeholder="Width in inches"
              value={formData.width}
              onChange={handleChange}
            />
          </label>
          <input
            type="number"
            name="height"
            placeholder="Height in inches"
            value={formData.height}
            onChange={handleChange}
          />
          <input
            type="number"
            name="reviews"
            placeholder="reviews"
            value={formData.reviews}
            onChange={handleChange}
          />
          <input
            type="number"
            name="rating"
            placeholder="rating"
            value={formData.rating}
            onChange={handleChange}
          />
          <input
            type="text"
            name="color"
            placeholder="Enter colors (comma-separated)"
            value={formData.color ? formData.color.join(", ") : ""} // Convert array back to string
            onChange={handleChange}
          />

          <input
            type="text"
            name="sizes"
            placeholder="Enter size (comma-separated)"
            value={formData.sizes ? formData.sizes.join(", ") : ""} // Convert array back to string
            onChange={handleChange}
          />
        </div>
        <input
          className="image-url"
          type="file"
          accept="image/*"
          name="image"
          onChange={handleFileChange}
        />
        <input
          className="image-url"
          type="file"
          accept="image/*"
          name="image1"
          onChange={handleFileChange}
        />
        <input
          className="image-url"
          type="file"
          accept="image/*"
          name="image2"
          onChange={handleFileChange}
        />
        <label className="s">
          Description (Optional)
          <textarea
            name="description"
            placeholder="Write here..."
            value={formData.description}
            onChange={handleChange}
          />
        </label>

        <div className="button-group">
          <button type="button">Cancel</button>
          <button type="submit" disabled={loading}>
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      </form>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Processing...</p>
        </div>
      )}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <img src={marked} alt="" />
            <h3 className="added">New Product Added</h3>
            <p className="suces">
              You have successfully added <br /> a new product.
            </p>
            <button
              onClick={() => {
                setShowModal(false);
                navigate("/admin/dashboard/products/list");
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
      {errorModal && (
        <div className="modal-overlay error">
          <div className="modal-content">
            <h3>Error</h3>
            <p>Failed to add product. Please try again.</p>
            <button onClick={() => setErrorModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
