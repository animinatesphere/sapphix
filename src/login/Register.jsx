// import { useState } from "react";
// import { supabase } from "../../supabase";
// import { Link } from "react-router-dom";
// const Register = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const hamdleSubmit = async (event) => {
//     event.preventDefault();
//     setMessage("");
//     const { data, error } = await supabase.auth.signUp({
//       email: email,
//       password: password,
//     });
//     if (error) {
//       setMessage(error.message);
//       return;
//     }
//     if (data) {
//       setMessage("User account created!");
//     }
//     setEmail("");
//     setPassword("");
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <br />
//       {message && <span>{message}</span>}
//       <form onSubmit={hamdleSubmit}>
//         <input
//           onChange={(e) => setEmail(e.target.value)}
//           value={email}
//           type="email"
//           placeholder="Email"
//           required
//         />
//         <input
//           onChange={(e) => setPassword(e.target.value)}
//           value={password}
//           type="password"
//           placeholder="Password"
//           required
//         />
//         <button type="submit">create Account</button>
//       </form>
//       <p>
//         Already have account? <Link to="/login">Login</Link>
//       </p>
//     </div>
//   );
// };

// export default Register;
import React, { useState } from "react";
import { supabase } from "../../supabase";
import "../login/login.css";
// import { useNavigate } from "react-router-dom";
function Register() {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        showNotification(error.message, "error");
        return;
      }

      if (data.user) {
        showNotification("Account created successfully!", "success");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      showNotification(error.message, "error");
    }
  };
  return (
    <div className="login-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button
            className="notification-close"
            onClick={() => setNotification(null)}
          >
            &times;
          </button>
        </div>
      )}
      <div className="login-wrapper">
        <div className="login-logo">
          <h2>Logo Here</h2>
        </div>
        <div className="login-form-container">
          <h1>Sign up</h1>
          <form onSubmit={handleSignup} className="login-form">
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
              Sign up
            </button>
            <div className="signup-link">
              Already have an account? <a href="/">Sign in</a>
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
export default Register;
