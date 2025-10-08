import { Link } from "react-router-dom";
import { useContext, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";
import "./Explore_filter/explore.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const courses = [
    { id: 1, name: "All Courses", slug: "all" },
    { id: 2, name: "3D Design", slug: "3d-design" },
    { id: 3, name: "Figma UI/UX", slug: "figma-uiux" },
    { id: 4, name: "Direction", slug: "direction" },
    { id: 5, name: "Architecture Basics", slug: "architecture-basics" },
    { id: 6, name: "Advanced Modeling", slug: "advanced-modeling" },
  ];

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 300); // 1 second delay
  };

  return (
    <nav className="navbar">
      {/* Left Section */}
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">ArchAcademy</Link>

        {/* Explore Dropdown */}
        <div 
          className="explore-container"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className="explore-link">Explore</span>
          {dropdownOpen && (
            <div className="explore-dropdown">
              {courses.map(course => (
                <Link
                  key={course.id}
                  to={course.slug === "all" ? "/courses" : `/courses/${course.slug}`}
                  className="explore-item"
                >
                  {course.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link to="/categories" className="navbar-link">Categories</Link>
      </div>

      {/* Search */}
      <div className="navbar-search">
        <input type="text" placeholder="Search for courses..." />
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        {user ? (
          <>
            <span className="navbar-username">Hi, {user.name}</span>
            <button onClick={logout} className="btn logout-btn">
              Logout
            </button>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn auth-btn">Login</Link>
            <Link to="/signup" className="btn auth-btn">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
