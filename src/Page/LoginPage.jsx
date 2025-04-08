import React, { useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import "../login/login.css";
// import UserButtons from "../component/UserButtons";
// import eagle from "../assets/Sapphix logo editable 1.png";
import Navbar from "../navbar-component/Navbars1";
import FooterSection from "../component/FooterSection";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        showNotification(error.message, "error");
        return;
      }

      // Successful login
      if (data.user) {
        // Check if user is an admin
        const { data: adminData } = await supabase
          .from("admins")
          .select("*")
          .eq("user_id", data.user.id)
          .single();

        if (adminData) {
          // User is an admin
          showNotification("Admin login successful!", "success");
          navigate("/admin/dashboard"); // Redirect to admin dashboard
        } else {
          // Regular user
          showNotification("Login successful!", "success");
          navigate("/dashboard"); // Redirect to regular dashboard
        }
      }
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  return (
    <>
      <div className="login-parent">
        <Navbar />
        <div className="login-container">
          {notification && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
              <button
                className="notification-close"
                onClick={() => setNotification(null)}
              >
                &times;
              </button>
            </div>
          )}
          {/* <div className="login-logo">
          <img src={eagle} alt="" />
        </div> */}
          <div className="login-wrapper">
            <div className="login-illustration">
              <div className="illustration-content"></div>
            </div>
            <div className="login-form-container">
              <h1>Sign in</h1>
              <p>Sign in to continue shopping</p>
              <form onSubmit={handleLogin} className="login-form">
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="test@gmail.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    required
                  />
                </div>
                <button type="submit" className="login-button">
                  Sign in
                </button>
                <a href="/forgot-password" className="forgot-password">
                  Forgot Password?
                </a>
                <div className="signup-link">
                  Don't have an account? <a href="/register">Sign up</a>
                  <br /> {/* Add line break for better spacing */}
                  Register as Admin? <a href="/admin/register">Admin Sign up</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </>
  );
}

export default LoginPage;
