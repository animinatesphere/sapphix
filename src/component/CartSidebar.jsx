import React from "react";
import { useCart } from "../component/CartContext";
import "../componentcss/CartSidebar.css"; // Add this CSS file for styling
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
    <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h2>My Cart ({cartItems.length})</h2>
        <FaTimes className="close-icon" onClick={onClose} />
      </div>

      {/* Cart Items */}
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p>Color: {item.color}</p>
                <p>Size: {item.size}</p>
                <p className="price">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>

                {/* Quantity Controls */}
                <div className="quantity-controls">
                  <button onClick={() => decreaseQuantity(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>
              </div>
              <FaTrash
                className="delete-icon"
                onClick={() => removeFromCart(item.id)}
              />
            </div>
          ))
        )}
      </div>

      {/* Cart Footer */}
      <div className="cart-footer">
        <h3>Subtotal: ₦{totalAmount.toLocaleString()}</h3>
        <button className="checkout-btn">Checkout</button>
      </div>
    </div>
  );
};

export default CartSidebar;
