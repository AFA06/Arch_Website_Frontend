// src/context/CartContext.jsx
import { createContext, useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  // Load cart from backend/localStorage
  useEffect(() => {
    const loadCart = async () => {
      const localCart = localStorage.getItem("cart");
      if (user && token) {
        try {
          // Fetch backend cart
          const res = await axios.get("/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
          });
          let backendCart = res.data || [];

          // Merge localStorage cart with backend cart
          if (localCart) {
            const parsed = JSON.parse(localCart);
            if (Array.isArray(parsed)) {
              const merged = [...backendCart];
              parsed.forEach(item => {
                if (!merged.some(i => i.id === item.id)) merged.push(item);
              });
              backendCart = merged;
            }
          }

          setCartItems(backendCart);
        } catch (err) {
          console.error("❌ Failed to load backend cart:", err);
          if (localCart) setCartItems(JSON.parse(localCart));
        }
      } else if (localCart) {
        setCartItems(JSON.parse(localCart));
      }
    };

    if (token !== null) loadCart(); // Wait for token to load
  }, [user, token]);

  // Save cart to localStorage + backend
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));

    if (user && token) {
      axios.post("/api/cart", { items: cartItems }, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(err => console.error("❌ Failed to save cart to backend:", err));
    }
  }, [cartItems, user, token]);

  // Add course to cart
  const addToCart = useCallback((course) => {
    const id = course.id || course._id;
    if (!id) return;

    setCartItems(prev => {
      if (prev.some(item => item.id === id)) return prev;
      return [...prev, { ...course, id, addedAt: new Date().toISOString() }];
    });
  }, []);

  // Remove course from cart
  const removeFromCart = useCallback((courseId) => {
    setCartItems(prev => prev.filter(item => item.id !== courseId));
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem("cart");
    if (user && token) {
      axios.delete("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(err => console.error("❌ Failed to clear backend cart:", err));
    }
  }, [user, token]);

  // Helpers
  const getCartTotal = useCallback(() => cartItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0), [cartItems]);
  const getCartItemsCount = useCallback(() => cartItems.length, [cartItems]);
  const isInCart = useCallback((courseId) => cartItems.some(item => item.id === courseId), [cartItems]);

  // Get related courses
  const getRelatedCourses = useCallback((currentCourse, allCourses, limit = 4) => {
    const cartIds = cartItems.map(item => item.id);
    const sameCategory = allCourses
      .filter(c =>
        (c.id || c._id) !== (currentCourse.id || currentCourse._id) &&
        !cartIds.includes(c.id || c._id) &&
        c.category === currentCourse.category
      )
      .slice(0, limit);

    if (sameCategory.length >= limit) return sameCategory;

    const fill = allCourses
      .filter(c =>
        (c.id || c._id) !== (currentCourse.id || currentCourse._id) &&
        !cartIds.includes(c.id || c._id) &&
        !sameCategory.some(r => r.id === c.id || r._id === c._id)
      )
      .slice(0, limit - sameCategory.length);

    return [...sameCategory, ...fill];
  }, [cartItems]);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartItemsCount,
      isInCart,
      getRelatedCourses,
    }}>
      {children}
    </CartContext.Provider>
  );
};
