import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <Link to="/" className="bg-blue-500 text-white px-4 py-2 rounded">Go Home</Link>
    </div>
  );
};

export default NotFound;
