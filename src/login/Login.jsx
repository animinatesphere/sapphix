import { useState } from "react";
import { supabase } from "../../supabase";
import { Link, useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const hamdleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
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
      setMessage("User account created!");
      navigate("/dashboard");
      return null;
    }
  };
  return (
    <>
      <div>
        <h2>Login</h2>
        <br />
        {message && <span>{message}</span>}
        <form onSubmit={hamdleSubmit}>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Email"
            required
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            required
          />
          <button type="submit">Login in</button>
        </form>
        <p>
          Dont have account? <Link to="/Register">Register</Link>
        </p>
      </div>
    </>
  );
};

export default Login;
