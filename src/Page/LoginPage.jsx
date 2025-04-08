import React, { useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import "../login/login.css";
import "../Page/login2.css";
import Navbar from "../navbar-component/Navbars1";
import FooterSection from "../component/FooterSection";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const navigate = useNavigate();

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value) {
      setEmailValid(validateEmail(value));
    } else {
      setEmailValid(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      showNotification("Please enter a valid email address", "error");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        showNotification(error.message, "error");
        setIsLoading(false);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="login-parent">
        <Navbar />
        <div className="login-container">
          {notification && (
            <div
              className={`notification ${notification.type} notification-slide-in`}
            >
              {notification.message}
              <button
                className="notification-close"
                onClick={() => setNotification(null)}
              >
                &times;
              </button>
            </div>
          )}
          <div className="login-wrapper">
            <div className="login-illustration">
              <div className="illustration-content"></div>
            </div>
            <div className="login-form-container form-fade-in">
              <h1>Welcome Back</h1>
              <p>Sign in to continue shopping</p>

              <div className="social-login">
                <button className="social-btn google-btn">
                  <i className="social-icon google-icon"></i>
                  Continue with Google
                </button>
                <button className="social-btn facebook-btn">
                  <i className="social-icon facebook-icon"></i>
                  Continue with Facebook
                </button>
              </div>

              <div className="separator">
                <span className="separator-text">or sign in with email</span>
              </div>

              <form onSubmit={handleLogin} className="login-form">
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <div className="input-with-icon">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="test@gmail.com"
                      className={email && !emailValid ? "input-error" : ""}
                      required
                    />
                    <i className="email-icon"></i>
                  </div>
                  {email && !emailValid && (
                    <div className="validation-feedback">
                      Please enter a valid email address
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-with-icon password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <div className="remember-me">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                    <label htmlFor="rememberMe">Remember me</label>
                  </div>
                  <a href="/forgot-password" className="forgot-password">
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className={`login-button ${
                    isLoading ? "button-loading" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading-spinner">
                      <span className="spinner-dot"></span>
                      <span className="spinner-dot"></span>
                      <span className="spinner-dot"></span>
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>

                <div className="signup-links">
                  <div className="signup-option">
                    <span>Don't have an account?</span>
                    <a href="/register" className="signup-btn">
                      Sign up
                    </a>
                  </div>
                  <div className="signup-option">
                    <span>Register as Admin?</span>
                    <a href="/admin/register" className="admin-signup-btn">
                      Admin Sign up
                    </a>
                  </div>
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
