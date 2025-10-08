// src/App.js
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layout Components
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

// Pages
import Home from "./pages/Homepage/Home";
import Courses from "./pages/Courses_Page/Courses"; // ✅ Corrected earlier
import CourseDetail from "./pages/CourseDetail"; // ✅ Fixed this line
import Login from "./pages/LoginPage/Login";
import Signup from "./pages/LoginPage/Signup";

function Layout({ children }) {
  const location = useLocation();
  const hideLayout = ["/login", "/signup"].includes(location.pathname);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {!hideLayout && <Navbar />}
      <div style={{ flex: 1 }}>
        {children}
      </div>
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
