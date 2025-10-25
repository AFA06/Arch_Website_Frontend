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

        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [navigate]);

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

      {myCourses.length === 0 ? (
        <div className="empty-state">
          <Package size={64} color="#9ca3af" />
          <h2>No courses yet</h2>
          <p>Contact the admin to get access to courses</p>
          <button onClick={() => navigate("/courses")} className="browse-btn">
            Browse Available Courses
          </button>
        </div>
      ) : (
        <div className="my-courses-grid">
          {myCourses.map((course) => {
            const thumbnailUrl = course.thumbnail 
              ? `http://localhost:5050${course.thumbnail}` 
              : require("../../assets/architecture.jpg");
            
            return (
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
                  <img src={thumbnailUrl} alt={course.title} />
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

                  {course.description && (
                    <p className="course-description">{course.description}</p>
                  )}

                  <div className="progress-section">
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{course.progress || 0}% Complete</span>
                  </div>

                  <button className="continue-btn">
                    {course.progress === 0 ? "Start Course" : "Continue Learning"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCourses;

