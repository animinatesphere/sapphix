import { useEffect, useState } from "react";
import { useCart } from "../component/CartContext";
import "../componentcss/CartSidebar.css";
import { supabase } from "../../supabase";
import { FaTimes, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const CartSidebar = ({ isOpen, onClose }) => {
  const {
    adminCartItems,
    removeFromAdminCart,
    increaseAdminQuantity,
    decreaseAdminQuantity,
  } = useCart();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // Fetch admin products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("Admin-product").select("*");

      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        setProducts(data); // ✅ Store fetched products
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Merge cart items with product details
  const allCartItems = adminCartItems.map((cartItem) => {
    const product = cartItem.product || {}; // Ensure product exists

    return {
      ...cartItem,
      name: product.name || "Unnamed Product",
      price: product.price || 0,
      image: product.image || "/placeholder.jpg",
    };
  });

  console.log("🛒 Merged Cart Items:", allCartItems);

  console.log("🛒 Merged Cart Items:", allCartItems);
  const adminTotalAmount = allCartItems.reduce((total, item) => {
    return total + (item.price * item.quantity || 0);
  }, 0);
  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      ></div>
      <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>
            My Cart <span className="cart-length"> {allCartItems.length}</span>
          </h2>
          <FaTimes className="close-icon" onClick={onClose} />
        </div>

        <div className="cart-items">
          {allCartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            allCartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name || "Product"}
                  className="cart-item-img"
                />

                <div className="cart-item-info">
                  <div className="quantity-controls">
                    <div className="incre">
                      <button onClick={() => decreaseAdminQuantity(item.id)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseAdminQuantity(item.id)}>
                        +
                      </button>
                    </div>
                    <div className="dele">
                      <FaTrash
                        className="delete-icon"
                        onClick={() => removeFromAdminCart(item.id)}
                      />
                    </div>
                  </div>
                  <div className="second">
                    <h4>{item.name}</h4>
                    <p className="price">
                      ₦{((item.price || 0) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                  <p className="colo">Color: {item.color || "N/A"}</p>
                  <p className="si">Size: {item.size || "N/A"}</p>
                  <p className="price2">
                    ₦{((item.price || 0) * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <h3 className="surr">
            Subtotal:{" "}
            <span className="suu">₦{adminTotalAmount.toLocaleString()}</span>
          </h3>

          <Link to="/checkout">
            <button className="checkout-btn">Checkout</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
