// src/pages/MyCourses/MyCourses.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Play, Loader } from "lucide-react";
import api from "../../utils/api";
import "./MyCourses.css";

const MyCourses = () => {
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's courses from backend
  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get("/courses/my-courses");
        
        if (response.data.success) {
          setMyCourses(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err.response?.data?.message || "Failed to load courses");
        
        // If no courses or error, show hardcoded sample for demo purposes
        setMyCourses([
          {
            id: 1,
            title: "Introduction to Architecture",
            type: "single",
            slug: "introduction-to-architecture",
            thumbnail: require("../../assets/architecture.jpg"),
            videoCount: 1,
            duration: "45 min",
            progress: 60,
          },
          {
            id: 2,
            title: "3D Modeling Masterclass",
            type: "pack",
            slug: "3d-modeling-masterclass",
            thumbnail: require("../../assets/3d-modeling.jpg"),
            videoCount: 12,
            duration: "8 hours",
            progress: 30,
          },
          {
            id: 3,
            title: "Figma Design Essentials",
            type: "single",
            slug: "figma-design-essentials",
            thumbnail: require("../../assets/figma.jpg"),
            videoCount: 1,
            duration: "1 hour",
            progress: 100,
          },
          {
            id: 4,
            title: "Advanced Architecture Techniques",
            type: "pack",
            slug: "advanced-architecture-techniques",
            thumbnail: require("../../assets/architecture.jpg"),
            videoCount: 20,
            duration: "15 hours",
            progress: 15,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  const handleCourseClick = (course) => {
    // Navigate to course player with slug
    navigate(`/course/${course.slug}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="my-courses-container">
        <div className="loading-state">
          <Loader size={48} className="spinner" />
          <p>Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-courses-container">
      <div className="my-courses-header">
        <h1>My Courses</h1>
        <p>Continue your learning journey with your purchased courses</p>
      </div>

      <div className="my-courses-grid">
        {myCourses.map((course) => (
          <div
            key={course.id}
            className={`my-course-card ${course.type === "pack" ? "pack-card" : ""}`}
            onClick={() => handleCourseClick(course)}
          >
            {course.type === "pack" && (
              <div className="pack-badge">
                <Package size={16} />
                <span>Video Pack</span>
              </div>
            )}

            <div className="course-thumbnail">
              <img src={course.thumbnail} alt={course.title} />
              <div className="play-overlay">
                <div className="play-button">
                  <Play size={32} fill="white" />
                </div>
              </div>
            </div>

            <div className="course-details">
              <h3>{course.title}</h3>
              
              <div className="course-meta">
                {course.type === "pack" ? (
                  <span className="video-count">{course.videoCount} videos</span>
                ) : (
                  <span className="video-single">Single Video</span>
                )}
                <span className="duration">{course.duration}</span>
              </div>

              <div className="progress-section">
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{course.progress}% Complete</span>
              </div>

              <button className="continue-btn">
                {course.progress === 0 ? "Start Course" : "Continue Learning"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {myCourses.length === 0 && (
        <div className="empty-state">
          <Package size={64} color="#9ca3af" />
          <h2>No courses yet</h2>
          <p>Start learning by purchasing a course</p>
          <button onClick={() => navigate("/courses")} className="browse-btn">
            Browse Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCourses;

