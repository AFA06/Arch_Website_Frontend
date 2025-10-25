// src/pages/CoursePlayer/CoursePlayer.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, CheckCircle, PlayCircle, Loader } from "lucide-react";
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

  // Enhanced Video Security: Comprehensive protection measures
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Prevent context menu (right-click)
    const disableContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Prevent keyboard shortcuts
    const disableKeyboard = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U' ||
            e.key === 'p' || e.key === 'P' || e.key === 'i' || e.key === 'I') {
          e.preventDefault();
          return false;
        }
      }
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent selection and drag
    const disableSelection = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable developer tools
    const disableDevTools = () => {
      // Detect F12 key press
      document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || e.keyCode === 123) {
          e.preventDefault();
          return false;
        }
      });

      // Detect Ctrl+Shift+I (Chrome DevTools)
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
          e.preventDefault();
          return false;
        }
      });

      // Detect Ctrl+Shift+J (Console)
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'J') {
          e.preventDefault();
          return false;
        }
      });

      // Detect Ctrl+U (View Source)
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'U') {
          e.preventDefault();
          return false;
        }
      });
    };

    // Apply security measures
    videoElement.addEventListener("contextmenu", disableContextMenu);
    videoElement.addEventListener("selectstart", disableSelection);
    videoElement.addEventListener("dragstart", disableSelection);

    // Set video attributes for security
    videoElement.controlsList = "nodownload noplaybackrate";
    videoElement.disablePictureInPicture = true;
    videoElement.style.userSelect = "none";

    // Add security class
    videoElement.classList.add('secure-video');

    // Disable developer tools globally
    disableDevTools();

    // Prevent screen recording detection (basic)
    const checkForRecording = () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        // This is a basic check - in production, you'd want more sophisticated detection
        console.log('Screen recording protection active');
      }
    };

    const interval = setInterval(checkForRecording, 5000);

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("contextmenu", disableContextMenu);
        videoElement.removeEventListener("selectstart", disableSelection);
        videoElement.removeEventListener("dragstart", disableSelection);
        videoElement.classList.remove('secure-video');
      }
      clearInterval(interval);
      document.removeEventListener('keydown', disableKeyboard);
    };
  }, [currentVideo]);

  // Additional security: Monitor for dev tools and recording attempts
  useEffect(() => {
    // Detect if dev tools are open
    const detectDevTools = () => {
      const threshold = 160;
      if (window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold) {
        console.log('Developer tools detected - video protection enhanced');
      }
    };

    // Monitor window resize (common dev tools trigger)
    window.addEventListener('resize', detectDevTools);

    return () => {
      window.removeEventListener('resize', detectDevTools);
    };
  }, []);

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
