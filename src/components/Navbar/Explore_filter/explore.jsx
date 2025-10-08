import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./explore.css";

// Mock data for courses (you can replace this with API fetch later)
const courses = [
  { id: 1, name: "3D Design", slug: "3d-design" },
  { id: 2, name: "Figma UI/UX", slug: "figma-uiux" },
  { id: 3, name: "Direction", slug: "direction" },
  { id: 4, name: "Architecture Basics", slug: "architecture-basics" },
  { id: 5, name: "Advanced Modeling", slug: "advanced-modeling" },
];

const Explore = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div 
      className="explore-container"
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
    >
      <span className="explore-link">Explore ▼</span>

      {dropdownOpen && (
        <div className="explore-dropdown">
          {courses.map(course => (
            <Link 
              key={course.id} 
              to={`/courses/${course.slug}`} 
              className="explore-item"
            >
              {course.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
