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
  const [isUpdating, setIsUpdating] = useState(false);

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

        // Fetch product data from the order_details
        if (orderData.order_details && orderData.order_details.items) {
          setOrderProducts(orderData.order_details.items);
        } else {
          console.log("No order items found in order_details");
          setOrderProducts([]);
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
    if (!order || !orderProducts.length) return;

    const headers = ["Product", "Price", "Quantity", "Total"];

    const csvContent = [
      headers.join(","),
      ...orderProducts.map((item) =>
        [
          item.name || "Unknown Product",
          `₦${(item.price || 0).toFixed(2)}`,
          item.quantity || 0,
          `₦${((item.price || 0) * (item.quantity || 0)).toFixed(2)}`,
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

  // const handleBack = () => {
  //   navigate("order/list");
  // };

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

  // Function to update order status - modified to update both delivery and payment status
  const updateOrderStatus = async (
    newDeliveryStatus,
    newPaymentStatus = null
  ) => {
    setIsUpdating(true);
    try {
      // Create update object
      const updateData = { delivery_status: newDeliveryStatus };

      // Add payment_status to update if provided
      if (newPaymentStatus) {
        updateData.payment_status = newPaymentStatus;
      }

      const { error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", orderId);

      if (error) throw error;

      // Refresh order details after update
      fetchOrderDetails();
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Function to confirm processing
  const confirmProcessing = () => {
    // Update both delivery status to "dispatched" and payment status to "paid"
    updateOrderStatus("dispatched", "paid");
  };

  if (isLoading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (!order) {
    return <div className="error">Order not found</div>;
  }

  // Access shipping address data safely
  const shippingAddress = order.order_details?.shipping_address || {};

  return (
    <div className="order-details-page">
      <Link>
        {" "}
        <div className="back-button">&larr; Back to Orders</div>
      </Link>
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
            <span className="icon">+</span> Edit Order
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
              <tbody className="order-flow">
                {orderProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5">No products found</td>
                  </tr>
                ) : (
                  orderProducts.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td className="product-cell">
                        <div className="product-info">
                          <div className="product-image2">
                            {item.image ? (
                              <img src={item.image} alt={item.name} />
                            ) : (
                              <div className="image-placeholder">📦</div>
                            )}
                          </div>
                          <div className="product-details">
                            <div className="product-name">
                              {item.name || "Unnamed Product"}
                            </div>
                            <div className="product-description">
                              {item.description || ""}
                              {item.color && item.color !== "N/A" && (
                                <span> • Color: {item.color}</span>
                              )}
                              {item.size && item.size !== "N/A" && (
                                <span> • Size: {item.size}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>₦{(item.price || 0).toFixed(2)}</td>
                      <td>{item.quantity || 0}</td>
                      <td>
                        ₦{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                      </td>
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
                  <div className="timeline-date">
                    {new Date(order.created_at).toLocaleString()}
                  </div>
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
                    <div className="timeline-date">
                      {new Date(order.created_at).toLocaleString()}
                    </div>
                    <div className="timeline-actions">
                      <button
                        className="confirm-btn"
                        onClick={confirmProcessing}
                        disabled={isUpdating}
                      >
                        {isUpdating
                          ? "Updating..."
                          : "Confirm Processing & Payment"}
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
                    <div className="timeline-date">
                      {new Date(order.created_at).toLocaleString()}
                    </div>
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
                    {order.customer_name?.charAt(0) || "C"}
                  </div>
                )}
              </div>
              <div className="customer-name-large">
                {order.customer_name || "Customer"}
              </div>
              <div className="customer-id">
                Customer ID: #{order.id || "N/A"}
              </div>
              <div className="customer-orders">12 Orders</div>
            </div>

            <div className="contact-info">
              <h3>Contact Info</h3>
              <div className="contact-item">
                <span>Email:</span>
                <span>{order.customer_email || "N/A"}</span>
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
              <p>
                {shippingAddress.address ||
                  order.shipping_address ||
                  "No shipping address provided"}
              </p>
              {shippingAddress.city && (
                <p>
                  {shippingAddress.city}, {shippingAddress.zipCode || ""}
                </p>
              )}
            </div>

            <div className="billing-address">
              <div className="section-header">
                <h3>Billing Address</h3>
                <button className="edit-section">Edit</button>
              </div>
              <p>{order.billing_address || "Same as shipping address"}</p>
              <div className="payment-method">
                <span>Payment Method:</span>
                <span>
                  {order.order_details?.payment_method ||
                    order.payment_method ||
                    "Credit Card"}
                </span>
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
