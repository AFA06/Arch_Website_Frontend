// Home.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import "./Home.css";



// New: top instructors
const topInstructors = [
  {
    id: "i1",
    name: "Dr. Amina Karimova",
    title: "AI Engineer & Researcher",
    students: 18320,
    courses: 8,
    avatar: "https://picsum.photos/seed/instructor1/220/220",
    bio: "AI engineer focused on NLP, transformers and production-grade ML systems.",
  },
  {
    id: "i2",
    name: "Jonah Park",
    title: "Senior Frontend Engineer",
    students: 15400,
    courses: 6,
    avatar: "https://picsum.photos/seed/instructor2/220/220",
    bio: "React expert — builds scalable interfaces and developer-friendly component libraries.",
  },
  {
    id: "i3",
    name: "Leyla S.",
    title: "Lead Product Designer",
    students: 12450,
    courses: 5,
    avatar: "https://picsum.photos/seed/instructor3/220/220",
    bio: "Design systems, prototyping and research-driven UX for digital products.",
  },
  {
    id: "i4",
    name: "Marcus F.",
    title: "Cloud Architect",
    students: 11280,
    courses: 7,
    avatar: "https://picsum.photos/seed/instructor4/220/220",
    bio: "AWS-certified cloud architect — focuses on cost-effective infrastructure and automation.",
  },
];

// Fallback courses data removed - component now relies on API data

const faqs = [
  {
    q: "How do I enroll in a course?",
    a: "Click the course card to open its details, then select Enroll or Buy. You'll be guided through checkout and then have instant access.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept major credit/debit cards and local payment methods where available. For admin-registered payments (e.g., offline), contact support.",
  },
  {
    q: "Do courses offer certificates?",
    a: "Many of our courses provide a completion certificate. Check the course details to confirm.",
  },
  {
    q: "How does the refund policy work?",
    a: "Refund policy is listed in the Terms & Conditions. In general, refunds are available within a specified period after purchase.",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [faqOpen, setFaqOpen] = useState(null);

  // Dynamic data states
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  const [categoryCourses, setCategoryCourses] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const root = document.querySelector(".home");
    if (root) {
      setTimeout(() => root.classList.add("is-loaded"), 80);
    }
    
    // Fetch dynamic data from backend
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setApiError(null);

        // Fetch featured courses (for carousel)
        const featuredRes = await api.get("/courses?featured=true&limit=6");
        if (featuredRes.data && featuredRes.data.data) {
          setFeaturedCourses(featuredRes.data.data);
        }

        // Fetch popular courses
        const popularRes = await api.get("/courses?sort=popular&limit=4");
        if (popularRes.data && popularRes.data.data) {
          setPopularCourses(popularRes.data.data);
        }

        // Fetch categories
        const categoriesRes = await api.get("/courses/categories");
        if (categoriesRes.data && categoriesRes.data.data) {
          const categoryNames = categoriesRes.data.data.map(cat => cat.name || cat.title);
          setCategories(["All", ...categoryNames]);
        }

        // Fetch category courses (for filtered section)
        const allCoursesRes = await api.get("/courses?limit=4");
        if (allCoursesRes.data && allCoursesRes.data.data) {
          setCategoryCourses(allCoursesRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
        setApiError("Failed to load data from server. Using fallback content.");
        // Keep using fallback data if API fails
      } finally {
        setLoading(false);
      }
    };
    
    fetchHomeData();
  }, []);

  // Fetch courses by category when activeCategory changes
  useEffect(() => {
    const fetchCategoryCourses = async () => {
      if (activeCategory === "All") {
        try {
          const res = await api.get("/courses?limit=4");
          if (res.data && res.data.data) {
            setCategoryCourses(res.data.data);
          }
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      } else {
        try {
          const res = await api.get(`/courses?category=${encodeURIComponent(activeCategory)}&limit=4`);
          if (res.data && res.data.data) {
            setCategoryCourses(res.data.data);
          }
        } catch (error) {
          console.error("Error fetching category courses:", error);
        }
      }
    };
    
    fetchCategoryCourses();
  }, [activeCategory]);

  const totalSlides = Math.ceil(featuredCourses.length / 3);
  const handleNext = () => setCarouselIndex((prev) => (prev + 1) % (totalSlides || 1));
  const handlePrev = () => setCarouselIndex((prev) => (prev - 1 + (totalSlides || 1)) % (totalSlides || 1));

  // Format price to UZS
  const formatPriceUZS = (price) => {
    if (typeof price === 'number') {
      return price.toLocaleString('uz-UZ') + ' UZS';
    }
    return '0 UZS';
  };
  
  const getVisibleCourses = () => {
    const start = carouselIndex * 3;
    return featuredCourses.slice(start, start + 3);
  };

  const getCourseImage = (thumbnail) => {
    if (!thumbnail) return "https://picsum.photos/seed/default/400/240";
    if (thumbnail.startsWith('http')) return thumbnail;
    return `http://localhost:5050${thumbnail}`;
  };

  const toggleFaq = (idx) => {
    setFaqOpen((prev) => (prev === idx ? null : idx));
  };

  // Show error message if API fails but still render content
  if (apiError) {
    console.warn("API Error:", apiError);
  }

  return (
    <main className="home">
      {/* API Error Notice */}
      {apiError && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          color: '#856404',
          padding: '10px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          {apiError}
        </div>
      )}

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-card">
          <div className="hero-left">
            <h1>Master tomorrow&apos;s skills today</h1>
            <p>
              Power up your AI, career, and life skills with the most up-to-date,
              expert-led learning.
            </p>
            <div className="hero-buttons">
              <button className="btn primary">Get Started</button>
              <button className="btn ghost">Learn React, Python, Design</button>
            </div>
          </div>
          <div className="hero-right">
            <img
              src="https://picsum.photos/seed/hero/550/450"
              alt="Learning illustration"
            />
          </div>
        </div>
      </section>

      {/* CAROUSEL */}
      <section className="carousel-section">
        <div className="carousel-container">
          <div className="carousel-left small-text">
            <div className="inline-text">
              <h2>Learn essential career and life skills</h2>
              <p>
                Udemy helps you build in-demand skills fast and advance your career
                in a changing job market.
              </p>
            </div>
          </div>
          <div className="carousel-right">
            <div className="carousel-cards">
              {loading ? (
                <div className="loading-skeleton">Loading courses...</div>
              ) : getVisibleCourses().length > 0 ? (
                getVisibleCourses().map((course) => (
                  <div key={course._id || course.id} className="carousel-card" onClick={() => navigate(`/courses/${course.slug || course._id}`)}>
                    <img src={getCourseImage(course.thumbnail)} alt={course.title} />
                    <div className="carousel-info">
                      <h3>{course.title}</h3>
                      <span>👤 {(course.studentsEnrolled || 0).toLocaleString()} students</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-courses">No featured courses available</p>
              )}
            </div>
            <div className="carousel-controls">
              <button className="carousel-arrow" onClick={handlePrev}>
                &#8592;
              </button>
              <div className="carousel-indicators">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`indicator ${idx === carouselIndex ? "active" : ""}`}
                  ></div>
                ))}
              </div>
              <button className="carousel-arrow" onClick={handleNext}>
                &#8594;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* COURSES */}
<section className="courses-section">
  <div className="courses-header">
    <h2>Skills to transform your career and life</h2>
    <p>
      From critical skills to technical topics, Udemy supports your
      professional development.
    </p>
  </div>

  {/* CATEGORY FILTER */}
  <div className="category-filter">
    <button
      className={`filter-btn ${activeCategory === "All" ? "active" : ""}`}
      onClick={() => setActiveCategory("All")}
    >
      All
    </button>
    {categories.map((cat) => (
      <button
        key={cat}
        className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
        onClick={() => setActiveCategory(cat)}
      >
        {cat}
      </button>
    ))}
  </div>

  {/* COURSES GRID */}
  <div className="courses-grid">
    {loading ? (
      <div className="loading-skeleton">Loading courses...</div>
    ) : categoryCourses.length > 0 ? (
      categoryCourses.slice(0, 4).map((course, index) => {
        // Determine number of columns based on screen width
        let columns = 4;
        if (window.innerWidth <= 600) columns = 1;
        else if (window.innerWidth <= 900) columns = 2;
        else if (window.innerWidth <= 1200) columns = 3;

        const isLastColumn = (index + 1) % columns === 0;

        return (
          <div
            key={course._id || course.id}
            className="course-card"
            onMouseEnter={() => setHoveredCourse(course._id || course.id)}
            onMouseLeave={() => setHoveredCourse(null)}
          >
            <img src={getCourseImage(course.thumbnail)} alt={course.title} />
            <div className="course-info">
              <h3>{course.title}</h3>
              <div className="course-meta">
                <span className="course-price">{formatPriceUZS(course.price)}</span>
                <span>{(course.studentsEnrolled || 0).toLocaleString()} students</span>
              </div>
              <button 
                className="see-course-btn"
                onClick={() => navigate(`/courses/${course.slug || course._id}`)}
              >
                See Course
              </button>
            </div>

            {hoveredCourse === (course._id || course.id) && (
              <div className={`course-popup ${isLastColumn ? "left" : ""}`}>
                <h4>{course.title}</h4>
                {course.isFeatured && <span className="badge">Featured</span>}
                <p className="update">
                  Updated <strong>{new Date(course.updatedAt || Date.now()).toLocaleDateString()}</strong>
                </p>
                <p className="details">
                  <strong>{course.totalDuration || "N/A"}</strong> • {course.level || "All Levels"}
                </p>
                <p className="desc">{course.description}</p>
              </div>
            )}
          </div>
        );
      })
    ) : (
      <p className="no-courses">No courses available</p>
    )}
  </div>

  {/* SHOW ALL COURSES LINK UNDER FIRST CARD */}
  {categoryCourses.length > 0 && (
    <div className="show-all-wrapper">
      <a href="/courses" className="show-all-link">
        {activeCategory === "All"
          ? "Show all courses"
          : `Show all ${activeCategory.toLowerCase()} courses`}
      </a>
    </div>
  )}
</section>


     {/* TOP INSTRUCTORS */}
<section className="instructors-section">
  <div className="instructors-header">
    <h2>Top Instructors</h2>
    <p>
      Learn from industry experts and practitioners who teach practical,
      up-to-date skills.
    </p>
  </div>

  <div className="instructors-grid">
    {topInstructors.map((inst) => (
      <div key={inst.id} className="instructor-card">
        <div className="instructor-top">
          <img src={inst.avatar} alt={inst.name} />
          <div>
            <h3>{inst.name}</h3>
            <p className="instructor-title">{inst.title}</p>
          </div>
        </div>
        <p className="instructor-bio">{inst.bio}</p>
        <div className="instructor-stats">
          <div className="stat">
            <strong>{inst.students.toLocaleString()}</strong>
            <div className="stat-label">students</div>
          </div>
          <div className="stat">
            <strong>{inst.courses}</strong>
            <div className="stat-label">courses</div>
          </div>
          <div className="profile-button">
            <button 
              className="btn ghost"
              onClick={() => {
                // Navigate to courses page with instructor filter
                navigate(`/courses?instructor=${encodeURIComponent(inst.name)}`);
              }}
            >
              See Courses
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>



{/* POPULAR COURSES */}
<section className="popular-courses-section">
  <div className="popular-courses-header-left">
    <h2>Popular Courses</h2>
    <p>
      Check out the top courses that learners are enrolling in right now.
    </p>
  </div>

  <div className="popular-courses-grid">
    {loading ? (
      <div className="loading-skeleton">Loading popular courses...</div>
    ) : popularCourses.length > 0 ? (
      popularCourses.slice(0, 4).map((course) => (
        <div key={course._id || course.id} className="popular-course-card">
          <img src={getCourseImage(course.thumbnail)} alt={course.title} className="popular-course-image" />
          <div className="popular-course-info">
            <h3 className="popular-course-title">{course.title}</h3>
            <div className="popular-course-price">{formatPriceUZS(course.price)}</div>
            <div className="popular-course-stats">
              {(course.studentsEnrolled || 0).toLocaleString()} students
            </div>
            <button 
              className="btn enroll-btn"
              onClick={() => {
                navigate(`/courses/${course.slug || course._id}`);
              }}
            >
              Enroll
            </button>
          </div>
        </div>
      ))
    ) : (
      <p className="no-courses">No popular courses available</p>
    )}
  </div>
</section>





<section className="faq-section">
  <div className="container">
    {/* Centered Section Header */}
    <div className="section-header">
      <h2>How it Works</h2>
      <p>Quick overview of how to start learning on the platform.</p>
    </div>

    <div className="how-it-works-wrapper">
      {/* How It Works List */}
      <ol className="how-it-works-list">
        <li>
          <strong>Find a course:</strong> Browse categories or search for a topic.
        </li>
        <li>
          <strong>Enroll:</strong> Click the course, hit Enroll/Buy, and complete checkout.
        </li>
        <li>
          <strong>Learn:</strong> Follow the curriculum, complete exercises and projects.
        </li>
        <li>
          <strong>Certificate:</strong> Get a completion certificate (if provided).
        </li>
      </ol>

  {/* FAQ Section */}
<div className="faq-section-right">
  <div className="faq-header">
    <h3>Frequently Asked Questions</h3>
  </div>

  <div className="faq-list">
    {faqs.map((item, idx) => (
      <div key={idx} className={`faq-item ${faqOpen === idx ? "open" : ""}`}>
        <button onClick={() => toggleFaq(idx)} className="faq-question">
          <span>{item.q}</span>
          <span className="faq-icon">{faqOpen === idx ? "−" : "+"}</span>
        </button>
        <div
          className="faq-answer"
          style={{
            maxHeight: faqOpen === idx ? "500px" : "0",
          }}
        >
          {item.a}
        </div>
      </div>
    ))}
  </div>
</div>


    </div>
  </div>
</section>



    </main>
  );
}