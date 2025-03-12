import React from "react";
import { useCart } from "../component/CartContext";
import "../componentcss/CartSidebar.css"; // Make sure this contains the updated CSS
import { FaTimes, FaTrash } from "react-icons/fa"; // Close & Delete Icons

const CartSidebar = ({ isOpen, onClose }) => {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalAmount,
  } = useCart();

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
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-img"
                />

                <div className="cart-item-info">
                  {/* Quantity Controls */}
                  <div className="quantity-controls">
                    <div className="add">
                      <button onClick={() => decreaseQuantity(item.id)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item.id)}>
                        +
                      </button>
                    </div>
                    <FaTrash
                      className="delete-icon"
                      onClick={() => removeFromCart(item.id)}
                    />
                  </div>
                  <div className="first-info">
                    <h4>{item.name}</h4>
                    <p className="price">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                  <p className="colo">Color: {item.color}</p>
                  <p className="si">Size: {item.size}</p>
                  <p className="price2">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer */}
        <div className="cart-footer">
          <h3 className="surr">
            Subtotal:{" "}
            <span className="suu"> ₦{totalAmount.toLocaleString()}</span>
          </h3>
          <button className="checkout-btn">Checkout</button>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
