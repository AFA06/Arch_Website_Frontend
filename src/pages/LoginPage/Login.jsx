import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      const data = res.data;

      if (!data.token) {
        throw new Error("Login failed: token missing");
      }

      // ✅ Save token + user in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Update AuthContext and sync cart
      await login(data.user, data.token);

      toast.success("Login successful!");

      // ✅ Redirect user to previous page (cart) or home
      const returnPath = localStorage.getItem("returnAfterLogin");
      if (returnPath) {
        localStorage.removeItem("returnAfterLogin");
        navigate(returnPath);
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* HEADER */}
        <div className="login-header">
          <img src="/logo192.png" alt="Logo" className="login-logo" />
          <h2>Welcome Back</h2>
          <p>Log in to access your account</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="forgot-password">
            <button type="button" onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="login-button">
            Log In
          </button>
        </form>

        {/* FOOTER */}
        <div className="login-footer">
          <p>
            Don’t have an account?{" "}
            <button type="button" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
