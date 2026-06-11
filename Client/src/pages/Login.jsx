import { useState } from "react";
import { loginUser } from "../api/auth";
import { FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./css/Login.css";
import logo from "../assets/date-time-setting.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            Welcome Back
          </h1>
          <img src={logo} alt="logo" className="auth-logo" />
        </div>
        <p className="auth-subtext">Login to continue your journey</p>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button className="check-btn" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <>
              <FiLoader className="spinner" /> Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="auth-switch">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign up</span>
        </p>
      </div>
    </div>
  );
}
