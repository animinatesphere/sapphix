import { useState } from "react";
import { supabase } from "../../supabase";
// import { Link, useNavigate } from "react-router-dom";
import "../login/login.css";
import "../login/loginResponsive.css";
import google from "../assets/Google sign.png";
import UserButtons from "../component/UserButtons";

const Login = () => {
  // const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  // Function to check if input is email or phone
  const isEmail = (input) => /\S+@\S+\.\S+/.test(input);
  const isPhone = (input) => /^\+?[1-9]\d{9,14}$/.test(input); // E.164 format

  // Handle Email/Phone Login
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (isEmail(input)) {
      // Email Login (Magic Link)
      const { error } = await supabase.auth.signInWithOtp({
        email: input,
        options: { shouldCreateUser: true }, // Creates a new user if not exists
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Link sent to your email.");
      }
    } else if (isPhone(input)) {
      // Phone Login (OTP)
      const { error } = await supabase.auth.signInWithOtp({
        phone: input,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("OTP sent to your phone.");
      }
    } else {
      setMessage("Invalid email or phone number format.");
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard", // Dynamically set URL
      },
    });

    if (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-head">Welcome to Sapphix</h2>
      <p className="login-head2">
        Type your e-mail or phone number to log in or create a Sapphix account.
      </p>
      <br />
      {message && (
        <span
          style={{
            position: "absolute",
            top: "1%",
            right: "1%",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "8px 12px",
            borderRadius: "8px",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          <button
            style={{
              background: "transparent",
              border: "none",
              color: "inherit",
              fontSize: "inherit",
              cursor: "pointer",
            }}
          >
            {message}
          </button>
        </span>
      )}

      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          placeholder="Email or Mobile Number*"
          required
          className="log-form"
        />
        <br />
        <button type="submit" className="log-but">
          Continue
        </button>
      </form>
      <p className="co">By continuing, you agree to Sapphix</p>
      <p className="te">Terms and Conditions </p>
      <button onClick={handleGoogleLogin} className="google-but">
        <img src={google} alt="" />
        Log in with Google
      </button>
      <UserButtons />
    </div>
  );
};

export default Login;
