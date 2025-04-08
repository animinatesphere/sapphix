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
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // First verify the admin code (you should store this securely)
      const ADMIN_SECRET_CODE = `YourSecretAdminCode${random3Digit}`; // Replace with your actual code

      if (adminCode !== ADMIN_SECRET_CODE) {
        showNotification("Invalid admin registration code", "error");
        return;
      }

      // Register the user with Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        showNotification(error.message, "error");
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
          return;
        }

        showNotification("Admin account created successfully!", "success");
        setEmail("");
        setPassword("");
        setAdminCode("");
      }
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  return (
    <>
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
        <div className="login-wrapper">
          <div className="login-illustration">
            <div className="illustration-content2"></div>
          </div>
          <div className="login-form-container">
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
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
              <div className="form-group">
                <label htmlFor="adminCode">
                  Admin Registration Code(YourSecretAdminCode{random3Digit})
                </label>
                <input
                  type="password"
                  id="adminCode"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter admin code"
                  required
                />
              </div>
              <button type="submit" className="login-button">
                Register as Admin
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
