import React, { useContext, useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { CartContext } from "../../../context/CartContext";
import { ArrowLeft, ShoppingCart, Trash2, ExternalLink } from "lucide-react";
import "./ShoppingCart.css";

const ShoppingCartPage = () => {
  const { user } = useContext(AuthContext);
  const { 
    cartItems, 
    addToCart,
    removeFromCart, 
    clearCart, 
    getCartTotal, 
    getCartItemsCount,
    getRelatedCourses,
    refreshCartFromStorage
  } = useContext(CartContext);
  
  const navigate = useNavigate();
  const [relatedCourses, setRelatedCourses] = useState([]);

  // ✅ useMemo prevents recreating the array on each render
  const allCourses = useMemo(() => [
    {
      id: "c_ai_arch_101",
      title: "AI Architecture Fundamentals: From Concept to Implementation",
      subtitle: "Master AI system design, neural networks, and deployment strategies for modern applications.",
      image: "https://picsum.photos/seed/ai_arch_101/900/600",
      price: 250000,
      priceCurrency: "UZS",
      rating: 4.8,
      ratingCount: 1840,
      students: 12450,
      instructor: "Dr. Sarah Kim",
      category: "AI",
    },
    {
      id: "c_figma_master",
      title: "Figma Masterclass: Professional UI/UX Design Workflow",
      subtitle: "Complete guide to Figma: from wireframes to interactive prototypes and design systems.",
      image: "https://picsum.photos/seed/figma_master/900/600",
      price: 180000,
      priceCurrency: "UZS",
      rating: 4.7,
      ratingCount: 3240,
      students: 18750,
      instructor: "Alex Rodriguez",
      category: "Design",
    },
    {
      id: "c_arch_design",
      title: "Modern Architecture Design Principles",
      subtitle: "Learn contemporary architectural concepts, sustainable design, and digital modeling techniques.",
      image: "https://picsum.photos/seed/arch_design/900/600",
      price: 320000,
      priceCurrency: "UZS",
      rating: 4.9,
      ratingCount: 2890,
      students: 15680,
      instructor: "Prof. Elena Volkov",
      category: "Architecture",
    },
    {
      id: "c_3d_modeling",
      title: "Advanced 3D Modeling & Visualization",
      subtitle: "Master 3D modeling, rendering, and visualization techniques for architectural projects.",
      image: "https://picsum.photos/seed/3d_modeling/900/600",
      price: 290000,
      priceCurrency: "UZS",
      rating: 4.6,
      ratingCount: 2150,
      students: 9870,
      instructor: "Michael Chen",
      category: "3D Modeling",
    },
    {
      id: "c_web_dev_react",
      title: "Complete Web Development with React & Node.js",
      subtitle: "Build full-stack web applications using React, Node.js, and modern development practices.",
      image: "https://picsum.photos/seed/web_dev_react/900/600",
      price: 220000,
      priceCurrency: "UZS",
      rating: 4.5,
      ratingCount: 4560,
      students: 23400,
      instructor: "David Johnson",
      category: "Programming",
    },
  ], []);

  // Refresh cart from localStorage when component mounts
  useEffect(() => {
    refreshCartFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get related courses when cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      const related = getRelatedCourses(cartItems[0], allCourses, 5);
      setRelatedCourses(related);
    }
  }, [cartItems, getRelatedCourses, allCourses]);

  const handleProceedToCheckout = () => {
    if (!user) {
      localStorage.setItem("returnAfterLogin", "/cart");
      navigate("/login");
      return;
    }

    const courseNames = cartItems.map(course => course.title).join(", ");
    const totalPrice = getCartTotal();
    const currency = cartItems[0]?.priceCurrency || "UZS";
    
    const message = `Hi! I'd like to purchase the following courses:\n\n${courseNames}\n\nTotal: ${totalPrice.toLocaleString()} ${currency}\n\nPlease provide payment details.`;
    const telegramUrl = `https://t.me/abdukarimov_arch?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, "_blank");
  };

  const handleRemoveItem = (courseId) => {
    removeFromCart(courseId);
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to remove all items from your cart?")) {
      clearCart();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="shopping-cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
              Back
            </button>
            <h1 className="cart-title">
              <ShoppingCart size={32} />
              Shopping Cart
            </h1>
          </div>

          <div className="empty-cart">
            <ShoppingCart size={64} />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any courses to your cart yet.</p>
            <Link to="/courses" className="btn btn-primary">
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shopping-cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="cart-title">
            <ShoppingCart size={32} />
            Shopping Cart ({getCartItemsCount()})
          </h1>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            <div className="items-header">
              <h2>Your Courses</h2>
              <button className="clear-cart-btn" onClick={handleClearCart}>
                <Trash2 size={16} />
                Clear Cart
              </button>
            </div>

            <div className="items-list">
              {cartItems.map((course) => (
                <div key={course.id} className="cart-item">
                  <div className="item-image">
                    <img src={course.image} alt={course.title} />
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-title">{course.title}</h3>
                    <p className="item-subtitle">{course.subtitle}</p>
                    <div className="item-meta">
                      <span className="instructor">By {course.instructor}</span>
                      <div className="rating">
                        <span className="rating-value">{Number(course.rating || 0).toFixed(1)}</span>
                        <span className="rating-stars">★</span>
                        <span className="rating-count">({(course.ratingCount || 0).toLocaleString()})</span>
                      </div>
                    </div>
                  </div>

                  <div className="item-price">
                    {Number(course.price || 0) <= 0 ? (
                      <span className="price-free">Free</span>
                    ) : (
                      <span className="price-amount">
                        {Number(course.price).toLocaleString()} {course.priceCurrency || "UZS"}
                      </span>
                    )}
                  </div>

                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveItem(course.id)}
                    title="Remove from cart"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-line">
                <span>Courses ({getCartItemsCount()})</span>
                <span>{getCartTotal().toLocaleString()} {cartItems[0]?.priceCurrency || "UZS"}</span>
              </div>
              
              <div className="summary-line total">
                <span>Total</span>
                <span>{getCartTotal().toLocaleString()} {cartItems[0]?.priceCurrency || "UZS"}</span>
              </div>

              <button 
                className="checkout-btn"
                onClick={handleProceedToCheckout}
              >
                <ExternalLink size={20} />
                Proceed to Checkout
              </button>

              <div className="checkout-info">
                <p>• Secure checkout via Telegram</p>
                <p>• Instant access after payment</p>
                <p>• Lifetime access to all courses</p>
              </div>
            </div>
          </div>
        </div>

        {relatedCourses.length > 0 && (
          <div className="related-courses">
            <h2>You might also like</h2>
            <div className="related-grid">
              {relatedCourses.map((course) => (
                <div key={course.id} className="related-course">
                  <div className="related-image">
                    <img src={course.image} alt={course.title} />
                  </div>
                  <div className="related-details">
                    <h4>{course.title}</h4>
                    <p>{course.instructor}</p>
                    <div className="related-price">
                      {Number(course.price || 0) <= 0 ? (
                        <span className="price-free">Free</span>
                      ) : (
                        <span>{Number(course.price).toLocaleString()} {course.priceCurrency || "UZS"}</span>
                      )}
                    </div>
                    <button 
                      className="related-add-btn"
                      onClick={() => addToCart(course)}
                    >
                      Add to Basket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartPage;
