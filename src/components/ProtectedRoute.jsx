// src/components/ProtectedRoute.jsx
import { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    // Save the current path so we can redirect back after login
    if (!loading && (!user || !token)) {
      localStorage.setItem("returnAfterLogin", location.pathname);
    }
  }, [user, token, loading, location.pathname]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

