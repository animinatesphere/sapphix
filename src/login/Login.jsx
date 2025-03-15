import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import "../login/login.css";
import "../login/loginResponsive.css";
import google from "../assets/Google sign.png";
import UserButtons from "../component/UserButtons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Used to redirect users

  // Handle Email & Password Login
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      navigate("/dashboard"); // Redirect to Dashboard after login
    }
  };

  // Handle Random Login
  const handleRandomLogin = async () => {
    setMessage("");

    // Generate a random email and password
    const randomEmail = `user${Math.floor(Math.random() * 100000)}@example.com`;
    const randomPassword = Math.random().toString(36).slice(-8); // Random 8-character password

    // Sign up the user
    const { error } = await supabase.auth.signUp({
      email: randomEmail,
      password: randomPassword,
    });

    if (error) {
      console.error("Signup Error:", error.message);
      setMessage(error.message);
      return;
    }

    console.log("Signed up with:", randomEmail, randomPassword);

    // Automatically sign in the user
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: randomEmail,
      password: randomPassword,
    });

    if (loginError) {
      console.error("Login Error:", loginError.message);
      setMessage(loginError.message);
      return;
    }

    // Store credentials to keep the user logged in
    localStorage.setItem(
      "randomUser",
      JSON.stringify({ email: randomEmail, password: randomPassword })
    );

    navigate("/dashboard"); // Redirect to dashboard
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`, // Redirect after Google login
      },
    });

    if (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-head">Welcome to Sapphix</h2>
      <p className="login-head2">Log in with your email and password</p>

      {message && (
        <div className="message-box">
          <span>{message}</span>
        </div>
      )}

      {/* Normal Login Form */}
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="log-but">
          Log In
        </button>
      </form>

      <p className="co">By continuing, you agree to Sapphix</p>
      <p className="te">Terms and Conditions</p>

      {/* Google Login Button */}
      <button onClick={handleGoogleLogin} className="google-but">
        <img src={google} alt="Google Logo" />
        Log in with Google
      </button>

      {/* Random Login Button */}
      <button onClick={handleRandomLogin} className="log-but">
        Random Login
      </button>

      <UserButtons />
    </div>
  );
};

export default Login;
