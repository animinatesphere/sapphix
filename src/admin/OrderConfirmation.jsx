import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
// import { createClient } from "@supabase/supabase-js";
import NavbarHead from "../navbar-component/NavbarHead";
import Navbar from "../navbar-component/Navbars1";
import "../admin/OrderConfirmation.css"; // You'll need to create this CSS file

import { supabase } from "../../supabase";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (error) throw error;
        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <>
        <NavbarHead />
        <Navbar />
        <div className="order-confirmation-container">
          <div className="loading">Loading order details...</div>
        </div>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <NavbarHead />
        <Navbar />
        <div className="order-confirmation-container">
          <div className="error-message">{error || "Order not found"}</div>
          <Link to="/" className="back-to-home">
            Return to Home
          </Link>
        </div>
      </>
    );
  }

  const orderDetails = order.order_details || {};
  const items = orderDetails.items || [];
  const shippingAddress = orderDetails.shipping_address || {};

  return (
    <>
      <NavbarHead />
      <Navbar />
      <div className="order-confirmation-container">
        <div className="confirmation-header">
          <div className="check-icon">✓</div>
          <h1>Thank You For Your Order!</h1>
          <p>Your order has been received and is being processed.</p>
        </div>

        <div className="order-details-card">
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-info">
              <div className="info-item">
                <span className="label">Order Number:</span>
                <span className="value">{order.id}</span>
              </div>
              <div className="info-item">
                <span className="label">Date:</span>
                <span className="value">
                  {new Date(order.created_at).toLocaleString()}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Payment Method:</span>
                <span className="value">{orderDetails.payment_method}</span>
              </div>
              <div className="info-item">
                <span className="label">Payment Status:</span>
                <span className={`value status ${order.payment_status}`}>
                  {order.payment_status}
                </span>
              </div>
            </div>
          </div>

          <div className="shipping-details">
            <h2>Shipping Details</h2>
            <div className="address">
              <p>
                <strong>{order.customer_name}</strong>
              </p>
              <p>{shippingAddress.address}</p>
              <p>
                {shippingAddress.city}, {shippingAddress.zipCode}
              </p>
              <p>Email: {order.customer_email}</p>
            </div>
          </div>

          <div className="order-items">
            <h2>Items Ordered</h2>
            <div className="items-list">
              {items.map((item, index) => (
                <div key={index} className="item">
                  <div className="item-image">
                    <img
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                    />
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="item-meta">
                      <p>Quantity: {item.quantity}</p>
                      {item.color !== "N/A" && <p>Color: {item.color}</p>}
                      {item.size !== "N/A" && <p>Size: {item.size}</p>}
                    </div>
                    <p className="item-price">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-total">
            <h2>Payment Summary</h2>
            <div className="total-breakdown">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>₦{order.total_amount.toLocaleString()}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>₦0.00</span>
              </div>
              <div className="total-row">
                <span>Tax:</span>
                <span>₦0.00</span>
              </div>
              <div className="total-row grand-total">
                <span>Total:</span>
                <span>₦{order.total_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to="/" className="continue-shopping">
            Continue Shopping
          </Link>
          <Link to={`/track-order/${order.id}`} className="track-order">
            Track Order
          </Link>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
