import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarHead from "../navbar-component/NavbarHead";
import Navbar from "../navbar-component/Navbars1";
import "../check/checkout.css";
import { Link } from "react-router-dom";
import { useCart } from "../component/CartContext";
import { supabase } from "../../supabase";

const Checkout = () => {
  const navigate = useNavigate();
  const { adminCartItems, totalAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    mobileNumber: "",
    email: "",
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    couponCode: "",
  });
  const [errors, setErrors] = useState({});

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("error"); // "error", "success", "info"

  // Format cart items for display
  const allCartItems = adminCartItems.map((cartItem) => {
    const product = cartItem.product || {}; // Ensure product exists

    return {
      ...cartItem,
      name: product.name || "Unnamed Product",
      price: product.price || 0,
      image: product.image || "/placeholder.jpg",
    };
  });

  // Calculate total amount
  const adminTotalAmount = allCartItems.reduce((total, item) => {
    return total + (item.price * item.quantity || 0);
  }, 0);

  const [selected, setSelected] = useState(null);

  // Show modal function
  const showMessageModal = (message, type = "error") => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "address",
      "city",
      "mobileNumber",
      "email",
    ];

    // Check required fields
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    // Phone validation
    if (
      formData.mobileNumber &&
      !/^\d{10,15}$/.test(formData.mobileNumber.replace(/\D/g, ""))
    ) {
      newErrors.mobileNumber = "Invalid phone number";
    }

    // Card validation if card payment selected
    if (selected === "card") {
      if (!formData.cardholderName) newErrors.cardholderName = "Required";
      if (!formData.cardNumber) newErrors.cardNumber = "Required";
      if (!formData.expiryDate) newErrors.expiryDate = "Required";
      if (!formData.cvv) newErrors.cvv = "Required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save order to Supabase
  const saveOrderToSupabase = async () => {
    try {
      const customerName = `${formData.firstName} ${formData.lastName}`;

      // Create order object
      const newOrder = {
        customer_name: customerName,
        customer_email: formData.email,
        customer_avatar: null, // You can add user avatar if available
        payment_status: selected === "delivery" ? "pending" : "paid",
        delivery_status: "processing", // Default status for new orders
        total_amount: adminTotalAmount,
        order_details: {
          items: allCartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            color: item.color || "N/A",
            size: item.size || "N/A",
            image: item.image,
          })),
          shipping_address: {
            address: formData.address,
            city: formData.city,
            zipCode: formData.zipCode,
          },
          payment_method:
            selected === "card" ? "Credit Card" : "Pay on Delivery",
          coupon_code: formData.couponCode || null,
        },
      };

      // Insert order into Supabase
      const { data, error } = await supabase
        .from("orders")
        .insert(newOrder)
        .select();

      if (error) throw error;

      return data[0];
    } catch (error) {
      console.error("Error saving order:", error);
      throw error;
    }
  };

  // Handle checkout submission
  const handleCheckout = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      document
        .getElementsByName(firstErrorField)[0]
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Validate payment method selection
    if (!selected) {
      showMessageModal("Please select a payment method", "info");
      return;
    }

    setLoading(true);

    try {
      // Process payment (mock for now)
      let paymentSuccessful = true;

      if (selected === "card") {
        // Here you would integrate with a payment gateway
        // For now, we'll just simulate a successful payment
        paymentSuccessful = true;
      }

      if (paymentSuccessful) {
        // Save order to Supabase
        const order = await saveOrderToSupabase();

        // Clear cart
        clearCart();

        // Show success message before redirecting
        showMessageModal(
          "Payment successful! Redirecting to confirmation...",
          "success"
        );

        // Navigate to order confirmation after a short delay
        setTimeout(() => {
          navigate(`/order-confirmation/${order.id}`);
        }, 1500);
      } else {
        showMessageModal("Payment failed. Please try again.", "error");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      showMessageModal(
        "An error occurred during checkout. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Modal component
  const Modal = ({ show, message, type, onClose }) => {
    if (!show) return null;

    let headerColor = "";
    let icon = "";

    switch (type) {
      case "success":
        headerColor = "#4CAF50";
        icon = "✓";
        break;
      case "error":
        headerColor = "#F44336";
        icon = "✕";
        break;
      case "info":
        headerColor = "#2196F3";
        icon = "ℹ";
        break;
      default:
        headerColor = "#2196F3";
        icon = "ℹ";
    }

    return (
      <div className="modal-overlay3">
        <div className="modal-container3">
          <div
            className="modal-header3"
            style={{ backgroundColor: headerColor }}
          >
            <span className="modal-icon3">{icon}</span>
            <span className="modal-title3">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          </div>
          <div className="modal-content3">
            <p>{message}</p>
          </div>
          <div className="modal-footer3">
            <button onClick={onClose} className="modal-button3">
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Loading Overlay component
  const LoadingOverlay = ({ show }) => {
    if (!show) return null;

    return (
      <div className="loading-overlay3">
        <div className="loading-spinne3r"></div>
        <p className="loading-text3">Processing your payment...</p>
      </div>
    );
  };

  return (
    <>
      <NavbarHead />
      <Navbar />
      {/* checkout-head */}
      <h2 className="checkout-head">
        <Link to="/dashboard" className="check-dash">
          Home /
        </Link>
        <p className="check-cart">Cart /</p>
        <Link to="/checkout" className="check-checkout">
          Checkout
        </Link>
      </h2>
      {/* end of checkout-head */}

      {/* Modal */}
      <Modal
        show={showModal}
        message={modalMessage}
        type={modalType}
        onClose={() => setShowModal(false)}
      />

      {/* Loading Overlay */}
      <LoadingOverlay show={loading} />

      {/* order-container */}
      <form onSubmit={handleCheckout}>
        <div className="order-container">
          {/* order-left */}
          <div className="order-left">
            {/* order-left1 */}
            <div className="order-left-1">
              <h2 className="order">
                Order Summary{" "}
                <span className="cart-length"> {allCartItems.length}</span>
              </h2>
              {/* Cart Items */}
              <div className="cart-items">
                {allCartItems.length === 0 ? (
                  <p className="empty-cart">Your cart is empty.</p>
                ) : (
                  allCartItems.map((item) => {
                    if (!item.product) {
                      console.error(
                        "Product data missing for cart item:",
                        item
                      );
                      return null; // Skip rendering this item if product data is missing
                    }

                    return (
                      <div key={item.id} className="cart-item">
                        <img
                          src={item.image || "/placeholder.jpg"}
                          alt={item.name || "Product"}
                          className="cart-item-img"
                        />

                        <div className="cart-item-info">
                          <div className="second">
                            <h4>{item.name}</h4>
                            <p className="price">
                              ₦{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                          <p className="colo">Color: {item.color || "N/A"}</p>
                          <p className="si">Size: {item.size || "N/A"}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            {/* end of order-left1 */}

            {/* order-left2 */}
            <div className="order-left-2">
              <h2 className="oredr-left-2-head">Delivery Information</h2>
              <div className="order-left-2-input">
                <div className="order-left-2-1row">
                  <div className="left-row1">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Jojo"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                    {errors.firstName && (
                      <span className="error">{errors.firstName}</span>
                    )}
                  </div>
                  <div className="left-row1">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Alao"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                    {errors.lastName && (
                      <span className="error">{errors.lastName}</span>
                    )}
                  </div>
                </div>
                <div className="order-left-2-2row">
                  <div className="left-row1">
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Plot 4, Eleyele river road"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                    {errors.address && (
                      <span className="error">{errors.address}</span>
                    )}
                  </div>
                </div>
                <div className="order-left-2-3row">
                  <div className="left-row1">
                    <label>City/Town</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Oyo"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                    {errors.city && (
                      <span className="error">{errors.city}</span>
                    )}
                  </div>
                  <div className="left-row1">
                    <label>Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="23401"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                    />
                    {errors.zipCode && (
                      <span className="error">{errors.zipCode}</span>
                    )}
                  </div>
                </div>
                <div className="order-left-2-4row">
                  <div className="left-row1">
                    <label>Mobile Number</label>
                    <input
                      type="text"
                      name="mobileNumber"
                      placeholder="07031318129"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                    />
                    {errors.mobileNumber && (
                      <span className="error">{errors.mobileNumber}</span>
                    )}
                  </div>
                  <div className="left-row1">
                    <label>Email address</label>
                    <input
                      type="text"
                      name="email"
                      placeholder="jomilojualao@renimail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {errors.email && (
                      <span className="error">{errors.email}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* end of order-left2 */}
          </div>
          {/* end of order-left */}

          {/* order-right */}
          <div className="order-right">
            <h1 className="order-right-head">Payment Information</h1>
            {/* discount */}
            <div className="discont-right">
              <div className="discount-input">
                <label>Apply Discount</label>
                <input
                  type="text"
                  name="couponCode"
                  placeholder="Enter Coupon Code"
                  value={formData.couponCode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="discount-butt">
                <button type="button">Apply</button>
              </div>
            </div>
            {/* end of discount */}

            {/* pay-with */}
            <div className="pay-with">
              <h1 className="head">Pay With</h1>
              <div className="pay-with">
                <div className="pay-with1" onClick={() => setSelected("card")}>
                  <div
                    className={`pa ${selected === "card" ? "active" : ""}`}
                  ></div>
                  <p>Debit or Credit Card</p>
                </div>

                <div
                  className="pay-with2"
                  onClick={() => setSelected("delivery")}
                >
                  <div
                    className={`pa ${selected === "delivery" ? "active" : ""}`}
                  ></div>
                  <p>Pay on Delivery</p>
                </div>
              </div>
            </div>
            {/* end of pay-with */}

            {/* Card information - only show if card payment is selected */}
            {selected === "card" && (
              <>
                <h1 className="information-head">Enter Card Information</h1>
                <div className="information-container">
                  <div className="info-in1">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      name="cardholderName"
                      placeholder="Jojo Seun Alao"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                    />
                    {errors.cardholderName && (
                      <span className="error">{errors.cardholderName}</span>
                    )}
                  </div>
                  <div className="info-in1">
                    <label>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="3043 3131 8129 4334"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                    />
                    {errors.cardNumber && (
                      <span className="error">{errors.cardNumber}</span>
                    )}
                  </div>
                </div>

                {/* expiring date */}
                <div className="expire">
                  <div className="expire1">
                    <label>Expiry Date</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                    />
                    {errors.expiryDate && (
                      <span className="error">{errors.expiryDate}</span>
                    )}
                  </div>
                  <div className="expire1">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      placeholder="351"
                      value={formData.cvv}
                      onChange={handleInputChange}
                    />
                    {errors.cvv && <span className="error">{errors.cvv}</span>}
                  </div>
                </div>
              </>
            )}

            {/* total */}
            <div className="total-check">
              <div className="cart-footer">
                <h3 className="surr">
                  Subtotal:{" "}
                  <span className="suu">
                    {" "}
                    ₦{adminTotalAmount.toLocaleString()}
                  </span>
                </h3>
                <h3 className="surr">
                  Tax (10%):
                  <span className="suu">0.00</span>
                </h3>
                <h3 className="surr">
                  Shipping:
                  <span className="suu">0.00</span>
                </h3>
                <h3 className="surr">
                  Total:
                  <span className="suu">
                    {" "}
                    ₦{adminTotalAmount.toLocaleString()}
                  </span>
                </h3>
                <button
                  type="submit"
                  className="total-bu"
                  disabled={loading || allCartItems.length === 0}
                >
                  <span className="su">
                    {loading
                      ? "Processing..."
                      : `Pay ₦${adminTotalAmount.toLocaleString()}`}
                  </span>
                </button>
              </div>
            </div>
            {/* end of total */}
          </div>
          {/*end of order-right */}
        </div>
      </form>
      {/* end of order-container */}
    </>
  );
};

export default Checkout;
