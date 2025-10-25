// src/App.js
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext"; // ← Added

// Layout Components
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

// Pages
import Home from "./pages/Homepage/Home";
import Courses from "./pages/Courses_Page/Courses";
import CourseDetail from "./pages/CourseDetail";
import Login from "./pages/LoginPage/Login";
import Signup from "./pages/LoginPage/Signup";
import ShoppingCart from "./components/Navbar/Basked/ShoppingCart";
import MyCourses from "./pages/MyCourses/MyCourses";
import CoursePlayer from "./pages/CoursePlayer/CoursePlayer";
import NotFound from "./pages/NotFound";

// Layout wrapper to hide Navbar/Footer on login/signup pages
function Layout({ children }) {
  const location = useLocation();
  const hideLayout = ["/login", "/signup"].includes(location.pathname);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {!hideLayout && <Navbar />}
      <main style={{ flex: 1 }}>{children}</main>
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <NotificationProvider> {/* ← Wrap everything that may use notifications */}
            <CartProvider>
              <Layout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:id" element={<CourseDetail />} />
                  <Route path="/cart" element={<ShoppingCart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />

                  {/* Protected Routes */}
                  <Route
                    path="/my-courses"
                    element={
                      <ProtectedRoute>
                        <MyCourses />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/course/:slug"
                    element={
                      <ProtectedRoute>
                        <CoursePlayer />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Not Found */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </CartProvider>
          </NotificationProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
