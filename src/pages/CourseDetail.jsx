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
  const playerRef = useRef();

  useEffect(() => {
    api.get(`/video-categories/${slug}`)
      .then(res => {
        setVideos(res.data.videos);
        setCurrentVideo(res.data.videos[0]);
      })
      .catch(err => console.log(err));
  }, [slug]);

  useEffect(() => {
    if (playerRef.current) secureVideo(playerRef.current.getInternalPlayer());
  }, [currentVideo]);

  const handleBuy = () => {
    window.open("https://t.me/YourAdminBot", "_blank");
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">{slug}</h1>

      {user && user.purchasedCourses?.includes(slug) ? (
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
        <button
          onClick={handleBuy}
          className="bg-green-500 px-4 py-2 rounded"
        >
          Buy Course via Telegram
        </button>
      )}
    </div>
  );
};

export default CourseDetail;
