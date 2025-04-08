import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import "../login/login.css";
import "../login/login3.css";
import Navbar from "../navbar-component/Navbars1";
import FooterSection from "../component/FooterSection";

function Register() {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notification, setNotification] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

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

  // Check if passwords match
  useEffect(() => {
    if (confirmPassword === "") {
      setPasswordsMatch(true);
      return;
    }
    setPasswordsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

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

    if (password !== confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    if (!acceptTerms) {
      showNotification("Please accept the Terms & Conditions", "error");
      return;
    }

    setIsLoading(true);

    try {
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
        showNotification(
          "Account created successfully! Please check your email for verification.",
          "success"
        );
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setAcceptTerms(false);
      }
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setIsLoading(false);
    }
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
            <h1>Create Account</h1>
            <p>Join us and start shopping today</p>

            <div className="social-signup">
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
              <span className="separator-text">or sign up with email</span>
            </div>

            <form onSubmit={handleSignup} className="login-form">
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="test@gmail.com"
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
                    tabIndex="-1"
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
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="********"
                    className={
                      confirmPassword && !passwordsMatch ? "input-error" : ""
                    }
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <div className="validation-feedback">
                    Passwords do not match
                  </div>
                )}
              </div>

              <div className="terms-container">
                <label className="terms-label">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={() => setAcceptTerms(!acceptTerms)}
                    required
                  />
                  <span>
                    I agree to the{" "}
                    <a href="/terms" className="terms-link">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="terms-link">
                      Privacy Policy
                    </a>
                  </span>
                </label>
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
                  "Create Account"
                )}
              </button>

              <div className="signup-link">
                Already have an account?{" "}
                <a href="/login" className="login-link">
                  Sign in
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      <FooterSection />
    </>
  );
}

export default Register;
