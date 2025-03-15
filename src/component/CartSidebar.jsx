import React from "react";
import { useCart } from "../component/CartContext";
import "../componentcss/CartSidebar.css"; // Ensure the CSS is properly linked
import { FaTimes, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const CartSidebar = ({ isOpen, onClose }) => {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalAmount,
  } = useCart();

  // Debugging: Check if cartItems contain the correct data
  console.log("Cart Items in Sidebar:", cartItems);

  return (
    <>
      {/* Blur Overlay */}
      <div
        className={`cart-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      ></div>

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>
            My Cart <span className="cart-length"> {cartItems.length}</span>
          </h2>
          <FaTimes className="close-icon" onClick={onClose} />
        </div>

        {/* Cart Items */}
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => {
              if (!item.product) {
                console.error("Product data missing for cart item:", item);
                return null; // Skip rendering this item if product data is missing
              }

              return (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.product.image || "/placeholder.jpg"} // ✅ Add fallback image
                    alt={item.product.name || "Product"}
                    className="cart-item-img"
                  />

                  <div className="cart-item-info">
                    <div className="quantity-controls">
                      <div className="incre">
                        <button onClick={() => decreaseQuantity(item.id)}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseQuantity(item.id)}>
                          +
                        </button>
                      </div>
                      <div className="dele">
                        <FaTrash
                          className="delete-icon"
                          onClick={() => removeFromCart(item.id)}
                        />
                      </div>
                    </div>
                    <div className="second">
                      <h4>{item.product.name}</h4>
                      <p className="price">
                        ₦{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                    <p className="colo">Color: {item.color || "N/A"}</p>
                    <p className="si">Size: {item.size || "N/A"}</p>

                    <p className="price2">
                      ₦{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Cart Footer */}
        <div className="cart-footer">
          <h3 className="surr">
            Subtotal:{" "}
            <span className="suu"> ₦{totalAmount.toLocaleString()}</span>
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
