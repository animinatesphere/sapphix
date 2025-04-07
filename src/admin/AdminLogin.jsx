import React, { useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import "../login/login.css";
import UserButtons from "../component/UserButtons";
import eagle from "../assets/Sapphix logo editable 1.png";
import Navbar from "../navbar-component/Navbars1";
import FooterSection from "../component/FooterSection";

function AdminLogin() {
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
        navigate("/admindashboard");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div className="login-parent">
        <Navbar />
        <div className="login-container">
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
                </div>
              </form>
            </div>
          </div>
        </div>
        <UserButtons />
      </div>

      <FooterSection />
    </>
  );
}

export default AdminLogin;
