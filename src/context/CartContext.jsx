// src/context/CartContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const localCart = localStorage.getItem("cart");
    if (localCart) setCartItems(JSON.parse(localCart));
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = useCallback((course) => {
    const id = course.id || course._id;
    if (!id) return;
    setCartItems(prev => {
      if (prev.some(item => item.id === id)) return prev;
      return [...prev, { ...course, id, addedAt: new Date().toISOString() }];
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((courseId) => {
    setCartItems(prev => prev.filter(item => item.id !== courseId));
  }, []);

  // Clear the cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem("cart");
  }, []);

  // Total price
  const getCartTotal = useCallback(() =>
    cartItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0),
    [cartItems]
  );

  // Total items count
  const getCartItemsCount = useCallback(() => cartItems.length, [cartItems]);

  // Check if item is in cart
  const isInCart = useCallback((courseId) =>
    cartItems.some(item => item.id === courseId),
    [cartItems]
  );

  // Get related courses (pure frontend)
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
      setCartItems,
      addToCart,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartItemsCount,
      isInCart,
      getRelatedCourses, // ✅ now available
    }}>
      {children}
    </CartContext.Provider>
  );
};
