// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { CartContext } from "./CartContext";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const { cartItems, setCartItems } = useContext(CartContext) || {};

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const savedToken = localStorage.getItem("token");
    if (savedUser) setUser(savedUser);
    if (savedToken) setToken(savedToken);
  }, []);

  // Login function
  const login = async (userData, authToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
    setUser(userData);
    setToken(authToken);

    // Merge localStorage cart into backend after login
    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (localCart.length > 0) {
      try {
        const res = await axios.post("/api/cart", { items: localCart }, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (setCartItems) setCartItems(res.data); // update CartContext
      } catch (err) {
        console.error("❌ Failed to sync cart after login:", err);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    if (setCartItems) setCartItems([]); // clear cart on logout
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
