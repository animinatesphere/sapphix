import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import "../admin/order-details.css";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [orderProducts, setOrderProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    try {
      // Fetch order details
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (orderError) throw orderError;

      if (orderData) {
        setOrder(orderData);

        // Fetch products for this order
        const { data: productsData, error: productsError } = await supabase
          .from("order_products")
          .select("*, products(*)")
          .eq("order_id", orderId);

        if (productsError) throw productsError;

        if (productsData) {
          setOrderProducts(productsData);
        }
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // Generate CSV of order details
    if (!order) return;

    const headers = ["Product", "Price", "Quantity", "Total"];

    const csvContent = [
      headers.join(","),
      ...orderProducts.map((item) =>
        [
          item.products.name,
          `₦${item.unit_price.toFixed(2)}`,
          item.quantity,
          `₦${(item.unit_price * item.quantity).toFixed(2)}`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `order_${orderId}_details.csv`;
    link.click();
  };

  const handleEditOrder = () => {
    navigate(`/admin/orders/edit/${orderId}`);
  };

  const handleBack = () => {
    navigate("/admin/orders");
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "paid":
        return "status-paid";
      case "pending":
        return "status-pending";
      case "failed":
        return "status-failed";
      case "cancelled":
        return "status-cancelled";
      case "delivered":
        return "status-delivered";
      case "processing":
        return "status-processing";
      case "dispatched":
        return "status-dispatched";
      case "ready to pickup":
        return "status-pickup";
      default:
        return "";
    }
  };

  // Function to update order status
  const updateOrderStatus = async (newStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ delivery_status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      // Refresh order details after update
      fetchOrderDetails();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Function to confirm processing
  const confirmProcessing = () => {
    updateOrderStatus("dispatched");
  };

  if (isLoading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (!order) {
    return <div className="error">Order not found</div>;
  }

  return (
    <div className="order-details-page">
      <div className="back-button" onClick={handleBack}>
        &larr; Back to Orders
      </div>

      <div className="order-header">
        <div className="order-title">
          <h1>Order #{orderId}</h1>
          <div className="order-badges">
            <span
              className={`status-badge ${getStatusClass(
                order.delivery_status
              )}`}
            >
              {order.delivery_status}
            </span>
            <span
              className={`status-badge ${getStatusClass(order.payment_status)}`}
            >
              {order.payment_status}
            </span>
          </div>
          <p className="order-date">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <div className="order-actions">
          <button className="export-btn" onClick={handleExport}>
            <span className="icon">↓</span> Export
          </button>
          <button className="edit-btn" onClick={handleEditOrder}>
            <span className="icon">✏️</span> Edit Order
          </button>
        </div>
      </div>

      <div className="order-content">
        <div className="order-main">
          <div className="section">
            <div className="section-header">
              <h2>Order Details</h2>
              <button className="edit-section">Edit</button>
            </div>
            <table className="products-table">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orderProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5">No products found</td>
                  </tr>
                ) : (
                  orderProducts.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td className="product-cell">
                        <div className="product-info">
                          <div className="product-image">
                            {item.products.image_url ? (
                              <img
                                src={item.products.image_url}
                                alt={item.products.name}
                              />
                            ) : (
                              <div className="image-placeholder">📦</div>
                            )}
                          </div>
                          <div className="product-details">
                            <div className="product-name">
                              {item.products.name}
                            </div>
                            <div className="product-description">
                              {item.products.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>₦{item.unit_price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>₦{(item.unit_price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="order-summary">
              <div className="summary-item">
                <span>Subtotal:</span>
                <span>
                  ₦
                  {order.subtotal
                    ? order.subtotal.toFixed(2)
                    : order.total_amount.toFixed(2)}
                </span>
              </div>
              <div className="summary-item">
                <span>Shipping Fee:</span>
                <span>
                  ₦{order.shipping_fee ? order.shipping_fee.toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="summary-item">
                <span>Tax:</span>
                <span>₦{order.tax ? order.tax.toFixed(2) : "0.00"}</span>
              </div>
              <div className="summary-item total">
                <span>Total:</span>
                <span>₦{order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="section shipping-section">
            <h2>Shipping Details</h2>
            <div className="timeline">
              <div className="timeline-item completed">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="timeline-title">
                    Order was placed (Order ID: {orderId})
                  </div>
                  <div className="timeline-subtitle">
                    Your order was placed successfully
                  </div>
                  <div className="timeline-date">Tuesday 01:24am</div>
                </div>
              </div>

              {order.delivery_status === "processing" && (
                <div className="timeline-item active">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Processing</div>
                    <div className="timeline-subtitle">
                      Your order is being processed
                    </div>
                    <div className="timeline-date">Wednesday 01:24am</div>
                    <div className="timeline-actions">
                      <button
                        className="confirm-btn"
                        onClick={confirmProcessing}
                      >
                        Confirm Processing
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {(order.delivery_status === "dispatched" ||
                order.delivery_status === "delivered") && (
                <div
                  className={`timeline-item ${
                    order.delivery_status === "dispatched"
                      ? "active"
                      : "completed"
                  }`}
                >
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Dispatched</div>
                    <div className="timeline-subtitle">
                      Pick-up scheduled with courier
                    </div>
                    <div className="timeline-date">Wednesday 01:24am</div>
                  </div>
                </div>
              )}

              {(order.delivery_status === "ready to pickup" ||
                order.delivery_status === "delivered") && (
                <div
                  className={`timeline-item ${
                    order.delivery_status === "ready to pickup"
                      ? "active"
                      : "completed"
                  }`}
                >
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Ready for Pickup</div>
                    <div className="timeline-subtitle">
                      Item has been picked up by courier
                    </div>
                    <div className="timeline-date">Thursday 01:24am</div>
                  </div>
                </div>
              )}

              {order.delivery_status === "delivered" && (
                <div className="timeline-item completed">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-title">Delivery</div>
                    <div className="timeline-subtitle">
                      Package was delivered successfully
                    </div>
                    <div className="timeline-date">Friday 01:24am</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="order-sidebar">
          <div className="section customer-section">
            <div className="section-header">
              <h2>Customer Details</h2>
            </div>
            <div className="customer-profile">
              <div className="customer-avatar-large">
                {order.customer_avatar ? (
                  <img src={order.customer_avatar} alt={order.customer_name} />
                ) : (
                  <div className="avatar-placeholder-large">
                    {order.customer_name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="customer-name-large">{order.customer_name}</div>
              <div className="customer-id">
                Customer ID: #{order.customer_id || "N/A"}
              </div>
              <div className="customer-orders">12 Orders</div>
            </div>

            <div className="contact-info">
              <h3>Contact Info</h3>
              <div className="contact-item">
                <span>Email:</span>
                <span>{order.customer_email}</span>
              </div>
              <div className="contact-item">
                <span>Mobile:</span>
                <span>{order.customer_phone || "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="section address-section">
            <div className="shipping-address">
              <div className="section-header">
                <h3>Shipping Address</h3>
                <button className="edit-section">Edit</button>
              </div>
              <p>{order.shipping_address || "No shipping address provided"}</p>
            </div>

            <div className="billing-address">
              <div className="section-header">
                <h3>Billing Address</h3>
                <button className="edit-section">Edit</button>
              </div>
              <p>{order.billing_address || "Same as shipping address"}</p>
              <div className="payment-method">
                <span>Payment Method:</span>
                <span>{order.payment_method || "Credit Card"}</span>
              </div>
              {order.card_number && (
                <div className="card-number">
                  <span>Card Number:</span>
                  <span>xxxx{order.card_number.slice(-4)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
