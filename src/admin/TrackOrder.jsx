import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import NavbarHead from "../navbar-component/NavbarHead";
import Navbar from "../navbar-component/Navbars1";
import "../admin/TrackOrder.css";
import { supabase } from "../../supabase";

const TrackOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Map delivery_status values to step numbers
  const statusSteps = {
    processing: 1,
    dispatched: 2,
    "ready to pickup": 3,
    delivered: 4,
  };

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

  const getDeliveryStatus = () => {
    // Match our status terms with what's used in the admin panel
    return order?.delivery_status || "processing";
  };

  const getCurrentStep = () => {
    const status = getDeliveryStatus();
    return statusSteps[status] || 1;
  };

  if (loading) {
    return (
      <>
        <NavbarHead />
        <Navbar />
        <div className="track-order-container">
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
        <div className="track-order-container">
          <div className="error-message">{error || "Order not found"}</div>
          <Link to="/" className="back-to-home">
            Return to Home
          </Link>
        </div>
      </>
    );
  }

  const currentStep = getCurrentStep();
  const estimatedDelivery = order.estimated_delivery
    ? new Date(order.estimated_delivery).toLocaleDateString()
    : "To be determined";

  const orderDetails = order.order_details || {};
  const items = orderDetails.items || [];

  // Format dates - if dates are not available in the database, calculate them based on created_at
  const orderDate = new Date(order.created_at);

  const getProcessingDate = () => {
    return order.processing_date
      ? new Date(order.processing_date).toLocaleDateString()
      : orderDate.toLocaleDateString();
  };

  const getDispatchedDate = () => {
    if (order.dispatched_date)
      return new Date(order.dispatched_date).toLocaleDateString();
    if (currentStep >= 2) {
      const dispatchDate = new Date(orderDate);
      dispatchDate.setDate(dispatchDate.getDate() + 1);
      return dispatchDate.toLocaleDateString();
    }
    return "";
  };

  const getOutForDeliveryDate = () => {
    if (order.out_for_delivery_date)
      return new Date(order.out_for_delivery_date).toLocaleDateString();
    if (currentStep >= 3) {
      const deliveryDate = new Date(orderDate);
      deliveryDate.setDate(deliveryDate.getDate() + 2);
      return deliveryDate.toLocaleDateString();
    }
    return "";
  };

  const getDeliveredDate = () => {
    if (order.delivered_date)
      return new Date(order.delivered_date).toLocaleDateString();
    if (currentStep >= 4) {
      const completedDate = new Date(orderDate);
      completedDate.setDate(completedDate.getDate() + 3);
      return completedDate.toLocaleDateString();
    }
    return "";
  };

  return (
    <>
      <NavbarHead />
      <Navbar />
      <div className="track-order-container">
        <div className="track-order-header">
          <h1>Track Your Order</h1>
          <div className="order-basic-info">
            <div className="info-item">
              <span className="label">Order Number:</span>
              <span className="value">{order.id}</span>
            </div>
            <div className="info-item">
              <span className="label">Order Date:</span>
              <span className="value">
                {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Estimated Delivery:</span>
              <span className="value">{estimatedDelivery}</span>
            </div>
            <div className="info-item">
              <span className="label">Status:</span>
              <span
                className={`value status-${order.delivery_status?.replace(
                  /\s+/g,
                  "-"
                )}`}
              >
                {order.delivery_status || "Processing"}
              </span>
            </div>
          </div>
        </div>

        <div className="tracking-progress-section">
          <h2>Shipping Status</h2>

          <div className="progress-tracker">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(currentStep - 1) * 33.33}%` }}
              ></div>
            </div>

            <div className="progress-steps">
              <div
                className={`step ${currentStep >= 1 ? "active" : ""} ${
                  currentStep > 1 ? "completed" : ""
                }`}
              >
                <div className="step-icon">1</div>
                <div className="step-label">Processing</div>
                <div className="step-date">{getProcessingDate()}</div>
              </div>

              <div
                className={`step ${currentStep >= 2 ? "active" : ""} ${
                  currentStep > 2 ? "completed" : ""
                }`}
              >
                <div className="step-icon">2</div>
                <div className="step-label">Dispatched</div>
                <div className="step-date">{getDispatchedDate()}</div>
              </div>

              <div
                className={`step ${currentStep >= 3 ? "active" : ""} ${
                  currentStep > 3 ? "completed" : ""
                }`}
              >
                <div className="step-icon">3</div>
                <div className="step-label">Ready for Pickup</div>
                <div className="step-date">{getOutForDeliveryDate()}</div>
              </div>

              <div className={`step ${currentStep >= 4 ? "active" : ""}`}>
                <div className="step-icon">4</div>
                <div className="step-label">Delivered</div>
                <div className="step-date">{getDeliveredDate()}</div>
              </div>
            </div>
          </div>

          <div className="status-message">
            {order.delivery_status === "processing" && (
              <p>
                Your order is being processed. We'll update you when it ships.
              </p>
            )}
            {order.delivery_status === "dispatched" && (
              <p>
                Your order has been dispatched! It's on the way to the courier.
              </p>
            )}
            {order.delivery_status === "ready to pickup" && (
              <p>Your order is out for delivery and will arrive soon.</p>
            )}
            {order.delivery_status === "delivered" && (
              <p>
                Your order has been delivered. Thank you for shopping with us!
              </p>
            )}
          </div>

          {order.tracking_number && (
            <div className="tracking-details">
              <div className="tracking-number">
                <span className="label">Tracking Number:</span>
                <span className="value">{order.tracking_number}</span>
              </div>
              <div className="carrier-info">
                <span className="label">Carrier:</span>
                <span className="value">
                  {order.carrier || "Standard Shipping"}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="order-summary-section">
          <h2>Order Summary</h2>
          <div className="items-summary">
            {items.map((item, index) => (
              <div key={index} className="summary-item">
                <div className="item-image">
                  <img src={item.image || "/placeholder.jpg"} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>Qty: {item.quantity}</p>
                  {item.color !== "N/A" && <p>Color: {item.color}</p>}
                  {item.size !== "N/A" && <p>Size: {item.size}</p>}
                </div>
                <div className="item-price">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Total:</span>
              <span className="total-amount">
                ₦{order.total_amount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="tracking-actions">
          <Link to="/" className="btn btn-secondary">
            Continue Shopping
          </Link>
          <Link to="/contact-support" className="btn btn-primary">
            Need Help?
          </Link>
        </div>
      </div>
    </>
  );
};

export default TrackOrder;
