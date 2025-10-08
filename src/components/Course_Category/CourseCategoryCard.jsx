import React from "react";
import { Link } from "react-router-dom";
import "./CourseCategoryCard.css";

const CourseCard = ({ course }) => {
  return (
    <article className="course-card">
      <Link to={`/courses/${course.slug || ""}`} className="card-link">
        <div className="thumb">
          <img src={course.imageUrl} alt={course.title} />
        </div>
        <div className="card-content">
          <h3 className="course-title">{course.title}</h3>
          <p className="course-meta">
            <span className="instructor">{course.instructor}</span>
            <span className="dot">•</span>
            <span className="students">{course.students} students</span>
          </p>
          <div className="card-footer">
            <span className="price">{course.price}</span>
            <span className="cta">View course →</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default CourseCard;
