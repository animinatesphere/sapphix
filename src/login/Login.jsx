import { useState } from "react";
import { supabase } from "../../supabase";
import { Link, useNavigate } from "react-router-dom";
import FooterSection from "../component/FooterSection";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setLoading(true); // Set loading to true when login starts

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setMessage(error.message);
        setEmail("");
        setPassword("");
        return;
      }

      if (data) {
        setMessage("User logged in successfully!");
        navigate("/dashboard");
        return null;
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // Set loading to false when login process completes
    }
  };

  return (
    <>
      <div className="login-container">
        <h2>Login</h2>
        <br />
        {message && <span className="message">{message}</span>}
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email"
            required
            disabled={loading}
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={loading ? "button-loading" : ""}
          >
            <span className="button-text">
              {loading ? "Please wait..." : "Login"}
            </span>
            {loading && <span className="button-loader"></span>}
          </button>
        </form>
        <p>
          Don't have account? <Link to="/Register">Register</Link>
        </p>
      </div>

      {/* Professional Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-container">
            <div className="loading-spinner-container">
              <div className="loading-spinner"></div>
            </div>
            <div className="loading-text">Verifying your credentials...</div>
          </div>
        </div>
      )}
      <FooterSection/>
    </>
  );
};

export default Login;
