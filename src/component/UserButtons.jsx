import { Link, useLocation } from "react-router-dom";
import "../componentcss/userButton.css";
const UserButtons = () => {
  const location = useLocation();

  return (
    <div className="user-butt">
      <Link to="/login">
        <button
          className={`use-bu ${location.pathname === "/login" ? "active" : ""}`}
        >
          Customer
        </button>
      </Link>

      <Link to="/AdminLogin">
        <button
          className={`use-bu ${
            location.pathname === "/AdminLogin" ? "active" : ""
          }`}
        >
          Admin
        </button>
      </Link>
    </div>
  );
};

export default UserButtons;
