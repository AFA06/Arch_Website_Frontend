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
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear errors when user starts typing
    setErrors({ email: "", password: "", general: "" });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "", general: "" });
    
    // Client-side validation
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      setErrors({ ...errors, email: "Please enter a valid email address" });
      return;
    }
    
    if (!form.password) {
      setErrors({ ...errors, password: "Password is required" });
      return;
    }
    
    try {
      setIsLoading(true);
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
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;
      
      // Handle specific error cases
      if (status === 404 || message.toLowerCase().includes("not found") || message.toLowerCase().includes("user does not exist")) {
        setErrors({ ...errors, general: "account-not-found" });
        toast.error("Account not found. Please sign up first.");
      } else if (status === 401 || message.toLowerCase().includes("password") || message.toLowerCase().includes("incorrect")) {
        setErrors({ ...errors, password: "Incorrect password" });
        toast.error("Incorrect password. Please try again.");
      } else if (status === 400) {
        setErrors({ ...errors, general: "validation-error" });
        toast.error(message || "Please check your input and try again.");
      } else {
        setErrors({ ...errors, general: "server-error" });
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
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
          {/* General error message */}
          {errors.general === "account-not-found" && (
            <div className="error-alert" role="alert" aria-live="polite">
              <p>Account not found. Please <button type="button" onClick={() => navigate("/signup")} className="error-link">sign up</button> first.</p>
            </div>
          )}
          {errors.general === "server-error" && (
            <div className="error-alert" role="alert" aria-live="polite">
              <p>Something went wrong. Please try again later.</p>
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <span id="email-error" className="error-message" role="alert">{errors.email}</span>
            )}
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
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span id="password-error" className="error-message" role="alert">
                {errors.password}. <button type="button" onClick={() => navigate("/forgot-password")} className="error-link">Reset password</button>
              </span>
            )}
          </div>

          <div className="forgot-password">
            <button type="button" onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log In"}
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
