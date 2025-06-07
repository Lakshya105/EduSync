import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { getUserRole } from "../../utils/auth";

// Always show this image
const LOGO_IMG = "https://sg1rg1.blob.core.windows.net/image/placeholder.png";

export default function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [msg, setMsg] = useState("");
  const userRole = getUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/courses")
      .then(res => setCourses(res.data))
      .catch(() => setMsg("Failed to load courses"));
  }, []);

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await API.delete(`/courses/${courseId}`);
      setCourses(prev => prev.filter(c => c.courseId !== courseId));
      setMsg("Course deleted.");
    } catch (err) {
      setMsg("Failed to delete course.");
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">All Courses</h2>
        {userRole === "Instructor" && (
          <button className="btn btn-primary" onClick={() => navigate("/courses/create")}>
            <i className="bi bi-plus-lg"></i> Create Course
          </button>
        )}
      </div>
      {msg && <div className="alert alert-info">{msg}</div>}

      {courses.length === 0 ? (
        <div className="alert alert-info">No courses available.</div>
      ) : (
        <div className="row">
          {courses.map(course => (
            <div key={course.courseId} className="col-12 col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm h-100 border-0" style={{ borderRadius: "1.25rem" }}>
                <div className="card-body d-flex flex-column">
                  {/* Always show EduSync logo */}
                  <div className="mb-3 text-center">
                    <img
                      src={LOGO_IMG}
                      alt="EduSync Logo"
                      style={{
                        width: "64px",
                        height: "64px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        background: "#f0f0f0",
                        border: "2px solid #e0e0e0"
                      }}
                    />
                  </div>
                  <h5 className="card-title fw-bold">{course.title}</h5>
                  <p className="card-text text-secondary flex-grow-1">
                    {course.description}
                    {/* Show mediaUrl as a clickable link if present */}
                    {course.mediaUrl &&
                      <div className="mt-2">
                        <span className="fw-semibold">Media URL: </span>
                        <a href={course.mediaUrl} target="_blank" rel="noopener noreferrer">
                          {course.mediaUrl}
                        </a>
                      </div>
                    }
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <Link to={`/courses/${course.courseId}`} className="btn btn-outline-primary btn-sm">
                      <i className="bi bi-eye"></i> View
                    </Link>
                    {userRole === "Instructor" && (
                      <span>
                        <button
                          className="btn btn-outline-danger btn-sm me-2"
                          onClick={() => handleDelete(course.courseId)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => navigate(`/courses/${course.courseId}/edit`)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
