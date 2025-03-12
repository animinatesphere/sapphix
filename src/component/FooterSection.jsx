import React from "react";
import "../componentcss/footer.css";
import { Link } from "react-router-dom";
import eagle from "../assets/Sapphix logo editable 1.png";

const FooterSection = () => {
  return (
    <>
      <div className="footer-container">
        {/* footer-first */}
        <div className="footer-first">
          {/* footer-left */}
          <div className="footer-left">
            <div className="footer-left-pic">
              <img src={eagle} alt="" />
              <h1>Sapphix</h1>
            </div>
            <p className="percen-pa">
              {" "}
              Receive an exclusive <span className="perce">15%</span> discount
              code <br />
              when you sign up
            </p>

            {/* footer-middle */}
            <div className="footer-left-input">
              <input
                type="text"
                placeholder="Email address"
                className="footer-i"
              />
              <button>Subsccribe</button>
            </div>
            {/*end of  footer-middle */}
          </div>
          {/* end of footer-left */}
          <div className="middle-paren">
            {/* footer middle */}
            <div className="footer-middle">
              <ul>
                <Link to="#"> About Us</Link>
                <Link to="#">About Sapphix</Link>
                <Link to="#">
                  Careers <span className="midl">We’re hiring!</span>
                </Link>
                <Link to="#">Advertise with Us</Link>
                <Link to="#">Affilates & Partners</Link>
                <Link to="#">Sheda Community</Link>
              </ul>
            </div>
            {/*end of  footer middle */}
            {/* footer middle3 */}
            <div className="footer-middle">
              <ul>
                <Link to="#"> Help</Link>
                <Link to="#">Sheda Help</Link>
                <Link to="#">Track Orders</Link>
                <Link to="#">Returns</Link>
                <Link to="#">Contact Us</Link>
                <Link to="#">Same Day Delivery</Link>
                <Link to="#">Order Pick Up</Link>
                <Link to="#">Registry</Link>
              </ul>
            </div>
            {/*end of  footer middle3 */}
          </div>
          {/*footer middle2 */}
          <div className="footer-middle2">
            <ul>
              <Link to="#"> Stores</Link>
              <Link to="#"> In-Store Services</Link>
            </ul>
          </div>
          {/*end of footer middle2 */}
        </div>
        {/* end of footer-first */}
        {/* footer-last */}
        <div className="footer-last">
          {/* footer-child */}
          <div className="footer-child">
            <div className="footer-child-left">
              <ul>
                <Link to="#">Terms of Service</Link>
                <Link to="#">Privacy Policy</Link>
                <Link to="#">Security</Link>
                <Link to="#">Sitemap</Link>
              </ul>
            </div>
            <div className="footer-child-right">
              <p>© 2023 Sapphix. All rights reserved.</p>
            </div>
          </div>
          {/*end of  footer-child */}
        </div>
        {/* end of footer-last */}
      </div>
    </>
  );
};

export default FooterSection;
