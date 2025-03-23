import { useState } from "react";
import NavbarHead from "../navbar-component/NavbarHead";
import Navbar from "../navbar-component/Navbars1";
import "../check/checkout.css";
import { Link } from "react-router-dom";
import { useCart } from "../component/CartContext";

const Checkout = () => {
  const { adminCartItems, totalAmount } = useCart();
  const allCartItems = adminCartItems.map((cartItem) => {
    const product = cartItem.product || {}; // Ensure product exists

    return {
      ...cartItem,
      name: product.name || "Unnamed Product",
      price: product.price || 0,
      image: product.image || "/placeholder.jpg",
    };
  });
  const adminTotalAmount = allCartItems.reduce((total, item) => {
    return total + (item.price * item.quantity || 0);
  }, 0);
  const [selected, setSelected] = useState(null);
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
      {/* order-container */}
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
                    console.error("Product data missing for cart item:", item);
                    return null; // Skip rendering this item if product data is missing
                  }

                  return (
                    <div key={item.id} className="cart-item">
                      <img
                        src={item.image || "/placeholder.jpg"} // ✅ Add fallback image
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
                  <input type="text" placeholder="Jojo" />
                </div>
                <div className="left-row1">
                  <label>Last Name</label>
                  <input type="text" placeholder="Alao" />
                </div>
              </div>
              <div className="order-left-2-2row">
                <div className="left-row1">
                  <label>Address</label>
                  <input type="text" placeholder="Plot 4, Eleyele river road" />
                </div>
              </div>
              <div className="order-left-2-3row">
                <div className="left-row1">
                  <label>City/Town</label>
                  <input type="text" placeholder="Oyo" />
                </div>
                <div className="left-row1">
                  <label>Zip Code</label>
                  <input type="text" placeholder="23401" />
                </div>
              </div>
              <div className="order-left-2-4row">
                <div className="left-row1">
                  <label>Mobile Number</label>
                  <input type="text" placeholder="07031318129" />
                </div>
                <div className="left-row1">
                  <label>Email address</label>
                  <input type="text" placeholder="jomilojualao@renimail.com" />
                </div>
              </div>
            </div>
          </div>
          {/* end of order-left2 */}
        </div>
        {/* end of  order-left */}
        {/* order-right */}
        <div className="order-right">
          <h1 className="order-right-head">Payment Information</h1>
          {/* discount */}
          <div className="discont-right">
            <div className="discount-input">
              <label>Apply Discount</label>
              <input type="text" placeholder="Enter Coupon Code" />
            </div>
            <div className="discount-butt">
              <button>Apply</button>
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
          {/* information */}
          <h1 className="information-head">Enter Card Information</h1>
          <div className="information-container">
            <div className="info-in1">
              <label>Cardholder Name</label>
              <input type="text" placeholder="Jojo Seun Alao  " />
            </div>
            <div className="info-in1">
              <label>Card Number</label>
              <input type="text" placeholder="3043 3131 8129 4334" />
            </div>
          </div>
          {/*end of  information */}
          {/* expiring date */}
          <div className="expire">
            <div className="expire1">
              <label>Expiry Date</label>
              <input type="date" />
            </div>
            <div className="expire1">
              <label>CVV</label>
              <input type="text" placeholder="351" />
            </div>
          </div>
          {/*end of  expiring date */}
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
              <button className="total-bu">
                <span className="su">
                  {" "}
                  Pay ₦{adminTotalAmount.toLocaleString()}
                </span>
              </button>
            </div>
          </div>
          {/* end of total */}
        </div>
        {/*end of order-right */}
      </div>
      {/* end of order-container */}
    </>
  );
};

export default Checkout;
