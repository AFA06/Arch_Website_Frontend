import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { ShoppingCart } from "lucide-react";
import ProfileSidebar from "./Profile_sidebar/profile_sidebar";
import Avatar from "../Avatar/Avatar";
import api from "../../utils/api";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { getCartItemsCount } = useContext(CartContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courseCategories, setCourseCategories] = useState([
    { id: "all", name: "All Courses", slug: "all" }
  ]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await api.get("/courses/categories");
        if (response.data && response.data.data) {
          const categories = [
            { id: "all", name: "All Courses", slug: "all" },
            ...response.data.data.map(cat => ({
              id: cat._id || cat.id,
              name: cat.name || cat.title,
              slug: cat.slug || cat.name
            }))
          ];
          setCourseCategories(categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 300);
  };

  const handleCategoryClick = (slug) => {
    const url =
      slug === "all"
        ? "/courses"
        : `/courses?category=${encodeURIComponent(slug)}`;
    navigate(url);
    setDropdownOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">MAVA Academy</Link>

          <div
            className="explore-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="explore-link">Explore</span>
            {dropdownOpen && (
              <div className="explore-dropdown">
                {categoriesLoading ? (
                  <div className="explore-loading">Loading...</div>
                ) : (
                  courseCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category.slug)}
                      className="explore-item"
                    >
                      {category.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <Link to="/courses" className="navbar-link">Courses</Link>
        </div>

        <div className="navbar-search">
          <input type="text" placeholder="Search for courses..." />
        </div>

        <div className="navbar-right">
          <Link to="/cart" className="cart-icon">
            <ShoppingCart size={24} />
            {getCartItemsCount() > 0 && (
              <span className="cart-badge">{getCartItemsCount()}</span>
            )}
          </Link>

          {user ? (
            <div className="navbar-avatar">
              <Avatar
                user={user}
                size="navbar"
                onClick={() => setSidebarOpen(true)}
              />
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn auth-btn">Login</Link>
              <Link to="/signup" className="btn auth-btn">Sign Up</Link>
            </div>
          )}
        </div>
      </nav>

      <ProfileSidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={logout}
      />
    </>
  );
};

export default Navbar;
