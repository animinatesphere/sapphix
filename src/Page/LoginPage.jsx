// // import React from "react";
// // import { Link } from "react-router-dom";

// // const LoginPage = () => {
// //   return (
// //     <div>
// //       <Link to="/login">login</Link>
// //       <Link to="/Register">Register</Link>
// //     </div>
// //   );
// // };

// // export default LoginPage;
import React, { useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import "../login/login.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Successful login - redirect to dashboard
      if (data.user) {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-logo">
          <h2>SAPPHIX</h2>
        </div>
        <div className="login-form-container">
          <h1>Sign in</h1>
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
              <a href="/forgot-password" className="forgot-password">
                Forgot Password?
              </a>
            </div>
            <button type="submit" className="login-button">
              Sign in
            </button>
            <div className="signup-link">
              Don't have an account? <a href="/register">Sign up</a>
            </div>
          </form>
        </div>
        <div className="login-illustration">
          <div className="illustration-content">
            <div className="shopping-cart">
              <div className="cart-item cart-item-1"></div>
              <div className="cart-item cart-item-2"></div>
              <div className="cart-item cart-item-3"></div>
            </div>
            <div className="person-illustration"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
