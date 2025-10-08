import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "../../assets/logo.jpg";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const validatePassword = (password) => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password),
  });

  const passwordValidations = validatePassword(form.password);
  const allValid = Object.values(passwordValidations).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Signup failed. Try again.");
        return;
      }
      navigate("/login");
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <img src={logo} alt="Logo" className="signup-logo" />
          <h2>NEX ARCHITECTS</h2>
          <p>Create your account</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your first name"
            />
          </div>

          <div className="form-group">
            <label>Surname</label>
            <input
              type="text"
              name="surname"
              value={form.surname}
              onChange={handleChange}
              required
              placeholder="Your last name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
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
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                required
                placeholder="••••••••"
              />
              <button type="button" onClick={togglePassword} className="password-toggle">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordFocused && (
              <div className="password-rules">
                <p className={passwordValidations.length ? "valid" : "invalid"}>
                  • At least 8 characters
                </p>
                <p className={passwordValidations.uppercase ? "valid" : "invalid"}>
                  • One uppercase letter
                </p>
                <p className={passwordValidations.lowercase ? "valid" : "invalid"}>
                  • One lowercase letter
                </p>
                <p className={passwordValidations.number ? "valid" : "invalid"}>
                  • One number
                </p>
                <p className={passwordValidations.special ? "valid" : "invalid"}>
                  • One special symbol (!@#$%^&*)
                </p>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
              <button type="button" onClick={toggleConfirmPassword} className="password-toggle">
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" disabled={!allValid} className="signup-btn">
            Sign Up
          </button>
        </form>

        <p className="signup-footer">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")}>Sign In</button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
