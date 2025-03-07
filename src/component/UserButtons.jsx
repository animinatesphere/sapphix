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

      <Link to="/Admin-Login">
        <button
          className={`use-bu ${
            location.pathname === "/Admin-Login" ? "active" : ""
          }`}
        >
          Admin
        </button>
      </Link>
    </div>
  );
};

export default UserButtons;
