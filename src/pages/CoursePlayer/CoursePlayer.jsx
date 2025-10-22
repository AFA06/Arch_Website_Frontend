// src/pages/CoursePlayer/CoursePlayer.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, Lock, CheckCircle, PlayCircle, Loader } from "lucide-react";
import api from "../../utils/api";
import "./CoursePlayer.css";

const CoursePlayer = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  
  const [course, setCourse] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoError, setVideoError] = useState(false);

  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/courses/${slug}`);
        
        if (response.data.success) {
          const courseData = response.data.data;
          setCourse(courseData);
          
          // Set first video or last watched video as current
          if (courseData.videos && courseData.videos.length > 0) {
            const lastWatchedId = courseData.progress.lastWatchedVideo;
            const videoToPlay = lastWatchedId
              ? courseData.videos.find(v => v.id === lastWatchedId)
              : courseData.videos[0];
            
            setCurrentVideo(videoToPlay || courseData.videos[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError(err.response?.data?.message || "Failed to load course");
        
        if (err.response?.status === 401) {
          navigate("/login");
        } else if (err.response?.status === 403) {
          alert("You don't have access to this course");
          navigate("/courses");
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCourse();
    }
  }, [slug, navigate]);

  // Video security: Disable right-click and context menu
  useEffect(() => {
    const disableContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("contextmenu", disableContextMenu);
      videoElement.controlsList = "nodownload";
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("contextmenu", disableContextMenu);
      }
    };
  }, [currentVideo]);

  // Disable screen capture (Chrome/Edge)
  useEffect(() => {
    const preventCapture = async () => {
      if (videoRef.current && 'requestPictureInPicture' in videoRef.current) {
        try {
          // Prevent Picture-in-Picture
          videoRef.current.disablePictureInPicture = true;
        } catch (err) {
          console.log("PiP disable not supported");
        }
      }
    };

    preventCapture();
  }, [currentVideo]);

  // Update progress when video ends or changes
  const handleVideoEnd = async () => {
    if (currentVideo && course) {
      try {
        await api.put(`/courses/${slug}/progress`, {
          videoId: currentVideo.id,
          isCompleted: true,
        });
        
        // Move to next video if available
        const currentIndex = course.videos.findIndex(v => v.id === currentVideo.id);
        if (currentIndex < course.videos.length - 1) {
          setCurrentVideo(course.videos[currentIndex + 1]);
        }
      } catch (err) {
        console.error("Error updating progress:", err);
      }
    }
  };

  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
    setVideoError(false);
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  if (loading) {
    return (
      <div className="course-player-container">
        <div className="loading-state">
          <Loader size={48} className="spinner" />
          <p>Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-player-container">
        <div className="error-state">
          <h2>Course Not Found</h2>
          <p>{error || "Unable to load course"}</p>
          <button onClick={() => navigate("/my-courses")} className="back-btn">
            Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-player-container">
      {/* Main Content Area */}
      <div className="player-main">
        {/* Video Player */}
        <div className="video-container">
          {/* Anti-screenshot overlay (semi-transparent watermark) */}
          <div className="video-protection-overlay">
            <span>{localStorage.getItem("userEmail") || "Protected Content"}</span>
          </div>
          
          {currentVideo ? (
            <div className="video-wrapper">
              {videoError ? (
                <div className="video-error">
                  <p>Unable to load video. Please try again or contact support.</p>
                  <button onClick={() => setVideoError(false)} className="retry-btn">
                    Retry
                  </button>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  key={currentVideo.url}
                  controls
                  controlsList="nodownload"
                  disablePictureInPicture
                  onEnded={handleVideoEnd}
                  onError={handleVideoError}
                  className="video-player"
                >
                  <source src={currentVideo.url.startsWith('http') ? currentVideo.url : `http://localhost:5050${currentVideo.url}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ) : (
            <div className="no-video">
              <PlayCircle size={64} />
              <p>Select a video to start watching</p>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="video-info">
          <h1>{currentVideo?.title || course.title}</h1>
          <div className="video-meta">
            <span>{currentVideo?.duration || "Duration N/A"}</span>
            {course.instructor && <span>Instructor: {course.instructor}</span>}
          </div>
          {course.description && (
            <div className="course-description">
              <h3>About this course</h3>
              <p>{course.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar - Video List */}
      {course.type === "pack" && course.videos.length > 1 && (
        <div className="player-sidebar">
          <div className="sidebar-header">
            <h3>Course Content</h3>
            <span className="video-count">
              {course.videos.length} videos
            </span>
          </div>

          <div className="video-list">
            {course.videos
              .sort((a, b) => a.order - b.order)
              .map((video, index) => (
                <div
                  key={video.id}
                  className={`video-item ${currentVideo?.id === video.id ? "active" : ""} ${video.isCompleted ? "completed" : ""}`}
                  onClick={() => handleVideoSelect(video)}
                >
                  <div className="video-item-icon">
                    {video.isCompleted ? (
                      <CheckCircle size={20} className="completed-icon" />
                    ) : currentVideo?.id === video.id ? (
                      <PlayCircle size={20} className="playing-icon" />
                    ) : (
                      <span className="video-number">{index + 1}</span>
                    )}
                  </div>

                  <div className="video-item-info">
                    <h4>{video.title}</h4>
                    <span className="video-duration">{video.duration}</span>
                  </div>

                  {currentVideo?.id === video.id && (
                    <ChevronRight size={20} className="current-indicator" />
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursePlayer;
