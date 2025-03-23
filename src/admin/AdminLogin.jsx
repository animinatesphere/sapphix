import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import { motion, AnimatePresence } from "framer-motion";
import google from "../assets/Google sign.png";
import UserButtons from "../component/UserButtons";
import "../admin/adminlogin.css";

const ADMIN_PASSWORD = "admin123"; // Fixed admin password

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleDirectAdminLogin = async () => {
    setLoading(true);

    setTimeout(() => {
      if (adminPassword === ADMIN_PASSWORD) {
        // Set localStorage values
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("adminEmail", "admin@sapphix.com");

        // Also set a timestamp to help with auth persistence
        localStorage.setItem("adminLoginTime", Date.now().toString());

        setNotification({
          type: "success",
          text: "Admin Login Successful! ✅",
        });

        setTimeout(() => {
          navigate("/admindashboard");
        }, 500);
      } else {
        setNotification({
          type: "error",
          text: "Incorrect Admin Password! ❌",
        });
      }
      setLoading(false);
    }, 1500);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setNotification({ type: "error", text: `❌ ${error.message}` });
      setLoading(false);
      return;
    }

    setNotification({ type: "success", text: "Login Successful! ✅" });
    setTimeout(() => navigate("/admindashboard"), 1500);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setNotification({ type: "error", text: `❌ ${error.message}` });
    }
    setLoading(false);
  };

  return (
    <motion.div className="admin-container">
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`notification ${notification.type}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {notification.text}
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <motion.div
          className="loading-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="loading-content">Logging in...</div>
        </motion.div>
      )}

      <div className="admin-card">
        <h2 className="admin-title">Welcome to Sapphix</h2>
        <p className="admin-subtitle">Admin Login</p>

        <div className="admin-input-group">
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="Enter Admin Password"
            className="admin-input"
          />
          <button
            onClick={handleDirectAdminLogin}
            className="admin-button admin-button-blue"
          >
            Direct Admin Login 🚀
          </button>
        </div>

        <p className="admin-text">Or log in with email</p>

        <form onSubmit={handleLogin} className="admin-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email*"
            required
            className="admin-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password*"
            required
            className="admin-input"
          />
          <button type="submit" className="admin-button admin-button-green">
            Log In with Supabase
          </button>
        </form>

        <p className="admin-text">
          By continuing, you agree to Sapphix <br />
          <span className="admin-link">Terms and Conditions</span>
        </p>

        <button
          onClick={handleGoogleLogin}
          className="admin-button admin-google-button"
        >
          <img src={google} alt="Google Logo" className="admin-google-icon" />{" "}
          Log in with Google
        </button>

        <UserButtons />
      </div>
    </motion.div>
  );
};

export default AdminLogin;
