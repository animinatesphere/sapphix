import { useState } from "react";
import { supabase } from "../../supabase";
import "../login/login.css";
import "../login/loginResponsive.css";
import google from "../assets/Google sign.png";
import UserButtons from "../component/UserButtons";

const Login = () => {
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
        options: { shouldCreateUser: true },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("A login link has been sent to your email.");
      }
    } else if (isPhone(input)) {
      // Phone Login (OTP)
      const { error } = await supabase.auth.signInWithOtp({
        phone: input,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("OTP has been sent to your phone.");
      }
    } else {
      setMessage("Please enter a valid email or phone number.");
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setMessage(""); // Clear previous messages

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`, // Use correct redirect URL
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

      {message && (
        <div className="message-box">
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
      <p className="te">Terms and Conditions</p>

      <button onClick={handleGoogleLogin} className="google-but">
        <img src={google} alt="Google Logo" />
        Log in with Google
      </button>

      <UserButtons />
    </div>
  );
};

export default Login;
