import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/date-time-setting.svg";

export default function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="nav-left" onClick={() => navigate("/dashboard")}>
        <img src={logo} alt="logo" className="logo" />
        <span className="brand-text">TradeOff</span>
      </div>

      <div className="nav-right">
        <div className="user-menu">
          <div className="user-icon" onClick={() => setShowMenu(!showMenu)}>
            👤
          </div>

          {showMenu && (
            <div className="dropdown">
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
