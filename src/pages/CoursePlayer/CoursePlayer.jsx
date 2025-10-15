// src/pages/CoursePlayer/CoursePlayer.jsx
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { Maximize, Minimize, ChevronLeft, Lock, Loader, CheckCircle } from "lucide-react";
import api from "../../utils/api";
import "./CoursePlayer.css";

const CoursePlayer = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  // State management
  const [courseData, setCourseData] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBigScreen, setIsBigScreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch course data from backend
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/courses/${slug}`);
        
        if (response.data.success) {
          const course = response.data.data;
          setCourseData(course);
          
          // Set the first video or last watched video as current
          if (course.videos && course.videos.length > 0) {
            const lastWatchedId = course.progress?.lastWatchedVideo;
            const lastWatched = course.videos.find(v => v.id === lastWatchedId);
            setCurrentVideo(lastWatched || course.videos[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError(err.response?.data?.message || "Failed to load course");
        
        // Fallback to hardcoded data for demo
        const fallbackData = {
          "3d-modeling-masterclass": {
            title: "3D Modeling Masterclass",
            description: "Learn professional 3D modeling techniques from scratch",
            videos: [
              { id: "1", title: "Introduction to 3D Modeling", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "12:30", isCompleted: false },
              { id: "2", title: "Basic Shapes and Forms", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "25:15", isCompleted: false },
              { id: "3", title: "Advanced Modeling Techniques", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "35:42", isCompleted: false },
              { id: "4", title: "Texturing Fundamentals", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "28:10", isCompleted: false },
              { id: "5", title: "Lighting and Rendering", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "40:20", isCompleted: false },
              { id: "6", title: "Final Project Walkthrough", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "55:30", isCompleted: false },
            ],
          },
          "advanced-architecture-techniques": {
            title: "Advanced Architecture Techniques",
            description: "Master advanced architectural design principles",
            videos: [
              { id: "1", title: "Modern Architecture Principles", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "18:20", isCompleted: false },
              { id: "2", title: "Sustainable Design", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "22:45", isCompleted: false },
              { id: "3", title: "Urban Planning", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "30:15", isCompleted: false },
              { id: "4", title: "Building Materials Selection", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", duration: "25:30", isCompleted: false },
            ],
          },
        };
        
        const fallback = fallbackData[slug];
        if (fallback) {
          setCourseData(fallback);
          setCurrentVideo(fallback.videos[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [slug]);

  useEffect(() => {
    // Security measures
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      // Prevent common download/inspect shortcuts
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "u") ||
        (e.ctrlKey && e.key === "s")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (playerRef.current) {
      const player = playerRef.current.getInternalPlayer();
      if (player && player.setAttribute) {
        player.setAttribute("controlsList", "nodownload");
        player.setAttribute("disablePictureInPicture", "true");
      }
    }
  }, [currentVideo]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleBigScreen = () => {
    setIsBigScreen(!isBigScreen);
  };

  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
    setIsPlaying(true);
  };

  // Update progress when video ends or reaches 90%
  const handleVideoProgress = async (state) => {
    if (!currentVideo || !courseData) return;
    
    // Mark as completed when video reaches 90% or ends
    if (state.played >= 0.9 && !currentVideo.isCompleted) {
      try {
        await api.put(`/courses/${slug}/progress`, {
          videoId: currentVideo.id,
          isCompleted: true,
        });
        
        // Update local state
        setCourseData(prev => ({
          ...prev,
          videos: prev.videos.map(v => 
            v.id === currentVideo.id ? { ...v, isCompleted: true } : v
          ),
        }));
      } catch (err) {
        console.error("Error updating progress:", err);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="course-player-container">
        <div className="course-not-found">
          <Loader size={64} className="spinner" />
          <p>Loading course...</p>
        </div>
      </div>
    );
  }

  // Error or no course data
  if (!courseData) {
    return (
      <div className="course-not-found">
        <Lock size={64} color="#9ca3af" />
        <h2>Course Not Found</h2>
        <p>This course doesn't exist or you don't have access to it.</p>
        <button onClick={() => navigate("/my-courses")} className="back-btn">
          Back to My Courses
        </button>
      </div>
    );
  }

  return (
    <div className={`course-player-container ${isBigScreen ? "big-screen" : ""}`}>
      <div className="course-player-header">
        <button onClick={() => navigate("/my-courses")} className="back-button">
          <ChevronLeft size={20} />
          <span>Back to My Courses</span>
        </button>
        <h1>{courseData.title}</h1>
      </div>

      <div className="player-layout">
        {/* Video Sidebar */}
        <div className={`video-sidebar ${isBigScreen ? "minimized" : ""}`}>
          <div className="sidebar-header">
            <h3>Course Content</h3>
            <span className="video-count">{courseData.videos.length} videos</span>
          </div>
          <div className="video-list">
            {courseData.videos.map((video, index) => (
              <div
                key={video.id}
                className={`video-item ${currentVideo?.id === video.id ? "active" : ""} ${video.isCompleted ? "completed" : ""}`}
                onClick={() => handleVideoSelect(video)}
              >
                <div className="video-number">
                  {video.isCompleted ? (
                    <CheckCircle size={20} className="check-icon" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="video-info">
                  <h4>{video.title}</h4>
                  <span className="video-duration">{video.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Player */}
        <div className="player-section" ref={containerRef}>
          <div className="player-wrapper">
            {/* Security overlay - prevents right-click and screen capture attempts */}
            <div className="security-overlay"></div>
            
            <ReactPlayer
              ref={playerRef}
              url={currentVideo?.url}
              playing={isPlaying}
              controls={true}
              width="100%"
              height="100%"
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    rel: 0,
                    disablekb: 1,
                  },
                },
                file: {
                  attributes: {
                    controlsList: "nodownload",
                    disablePictureInPicture: true,
                  },
                },
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onProgress={handleVideoProgress}
            />
          </div>

          <div className="video-controls-bar">
            <div className="video-title-bar">
              <h2>{currentVideo?.title}</h2>
            </div>
            <div className="player-actions">
              <button onClick={toggleBigScreen} className="control-btn" title="Big Screen Mode">
                {isBigScreen ? <Minimize size={20} /> : <Maximize size={20} />}
                <span>{isBigScreen ? "Normal" : "Big Screen"}</span>
              </button>
              <button onClick={toggleFullscreen} className="control-btn" title="Fullscreen">
                <Maximize size={20} />
                <span>Fullscreen</span>
              </button>
            </div>
          </div>

          <div className="video-description">
            <h3>About this course</h3>
            <p>{courseData.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;

