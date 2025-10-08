const VideoCard = ({ video, onClick }) => {
  return (
    <div onClick={() => onClick(video)} className="cursor-pointer p-2 border-b hover:bg-gray-100">
      {video.title}
    </div>
  );
};

export default VideoCard;
