import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { ShoppingCart } from "lucide-react";
import ProfileSidebar from "./Profile_sidebar/profile_sidebar";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { getCartItemsCount } = useContext(CartContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const timeoutRef = useRef(null);

  const courseCategories = [
    { id: 1, name: "All Courses", category: "all" },
    { id: 2, name: "AI", category: "AI" },
    { id: 3, name: "Design", category: "Design" },
    { id: 4, name: "Architecture", category: "Architecture" },
    { id: 5, name: "3D Modeling", category: "3D Modeling" },
    { id: 6, name: "Programming", category: "Programming" },
    { id: 7, name: "Business", category: "Business" },
    { id: 8, name: "Data Science", category: "Data Science" },
    { id: 9, name: "Mobile Development", category: "Mobile Development" },
    { id: 10, name: "Cybersecurity", category: "Cybersecurity" },
    { id: 11, name: "Cloud Computing", category: "Cloud Computing" },
    { id: 12, name: "Marketing", category: "Marketing" },
    { id: 13, name: "Project Management", category: "Project Management" },
  ];

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 300);
  };

  const handleCategoryClick = (category) => {
    const url =
      category === "all"
        ? "/courses"
        : `/courses?category=${encodeURIComponent(category)}`;
    navigate(url);
    setDropdownOpen(false);
  };

  const getInitials = (name, surname) => {
    if (!name || !surname) return "?";
    return `${name[0]}${surname[0]}`.toUpperCase();
  };

  return (
    <>
      <nav className="navbar">
        {/* Left Section */}
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            MAVA Academy
          </Link>

          {/* Explore Dropdown */}
          <div
            className="explore-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="explore-link">Explore</span>
            {dropdownOpen && (
              <div className="explore-dropdown">
                {courseCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.category)}
                    className="explore-item"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link to="/courses" className="navbar-link">
            Courses
          </Link>
        </div>

        {/* Search */}
        <div className="navbar-search">
          <input type="text" placeholder="Search for courses..." />
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          {/* Cart */}
          <Link to="/cart" className="cart-icon">
            <ShoppingCart size={24} />
            {getCartItemsCount() > 0 && (
              <span className="cart-badge">{getCartItemsCount()}</span>
            )}
          </Link>

          {/* Profile / Auth */}
          {user ? (
            <div className="profile-avatar" onClick={() => setSidebarOpen(true)}>
              {user.image ? (
                <img
                  src={user.image}
                  alt="profile"
                  className="avatar-circle-img"
                />
              ) : (
                <div className="avatar-circle">
                  {getInitials(user.name, user.surname)}
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn auth-btn">
                Login
              </Link>
              <Link to="/signup" className="btn auth-btn">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Sidebar */}
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
