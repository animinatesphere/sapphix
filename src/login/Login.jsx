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
  const navigate = useNavigate();

  // Normal Login (or Register if user doesn't exist)
  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");

    // Try logging in
    let { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("Login Error:", error.message);

      if (error.message === "Invalid login credentials") {
        // Try signing up the user
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          setMessage(signUpError.message);
          return;
        }

        console.log("User registered successfully!");

        // 🔥 Instant login after sign-up
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

        navigate("/dashboard"); // Redirect to Dashboard
      } else {
        setMessage(error.message);
      }
    } else {
      navigate("/dashboard"); // Redirect after successful login
    }
  };

  // Random Login: Auto-generate user and log in instantly
  const handleRandomLogin = async () => {
    setMessage("");

    // Generate random email and password
    const randomEmail = `user${Math.floor(Math.random() * 100000)}@example.com`;
    const randomPassword = Math.random().toString(36).slice(-8);

    // Sign up the user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: randomEmail,
      password: randomPassword,
    });

    if (signUpError) {
      console.error("Signup Error:", signUpError.message);
      setMessage(signUpError.message);
      return;
    }

    console.log("Signed up with:", randomEmail, randomPassword);

    // 🔥 Instant login after sign-up
    await supabase.auth.signInWithPassword({
      email: randomEmail,
      password: randomPassword,
    });

    navigate("/dashboard"); // Redirect to Dashboard
  };

  // Google Login
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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
        <button type="submit" className="log-but">
          Log In
        </button>
      </form>

      <p className="co">By continuing, you agree to Sapphix</p>
      <p className="te">Terms and Conditions</p>

      <button onClick={handleGoogleLogin} className="google-but">
        <img src={google} alt="Google Logo" />
        Log in with Google
      </button>

      <button onClick={handleRandomLogin} className="log-but">
        Random Login
      </button>

      <UserButtons />
    </div>
  );
};

export default Login;
