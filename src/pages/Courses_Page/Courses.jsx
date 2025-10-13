// Courses.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import "./Courses.css";

const FALLBACK_COURSES = [
  {
    id: "c_ai_arch_101",
    title: "AI Architecture Fundamentals: From Concept to Implementation",
    subtitle: "Master AI system design, neural networks, and deployment strategies for modern applications.",
    image: "https://picsum.photos/seed/ai_arch_101/900/600",
    price: 250000,
    priceCurrency: "UZS",
    rating: 4.8,
    ratingCount: 1840,
    students: 12450,
    instructor: "Dr. Sarah Kim",
    lastUpdated: "2024-12-15",
    category: "AI",
    tags: ["AI", "Architecture", "Machine Learning", "Deep Learning"],
    language: "English",
  },
  {
    id: "c_figma_master",
    title: "Figma Masterclass: Professional UI/UX Design Workflow",
    subtitle: "Complete guide to Figma: from wireframes to interactive prototypes and design systems.",
    image: "https://picsum.photos/seed/figma_master/900/600",
    price: 180000,
    priceCurrency: "UZS",
    rating: 4.7,
    ratingCount: 3240,
    students: 18750,
    instructor: "Alex Rodriguez",
    lastUpdated: "2024-11-28",
    category: "Design",
    tags: ["Figma", "UI/UX", "Design", "Prototyping"],
    language: "English",
  },
  {
    id: "c_arch_design",
    title: "Modern Architecture Design Principles",
    subtitle: "Learn contemporary architectural concepts, sustainable design, and digital modeling techniques.",
    image: "https://picsum.photos/seed/arch_design/900/600",
    price: 320000,
    priceCurrency: "UZS",
    rating: 4.9,
    ratingCount: 2890,
    students: 15680,
    instructor: "Prof. Elena Volkov",
    lastUpdated: "2024-12-01",
    category: "Architecture",
    tags: ["Architecture", "Design", "3D Modeling", "Sustainability"],
    language: "English",
  },
  {
    id: "c_3d_modeling",
    title: "Advanced 3D Modeling & Visualization",
    subtitle: "Master 3D modeling, rendering, and visualization techniques for architectural projects.",
    image: "https://picsum.photos/seed/3d_modeling/900/600",
    price: 290000,
    priceCurrency: "UZS",
    rating: 4.6,
    ratingCount: 2150,
    students: 9870,
    instructor: "Michael Chen",
    lastUpdated: "2024-10-20",
    category: "3D Modeling",
    tags: ["3D Modeling", "Visualization", "Rendering", "CAD"],
    language: "English",
  },
  {
    id: "c_web_dev_react",
    title: "Complete Web Development with React & Node.js",
    subtitle: "Build full-stack web applications using React, Node.js, and modern development practices.",
    image: "https://picsum.photos/seed/web_dev_react/900/600",
    price: 220000,
    priceCurrency: "UZS",
    rating: 4.5,
    ratingCount: 4560,
    students: 23400,
    instructor: "David Johnson",
    lastUpdated: "2024-09-15",
    category: "Programming",
    tags: ["React", "JavaScript", "Node.js", "Web Development"],
    language: "English",
  },
  {
    id: "c_business_strategy",
    title: "Business Strategy & Entrepreneurship",
    subtitle: "Essential business skills for entrepreneurs: strategy, marketing, finance, and growth.",
    image: "https://picsum.photos/seed/business_strategy/900/600",
    price: 0,
    priceCurrency: "UZS",
    rating: 4.4,
    ratingCount: 1890,
    students: 12400,
    instructor: "Lisa Thompson",
    lastUpdated: "2024-08-30",
    category: "Business",
    tags: ["Business", "Entrepreneurship", "Strategy", "Marketing"],
    language: "English",
  },
  {
    id: "c_data_science",
    title: "Data Science & Analytics Mastery",
    subtitle: "Comprehensive data science course covering Python, statistics, machine learning, and visualization.",
    image: "https://picsum.photos/seed/data_science/900/600",
    price: 280000,
    priceCurrency: "UZS",
    rating: 4.7,
    ratingCount: 3120,
    students: 15600,
    instructor: "Dr. Ahmed Hassan",
    lastUpdated: "2024-12-05",
    category: "Data Science",
    tags: ["Data Science", "Python", "Statistics", "Machine Learning"],
    language: "English",
  },
  {
    id: "c_mobile_dev",
    title: "Mobile App Development: React Native",
    subtitle: "Build cross-platform mobile apps using React Native, Firebase, and modern mobile development tools.",
    image: "https://picsum.photos/seed/mobile_dev/900/600",
    price: 240000,
    priceCurrency: "UZS",
    rating: 4.6,
    ratingCount: 1780,
    students: 8900,
    instructor: "Sophie Martinez",
    lastUpdated: "2024-11-12",
    category: "Mobile Development",
    tags: ["React Native", "Mobile", "JavaScript", "Firebase"],
    language: "English",
  },
  {
    id: "c_cybersecurity",
    title: "Cybersecurity Fundamentals",
    subtitle: "Learn essential cybersecurity concepts, ethical hacking, and network security best practices.",
    image: "https://picsum.photos/seed/cybersecurity/900/600",
    price: 260000,
    priceCurrency: "UZS",
    rating: 4.8,
    ratingCount: 1420,
    students: 6700,
    instructor: "James Wilson",
    lastUpdated: "2024-10-08",
    category: "Cybersecurity",
    tags: ["Cybersecurity", "Ethical Hacking", "Network Security", "Penetration Testing"],
    language: "English",
  },
  {
    id: "c_cloud_computing",
    title: "Cloud Computing & AWS Solutions",
    subtitle: "Master cloud computing with AWS: EC2, S3, Lambda, and scalable application deployment.",
    image: "https://picsum.photos/seed/cloud_computing/900/600",
    price: 300000,
    priceCurrency: "UZS",
    rating: 4.9,
    ratingCount: 2890,
    students: 11200,
    instructor: "Rachel Green",
    lastUpdated: "2024-12-10",
    category: "Cloud Computing",
    tags: ["AWS", "Cloud Computing", "DevOps", "Scalability"],
    language: "English",
  },
  {
    id: "c_digital_marketing",
    title: "Digital Marketing & SEO Strategy",
    subtitle: "Complete digital marketing course: SEO, social media, content marketing, and analytics.",
    image: "https://picsum.photos/seed/digital_marketing/900/600",
    price: 150000,
    priceCurrency: "UZS",
    rating: 4.3,
    ratingCount: 2560,
    students: 14500,
    instructor: "Mark Stevens",
    lastUpdated: "2024-09-22",
    category: "Marketing",
    tags: ["Digital Marketing", "SEO", "Social Media", "Analytics"],
    language: "English",
  },
  {
    id: "c_project_management",
    title: "Project Management & Agile Methodologies",
    subtitle: "Master project management with Agile, Scrum, and modern project delivery frameworks.",
    image: "https://picsum.photos/seed/project_management/900/600",
    price: 200000,
    priceCurrency: "UZS",
    rating: 4.5,
    ratingCount: 1980,
    students: 9200,
    instructor: "Emma Davis",
    lastUpdated: "2024-11-05",
    category: "Project Management",
    tags: ["Project Management", "Agile", "Scrum", "Leadership"],
    language: "English",
  },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "priceAsc", label: "Price: Low → High" },
  { value: "priceDesc", label: "Price: High → Low" },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [sortBy, setSortBy] = useState("newest");
  const [onlyFree, setOnlyFree] = useState(false);
  const PAGE_SIZE = 9;
  const [page, setPage] = useState(1);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchCourses() {
      setLoading(true);
      setFetchError(null);
      try {
        const res = await fetch("/api/courses");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        if (!cancelled) {
          setCourses(Array.isArray(data) && data.length ? data : FALLBACK_COURSES);
        }
      } catch (err) {
        if (!cancelled) {
          setFetchError(err.message);
          setCourses(FALLBACK_COURSES);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchCourses();
    return () => (cancelled = true);
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    courses.forEach((c) => {
      if (c.category) set.add(c.category);
      if (Array.isArray(c.tags)) c.tags.forEach((t) => set.add(t));
    });
    return Array.from(set).sort();
  }, [courses]);

  const priceStats = useMemo(() => {
    const prices = courses.map((c) => Number(c.price || 0));
    const max = Math.max(...prices, 0);
    const min = Math.min(...prices, 0);
    return { max, min };
  }, [courses]);

  const filteredSorted = useMemo(() => {
    let list = courses.slice();

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((c) => {
        return (
          (c.title && c.title.toLowerCase().includes(q)) ||
          (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
          (c.instructor && c.instructor.toLowerCase().includes(q)) ||
          (Array.isArray(c.tags) && c.tags.join(" ").toLowerCase().includes(q))
        );
      });
    }

    if (selectedCategories.size > 0) {
      list = list.filter((c) => selectedCategories.has(c.category) || (c.tags || []).some((t) => selectedCategories.has(t)));
    }

    if (onlyFree) {
      list = list.filter((c) => Number(c.price || 0) <= 0);
    } else {
      const numericMax = Number(maxPrice);
      if (!Number.isNaN(numericMax)) {
        const cap = Math.max(priceStats.max, numericMax);
        list = list.filter((c) => Number(c.price || 0) <= cap);
      }
    }

    if (minRating > 0) {
      list = list.filter((c) => Number(c.rating || 0) >= minRating);
    }

    list.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case "oldest":
          return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
        case "priceAsc":
          return (Number(a.price) || 0) - (Number(b.price) || 0);
        case "priceDesc":
          return (Number(b.price) || 0) - (Number(a.price) || 0);
        default:
          return 0;
      }
    });

    return list;
  }, [courses, search, selectedCategories, minRating, maxPrice, sortBy, onlyFree, priceStats]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const paginated = filteredSorted.slice(0, page * PAGE_SIZE);

  const toggleCategory = (cat) => {
    const next = new Set(selectedCategories);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setSelectedCategories(next);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories(new Set());
    setMinRating(0);
    setMaxPrice(priceStats.max || 100);
    setSortBy("newest");
    setOnlyFree(false);
    setPage(1);
  };

  useEffect(() => {
    if (priceStats.max > 0) setMaxPrice(priceStats.max);
  }, [priceStats.max]);

  const openTelegram = (username = "abdukarimov_arch") => {
    const url = `https://t.me/${username.replace(/^@/, "")}`;
    window.open(url, "_blank");
  };

  return (
    <div className="courses-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Master Architecture & Design</h1>
          <p className="hero-subtitle">Discover professional courses in AI, Design, Architecture, and more. Learn from industry experts and advance your career.</p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">12+</span>
              <span className="stat-label">Courses</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">150K+</span>
              <span className="stat-label">Students</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.7★</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>
          <button className="hero-cta">
            Start Learning Today
          </button>
        </div>
      </section>

      <div className="search-controls-bar">
        <div className="search-controls-container">
          <div className="search-wrapper">
            <input
              aria-label="Search courses"
              placeholder="Search courses, instructors, tags..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="search-input"
            />
            <button
              className="search-clear"
              onClick={() => setSearch("")}
              title="Clear search"
            >
              ✕
            </button>
          </div>

          <div className="sort-select">
            <label htmlFor="sort" className="sr-only">Sort</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <button
            className="filters-toggle"
            onClick={() => setShowFiltersPanel((s) => !s)}
            aria-pressed={showFiltersPanel}
          >
            Filters
            <span className="filters-count">{selectedCategories.size > 0 ? selectedCategories.size : ""}</span>
          </button>
        </div>
      </div>

      <div className="courses-body">
        <aside className={`filters-panel ${showFiltersPanel ? "open" : ""}`} aria-hidden={!showFiltersPanel}>
          <div className="filters-header">
            <h3>Filters</h3>
            <button className="clear-btn" onClick={clearFilters}>Reset</button>
          </div>

          <div className="filter-group">
            <h4>Categories</h4>
            <div className="categories-list">
              {categories.length === 0 && <div className="muted">No categories found</div>}
              {categories.map((cat) => {
                const active = selectedCategories.has(cat);
                return (
                  <button
                    key={cat}
                    className={`chip ${active ? "active" : ""}`}
                    onClick={() => toggleCategory(cat)}
                    title={`Filter by ${cat}`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filter-group">
            <h4>Price</h4>
            <div className="price-controls">
              <div className="price-row">
                <span className="muted">Max:</span>
                <span className="price-value">{Number(maxPrice).toLocaleString()} {courses[0]?.priceCurrency || "UZS"}</span>
              </div>
              <input
                type="range"
                min={priceStats.min}
                max={Math.max(priceStats.max, priceStats.min + 1)}
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setOnlyFree(false);
                  setPage(1);
                }}
                className="range"
              />
              <label className="free-checkbox">
                <input
                  type="checkbox"
                  checked={onlyFree}
                  onChange={(e) => {
                    setOnlyFree(e.target.checked);
                    setPage(1);
                  }}
                />
                Only free courses
              </label>
            </div>
          </div>

          <div className="filter-group">
            <h4>Rating</h4>
            <div className="rating-row">
              <select
                value={minRating}
                onChange={(e) => {
                  setMinRating(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={0}>Any rating</option>
                <option value={4.5}>4.5+</option>
                <option value={4.0}>4.0+</option>
                <option value={3.5}>3.5+</option>
                <option value={3.0}>3.0+</option>
              </select>
              <span className="muted">or above</span>
            </div>
          </div>

          <div className="filter-group">
            <h4>Other</h4>
            <div className="other-row">
              <label className="checkbox-inline">
                <input type="checkbox" checked={false} onChange={() => {}} disabled />
                New &amp; trending (coming soon)
              </label>
              <label className="checkbox-inline">
                <input type="checkbox" checked={false} onChange={() => {}} disabled />
                Certificate included (coming soon)
              </label>
            </div>
          </div>
        </aside>

        <main className="courses-main">
          {loading && <div className="status info">Loading courses...</div>}
          {!loading && fetchError && <div className="status warn">Couldn't fetch from server — showing fallback content.</div>}
          {!loading && filteredSorted.length === 0 && <div className="status empty">No courses match your filters. Try removing some filters.</div>}

          <div className="courses-grid">
            {paginated.map((course) => (
              <article key={course.id} className="course-card">
                <div className="card-media">
                  <img src={course.image || "/placeholder-course.jpg"} alt={course.title} />
                  <div className="card-badge">
                    {Number(course.price || 0) <= 0 ? "Free" : `${Number(course.price).toLocaleString()} ${course.priceCurrency || "UZS"}`}
                  </div>
                </div>

                <div className="card-body">
                  <h3 className="card-title">{course.title}</h3>
                  <p className="card-sub">{course.subtitle}</p>

                  <div className="card-meta">
                    <div className="rating">
                      <span className="rating-value">{Number(course.rating || 0).toFixed(1)}</span>
                      <span className="rating-stars">★</span>
                      <span className="rating-count">({(course.ratingCount || 0).toLocaleString()})</span>
                    </div>
                    <div className="students">{(course.students || 0).toLocaleString()} students</div>
                  </div>

                  <div className="card-footer">
                    <div className="instructor">{course.instructor}</div>
                    <div className="actions">
                      {/* BUY now opens Telegram chat with the specified username */}
                      <button
                        className="btn btn-primary"
                        onClick={() => openTelegram("abdukarimov_arch")}
                      >
                        {Number(course.price || 0) <= 0 ? "Enroll" : `Buy ${Number(course.price).toLocaleString()} ${course.priceCurrency || "UZS"}`}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="pagination-row">
            <div className="results-count">
              Showing {Math.min(paginated.length, filteredSorted.length)} of {filteredSorted.length} results
            </div>
            <div className="pagination-controls">
              {page > 1 && (
                <button
                  className="btn btn-ghost"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </button>
              )}
              {page < totalPages && (
                <button
                  className="btn btn-primary"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Load more
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
