// This component is now integrated into the main Navbar component
// This file is kept for potential future use or as a reference

import { useState } from "react";
import "./explore.css";

const Explore = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Updated course categories to match the main Navbar
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

  const handleCategoryClick = (category) => {
    // Navigate to courses page with category filter
    const url = category === "all" 
      ? "/courses" 
      : `/courses?category=${encodeURIComponent(category)}`;
    window.location.href = url;
    setDropdownOpen(false);
  };

  return (
    <div 
      className="explore-container"
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
    >
      <span className="explore-link">Explore</span>

      {dropdownOpen && (
        <div className="explore-dropdown">
          {courseCategories.map(category => (
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
  );
};

export default Explore;
