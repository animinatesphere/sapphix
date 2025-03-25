import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import google from "../assets/Google sign.png";
import UserButtons from "../component/UserButtons";
import "../admin/adminlogin.css";
import { useAuth } from "../Auttts/AuthContext";

const ADMIN_EMAIL = "admin@sapphix.com";
const ADMIN_PASSWORD = "admin123"; // Fixed admin password

const AdminLogin = () => {
  const [adminPassword, setAdminPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Use AuthContext for setting the logged-in user
  const { setUser } = useAuth();

  // ✅ Direct Admin Login (No Supabase)
  const handleDirectAdminLogin = () => {
    setLoading(true);
    setTimeout(() => {
      if (adminPassword === ADMIN_PASSWORD) {
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("adminEmail", ADMIN_EMAIL);

        setUser({
          email: ADMIN_EMAIL,
          role: "admin",
          isAdmin: true,
        });

        setNotification({
          type: "success",
          text: "Admin Login Successful! ✅",
        });
        setTimeout(() => navigate("/admindashboard"), 500);
      } else {
        setNotification({
          type: "error",
          text: "❌ Incorrect Admin Password!",
        });
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <motion.div className="admin-container">
      {/* ✅ Notification Popups */}
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

      {/* ✅ Loading Animation */}
      {loading && (
        <motion.div
          className="loading-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="loading-content">Logging in...</div>
        </motion.div>
      )}

      {/* ✅ Admin Login Card */}
      <div className="admin-card">
        <h2 className="admin-title">Welcome to Sapphix</h2>
        <p className="admin-subtitle">Admin Login</p>

        {/* ✅ Direct Admin Login */}
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

        <UserButtons />
      </div>
    </motion.div>
  );
};

export default AdminLogin;
