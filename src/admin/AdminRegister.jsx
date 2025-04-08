import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import "../login/login.css";
import Navbar from "../navbar-component/Navbars1";
import FooterSection from "../component/FooterSection";

function AdminRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [random3Digit, setRandom3Digit] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(true);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  useEffect(() => {
    const generateRandomNumbers = () => {
      setRandom3Digit(Math.floor(Math.random() * (999 - 100 + 1)) + 100);
    };
    generateRandomNumbers();
  }, []);

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;

    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;

    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;

    // Contains number
    if (/[0-9]/.test(password)) strength += 1;

    // Contains special char
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  }, [password]);

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

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      showNotification("Please enter a valid email address", "error");
      return;
    }

    if (passwordStrength < 3) {
      showNotification("Please choose a stronger password", "error");
      return;
    }

    setIsLoading(true);

    try {
      // First verify the admin code (you should store this securely)
      const ADMIN_SECRET_CODE = `YourSecretAdminCode${random3Digit}`; // Replace with your actual code

      if (adminCode !== ADMIN_SECRET_CODE) {
        showNotification("Invalid admin registration code", "error");
        setIsLoading(false);
        return;
      }

      // Register the user with Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        showNotification(error.message, "error");
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Add the user to the admins table
        const { error: adminError } = await supabase.from("admins").insert([
          {
            user_id: data.user.id,
            email: email,
            created_at: new Date(),
          },
        ]);

        if (adminError) {
          showNotification(
            "Error registering admin: " + adminError.message,
            "error"
          );
          setIsLoading(false);
          return;
        }

        showNotification("Admin account created successfully!", "success");
        setEmail("");
        setPassword("");
        setAdminCode("");
      }
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Get color for password strength indicator
  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "#ff4d4d"; // weak - red
    if (passwordStrength <= 3) return "#ffaa00"; // medium - amber
    return "#00cc44"; // strong - green
  };

  // Get text for password strength
  const getPasswordStrengthText = () => {
    if (!password) return "";
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  return (
    <>
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
            <div className="illustration-content2"></div>
          </div>
          <div className="login-form-container form-fade-in">
            <h1>Admin Registration</h1>
            <p>Register as an administrator</p>
            <form onSubmit={handleSignup} className="login-form">
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="admin@example.com"
                  className={email && !emailValid ? "input-error" : ""}
                  required
                />
                {email && !emailValid && (
                  <div className="validation-feedback">
                    Please enter a valid email address
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-container">
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
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {password && (
                  <div className="password-strength-container">
                    <div
                      className="password-strength-bar"
                      style={{
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: getPasswordStrengthColor(),
                      }}
                    ></div>
                    <span
                      className="password-strength-text"
                      style={{ color: getPasswordStrengthColor() }}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                )}
                {password && (
                  <div className="password-requirements">
                    Password should include: uppercase, lowercase, numbers, and
                    special characters
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="adminCode">Admin Registration Code</label>
                <div className="admin-code-info">
                  <div className="code-hint">
                    This code has been shared with authorized personnel only
                  </div>
                  <div className="code-format">
                    Format: YourSecretAdminCode + {random3Digit}
                  </div>
                </div>
                <input
                  type="password"
                  id="adminCode"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter admin code"
                  required
                />
              </div>
              <button
                type="submit"
                className={`login-button ${isLoading ? "button-loading" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner">
                    <span className="spinner-dot"></span>
                    <span className="spinner-dot"></span>
                    <span className="spinner-dot"></span>
                  </span>
                ) : (
                  "Register as Admin"
                )}
              </button>
              <div className="signup-link">
                Already have an account? <a href="/login">Sign in</a>
              </div>
            </form>
          </div>
        </div>
      </div>
      <FooterSection />
    </>
  );
}

export default AdminRegister;
