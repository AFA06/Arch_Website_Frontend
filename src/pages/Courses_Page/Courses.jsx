"use client"

import { useState } from "react";

import "./Courses.css";


const dummyCourse = {
  title: "100 Days of Code: The Complete Python Pro Bootcamp",
  subtitle:
    "Master Python by building 100 projects in 100 days. Learn data science, automation, build websites, games and apps!",
  rating: 4.7,
  ratingCount: 274_840,
  students: 1_094_934,
  instructor: "Dr. Angela Yu",
  lastUpdated: "Aug 2023",
  language: "English",
  captionLanguage: "English",
  image: "/python-coding-bootcamp-course-preview.jpg",
  whatYouWillLearn: [
    "You will master the Python programming language by building 100 unique projects over 100 days.",
    "You will learn automation, game, app and web development, data science and machine learning all using Python.",
    "You will be able to program in Python professionally",
    "Create a portfolio of 100 Python projects to apply for developer jobs",
    "Be able to build fully fledged websites and web apps with Python",
    "Be able to use Python for data science and machine learning",
    "Build games like Blackjack, Pong and Snake using Python",
  ],
  curriculum: [
    {
      title: "Day 1 - Working with Variables in Python to Manage Data",
      lectures: 6,
      length: "54 min",
    },
    {
      title: "Day 2 - Understanding Data Types and How to Manipulate Strings",
      lectures: 6,
      length: "1 hr 13 min",
    },
    {
      title: "Day 3 - Control Flow and Logical Operators",
      lectures: 9,
      length: "1 hr 8 min",
    },
  ],
  includes: {
    videoHours: "58 hours",
    articles: 74,
    resources: 227,
    access: "Access on mobile and TV",
    certificate: "Certificate of completion",
  },
  description:
    `Welcome to the 100 Days of Code - The Complete Python Pro Bootcamp, the only course you need to learn to code with Python.` +
    ` At 60+ hours, this Python course is without a doubt the most comprehensive Python course available anywhere online...`,
}

export default function CourseDetail() {
  const [expandedSections, setExpandedSections] = useState([])
  const [showFullDesc, setShowFullDesc] = useState(false)

  const toggleSection = (i) => {
    setExpandedSections((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    )
  }

  return (
    <div className="course-detail-page">
      {/* Hero & top info */}
      <div className="hero-section">
        <div className="hero-left">
          <h1 className="course-title">{dummyCourse.title}</h1>
          <p className="course-subtitle">{dummyCourse.subtitle}</p>
          <div className="meta-row">
            <span className="rating">{dummyCourse.rating} ★</span>
            <span className="rating-count">({dummyCourse.ratingCount.toLocaleString()})</span>
            <span className="students">{dummyCourse.students.toLocaleString()} students</span>
          </div>
          <div className="instructor-row">
            <span>Created by </span>
            <span className="instructor-name">{dummyCourse.instructor}</span>
          </div>
          <div className="info-row">
            <span>{dummyCourse.language}</span>
            <span>• Last updated {dummyCourse.lastUpdated}</span>
            <span>• Captions: {dummyCourse.captionLanguage}</span>
          </div>
        </div>
        <div className="hero-right">
          <div className="preview-container">
            <img src={dummyCourse.image} alt="Course preview" className="preview-image" />
            <div className="play-button">▶</div>
          </div>
        </div>
      </div>

      {/* What you’ll learn */}
      <section className="what-you-learn">
        <h2>What you'll learn</h2>
        <ul>
          {dummyCourse.whatYouWillLearn.map((item, idx) => (
            <li key={idx}>✔ {item}</li>
          ))}
        </ul>
      </section>

      {/* Includes / course details */}
      <section className="includes-section">
        <h2>This course includes:</h2>
        <ul>
          <li>{dummyCourse.includes.videoHours} on-demand video</li>
          <li>{dummyCourse.includes.articles} articles</li>
          <li>{dummyCourse.includes.resources} downloadable resources</li>
          <li>{dummyCourse.includes.access}</li>
          <li>{dummyCourse.includes.certificate}</li>
        </ul>
      </section>

      {/* Curriculum */}
      <section className="curriculum-section">
        <h2>Course content</h2>
        <div className="curriculum-list">
          {dummyCourse.curriculum.map((sec, i) => (
            <div key={i} className="curriculum-item">
              <div
                className="section-header"
                onClick={() => toggleSection(i)}
              >
                <span className="expand-icon">
                  {expandedSections.includes(i) ? "▼" : "▶"}
                </span>
                <span className="section-title">{sec.title}</span>
                <span className="section-info">
                  {sec.lectures} lectures • {sec.length}
                </span>
              </div>
              {expandedSections.includes(i) && (
                <div className="lecture-list">
                  {/* Dummy lectures list */}
                  {Array.from({ length: sec.lectures }).map((_, li) => (
                    <div key={li} className="lecture-item">
                      Lecture {li + 1}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Description */}
      <section className="description-section">
        <h2>Description</h2>
        <p>
          {showFullDesc
            ? dummyCourse.description
            : dummyCourse.description.substring(0, 200) + "..."}
        </p>
        <button
          className="toggle-desc-btn"
          onClick={() => setShowFullDesc((p) => !p)}
        >
          {showFullDesc ? "Show less" : "Show more"}
        </button>
      </section>
    </div>
  )
}
