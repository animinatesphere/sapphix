import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import "../admin/order.css";
import { useNavigate } from "react-router-dom";
import pend from "../admin/pemding.png";
import comp from "../admin/completed.png";
import fail from "../admin/failed.png";
import ref from "../admin/refunded.png";
import { FiSearch } from "react-icons/fi";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    pendingPayment: 0,
    completed: 0,
    failed: 0,
    refunded: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // Fetch orders from Supabase
      const { data, error } = await supabase.from("orders").select("*");

      if (error) throw error;

      if (data) {
        setOrders(data);

        // Calculate statistics
        const pendingPayment = data.filter(
          (order) => order.payment_status === "pending"
        ).length;
        const completed = data.filter(
          (order) =>
            order.payment_status === "paid" &&
            order.delivery_status !== "cancelled"
        ).length;
        const failed = data.filter(
          (order) => order.payment_status === "failed"
        ).length;
        const refunded = data.filter(
          (order) => order.payment_status === "refunded"
        ).length;

        setStats({
          pendingPayment,
          completed,
          failed,
          refunded,
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // Generate CSV of orders
    const headers = [
      "Order",
      "Date",
      "Customer",
      "Payment",
      "Delivery",
      "Total",
    ];

    const csvContent = [
      headers.join(","),
      ...orders.map((order) =>
        [
          order.id,
          new Date(order.created_at).toLocaleString(),
          order.customer_name,
          order.payment_status,
          order.delivery_status,
          `₦${order.total_amount.toFixed(2)}`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "orders_export.csv";
    link.click();
  };

  const addNewOrder = () => {
    // Navigate to add order form
    navigate("/admin/orders/new");
  };

  const getFilteredOrders = () => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toString().includes(searchTerm) ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterStatus === "all") return matchesSearch;

      switch (filterStatus) {
        case "pending":
          return matchesSearch && order.payment_status === "pending";
        case "paid":
          return matchesSearch && order.payment_status === "paid";
        case "failed":
          return matchesSearch && order.payment_status === "failed";
        case "refunded":
          return matchesSearch && order.payment_status === "refunded";
        case "delivered":
          return matchesSearch && order.delivery_status === "delivered";
        case "processing":
          return matchesSearch && order.delivery_status === "processing";
        default:
          return matchesSearch;
      }
    });
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
      case "published":
        return "status-published";
      case "dispatched":
        return "status-dispatched";
      case "ready to pickup":
        return "status-pickup";
      default:
        return "";
    }
  };

  // Function to handle clicking on an order row
  const handleOrderClick = (orderId) => {
    navigate(`/admin/dashboard/orders/${orderId}`);
  };

  return (
    <div className="order-dashboard">
      <div className="dashboard-header">
        <div className="header-title">
          <h1>List of Orders</h1>
          <p>This contains the list of orders and their information</p>
        </div>
        <div className="header-actions">
          <button className="export-btn" onClick={handleExport}>
            <span className="icon">↓</span> Export
          </button>
          <button className="add-order-btn" onClick={addNewOrder}>
            <span className="icon">+</span> Add Order
          </button>
        </div>
      </div>

      <div className="order-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.pendingPayment}</div>
          <div className="stat-icon pending-icon">
            {" "}
            <img src={pend} alt="" />{" "}
          </div>
          <div className="stat-label">Pending Payment</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-icon completed-icon">
            <img src={comp} alt="" />
          </div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.failed}</div>
          <div className="stat-icon failed-icon">
            <img src={fail} alt="" />
          </div>
          <div className="stat-label">Failed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.refunded}</div>
          <div className="stat-icon refunded-icon">
            <img src={ref} alt="" />
          </div>
          <div className="stat-label">Refunded</div>
        </div>
      </div>

      <div className="order-filters">
        <div className="search-list">
          <FiSearch />
          <input
            type="text"
            placeholder="Search"
            // value={search}
            // onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-dropdown">
          <span>Filter by:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="pending">Pending Payment</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
            <option value="delivered">Delivered</option>
            <option value="processing">Processing</option>
          </select>
        </div>
      </div>

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Order</th>
              <th>Date</th>
              <th>Customers</th>
              <th>Payment</th>
              <th>Delivery</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="loading-message">
                  Loading orders...
                </td>
              </tr>
            ) : getFilteredOrders().length === 0 ? (
              <tr>
                <td colSpan="7" className="no-orders-message">
                  No orders found
                </td>
              </tr>
            ) : (
              getFilteredOrders().map((order) => (
                <tr
                  key={order.id}
                  onClick={() => handleOrderClick(order.id)}
                  className="order-row"
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" />
                  </td>
                  <td className="order-id">{order.id}</td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                  <td className="customer-cell">
                    <div className="customer-info">
                      <div className="customer-avatar">
                        {/* Placeholder for customer avatar */}
                        {order.customer_avatar ? (
                          <img
                            src={order.customer_avatar}
                            alt={order.customer_name}
                          />
                        ) : (
                          <div className="avatar-placeholder">
                            {order.customer_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="customer-details">
                        <div className="customer-name">
                          {order.customer_name}
                        </div>
                        <div className="customer-email">
                          {order.customer_email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(
                        order.payment_status
                      )}`}
                    >
                      {order.payment_status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(
                        order.delivery_status
                      )}`}
                    >
                      {order.delivery_status}
                    </span>
                  </td>
                  <td className="order-total">
                    ₦{order.total_amount.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
