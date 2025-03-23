import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import { motion, AnimatePresence } from "framer-motion";
import "../login/login.css";
import "../login/loginResponsive.css";
import google from "../assets/Google sign.png";
import UserButtons from "../component/UserButtons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null); // ✅ For success & error messages
  const navigate = useNavigate();

  // ✅ Handle Login
  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    setNotification(null);

    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      setNotification({ type: "error", text: "Login Failed! ❌" });
      return;
    }

    console.log("✅ Login successful!");
    setNotification({ type: "success", text: "Login Successful! ✅" });

    // Fetch user role
    const { user } = data;
    const { data: userData, error: fetchError } = await supabase
      .from("user")
      .select("role")
      .eq("id", user.id)
      .single();

    if (fetchError || !userData) {
      setMessage("User role not found. Contact support.");
      return;
    }

    console.log("User Role:", userData.role);

    // Redirect after delay
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  // ✅ Handle Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setNotification(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      setNotification({ type: "error", text: "Google Login Failed! ❌" });
    }
  };

  // ✅ Handle Random Login
  const handleRandomLogin = async () => {
    setMessage("");
    setLoading(true);
    setNotification(null);

    const randomEmail = `user${Math.floor(Math.random() * 100000)}@example.com`;
    const randomPassword = Math.random().toString(36).slice(-8);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email: randomEmail,
        password: randomPassword,
      }
    );

    setLoading(false);

    if (signUpError) {
      setMessage(signUpError.message);
      setNotification({ type: "error", text: "Random Login Failed! ❌" });
      return;
    }

    console.log("Signed up with:", randomEmail, signUpData);
    setNotification({ type: "success", text: "Random Login Successful! ✅" });

    await supabase.auth.signInWithPassword({
      email: randomEmail,
      password: randomPassword,
    });

    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* ✅ Success & Error Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`notification ${notification.type}`}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {notification.text}
          </motion.div>
        )}
      </AnimatePresence>

      <h2 className="login-head">Welcome to Sapphix</h2>
      <p className="login-head2">Log in with your email and password</p>

      {message && <div className="message-box">{message}</div>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email*"
          required
          className="log-form"
        />
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password*"
          required
          className="log-form"
        />
        <br />
        <motion.button
          type="submit"
          className="log-but"
          whileHover={{ scale: 1.05 }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </motion.button>
      </form>

      <p className="co">By continuing, you agree to Sapphix</p>
      <p className="te">Terms and Conditions</p>

      <motion.button
        onClick={handleGoogleLogin}
        className="google-but"
        whileHover={{ scale: 1.05 }}
        disabled={loading}
      >
        <img src={google} alt="Google Logo" />
        {loading ? "Processing..." : "Log in with Google"}
      </motion.button>

      <motion.button
        onClick={handleRandomLogin}
        className="random-but"
        whileHover={{ scale: 1.05 }}
        disabled={loading}
      >
        {loading ? "Generating..." : "Random Login"}
      </motion.button>

      <UserButtons />
    </motion.div>
  );
};

export default Login;
