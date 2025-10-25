import { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import ReactPlayer from "react-player";
import { secureVideo } from "../utils/videoSecurity";
import { AuthContext } from "../context/AuthContext";
import VideoCard from "../components/VideoCard";

const CourseDetail = () => {
  const { slug } = useParams();
  const { user } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const playerRef = useRef();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/courses/${slug}`);

        if (response.data.success) {
          setCourseData(response.data.data);
          setHasAccess(true);
          setVideos(response.data.data.videos || []);
          setCurrentVideo(response.data.data.videos?.[0] || null);
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.log('Course access error:', error);
        setHasAccess(false);
        if (error.response?.status === 403) {
          // User doesn't have access
          setCourseData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  useEffect(() => {
    if (playerRef.current) secureVideo(playerRef.current.getInternalPlayer());
  }, [currentVideo]);

  const handleBuy = () => {
    window.open("https://t.me/YourAdminBot", "_blank");
  };

  if (loading) {
    return (
      <div className="p-10">
        <div className="text-center">Loading course...</div>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">
        {courseData?.title || slug}
      </h1>

      {hasAccess ? (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            {currentVideo && (
              <ReactPlayer
                ref={playerRef}
                url={currentVideo.url}
                controls
                width="100%"
                height="500px"
              />
            )}
          </div>
          <div className="flex-1">
            {videos.map(v => (
              <VideoCard key={v._id} video={v} onClick={setCurrentVideo} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4">
            {user ? "You don't have access to this course or your access has expired." : "Please log in to access this course."}
          </p>
          <button
            onClick={handleBuy}
            className="bg-green-500 px-4 py-2 rounded"
          >
            {user ? "Request Access via Telegram" : "Login to Access"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
