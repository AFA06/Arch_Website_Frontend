// src/context/CartContext.jsx
import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user, token, refreshUser } = useContext(AuthContext);

  // Load cart from localStorage on mount
  useEffect(() => {
    const localCart = localStorage.getItem("cart");
    if (localCart) setCartItems(JSON.parse(localCart));
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Filter out courses that user already owns
  const getFilteredCart = useCallback((items) => {
    if (!user?.purchasedCourses) return items;

    return items.filter(item => {
      // Check if user owns this course (support both ID and slug)
      const courseId = item.id || item._id;
      const courseSlug = item.slug;

      return !user.purchasedCourses.some(ownedCourse => {
        const ownedId = typeof ownedCourse === 'string' ? ownedCourse : ownedCourse._id?.toString();
        const ownedSlug = ownedCourse.slug;

        return ownedId === courseId ||
               (courseSlug && ownedSlug === courseSlug);
      });
    });
  }, [user]);

  // Get filtered cart items (remove owned courses)
  const filteredCartItems = getFilteredCart(cartItems);

  // Clean cart when user data changes (remove owned courses)
  useEffect(() => {
    if (user && cartItems.length > 0) {
      const filtered = getFilteredCart(cartItems);
      if (filtered.length !== cartItems.length) {
        setCartItems(filtered);
      }
    }
  }, [user, cartItems, getFilteredCart]);

  // Refresh user data periodically to sync with admin assignments
  useEffect(() => {
    if (!user || !token) return;

    const refreshInterval = setInterval(() => {
      refreshUser();
    }, 60000); // Refresh every minute

    return () => clearInterval(refreshInterval);
  }, [user, token, refreshUser]);

  // Add item to cart (only if user doesn't already own it)
  const addToCart = useCallback((course) => {
    const id = course.id || course._id;
    if (!id) return;

    // Check if user already owns this course
    if (user?.purchasedCourses) {
      const courseId = course.id || course._id;
      const courseSlug = course.slug;

      const alreadyOwned = user.purchasedCourses.some(ownedCourse => {
        const ownedId = typeof ownedCourse === 'string' ? ownedCourse : ownedCourse._id?.toString();
        const ownedSlug = ownedCourse.slug;

        return ownedId === courseId ||
               (courseSlug && ownedSlug === courseSlug);
      });

      if (alreadyOwned) {
        console.warn('User already owns this course, not adding to cart');
        return;
      }
    }

    setCartItems(prev => {
      if (prev.some(item => item.id === id)) return prev;
      return [...prev, { ...course, id, addedAt: new Date().toISOString() }];
    });
  }, [user]);

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
    filteredCartItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0),
    [filteredCartItems]
  );

  // Total items count
  const getCartItemsCount = useCallback(() => filteredCartItems.length, [filteredCartItems]);

  // Check if item is in cart
  const isInCart = useCallback((courseId) =>
    filteredCartItems.some(item => item.id === courseId),
    [filteredCartItems]
  );

  // Get related courses (pure frontend)
  const getRelatedCourses = useCallback((currentCourse, allCourses, limit = 4) => {
    const cartIds = filteredCartItems.map(item => item.id);
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
  }, [filteredCartItems]);

  return (
    <CartContext.Provider value={{
      cartItems: filteredCartItems, // Return filtered cart items
      rawCartItems: cartItems, // Keep raw items for internal use
      setCartItems,
      addToCart,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartItemsCount,
      isInCart,
      getRelatedCourses,
      refreshUser, // Allow components to refresh user data
    }}>
      {children}
    </CartContext.Provider>
  );
};
