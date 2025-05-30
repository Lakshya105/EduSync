import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { getUserRole } from "../../utils/auth";

export default function CoursesList() {
  const [courses, setCourses] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const role = getUserRole();

  useEffect(() => {
    API.get("/courses")
      .then(res => setCourses(res.data))
      .catch(() => setCourses([]));
  }, []);

  // Delete course handler for instructors
  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await API.delete(`/courses/${courseId}`);
      setCourses(prev => prev.filter(c => c.courseId !== courseId));
      setMsg("Course deleted.");
    } catch {
      setMsg("Failed to delete course.");
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-primary">All Courses</h3>
        {role === "Instructor" && (
          <button className="btn btn-primary" onClick={() => navigate("/courses/create")}>
            <i className="bi bi-plus-lg"></i> Create Course
          </button>
        )}
      </div>
      {msg && <div className="alert alert-info">{msg}</div>}
      <div className="row">
        {courses.map(course => (
          <div className="col-12 col-md-6 col-lg-4 mb-4" key={course.courseId}>
            <div className="card h-100 shadow-sm border-0"
                 style={{
                   borderRadius: "1.25rem",
                   background: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)"
                 }}>
              {course.mediaUrl && (
                <img src={course.mediaUrl}
                     alt={course.title}
                     className="card-img-top"
                     style={{maxHeight: 180, objectFit: "cover", borderRadius: "1.25rem 1.25rem 0 0"}} />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold">{course.title}</h5>
                <p className="card-text text-secondary" style={{minHeight: 50}}>
                  {course.description?.slice(0, 90)}{course.description?.length > 90 ? "..." : ""}
                </p>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <Link to={`/courses/${course.courseId}`} className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-eye"></i> View
                  </Link>
                  {role === "Instructor" && (
                    <span>
                      <button
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={() => handleDelete(course.courseId)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-success ms-2"
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
        {courses.length === 0 && (
          <div className="col-12 text-center text-muted py-5">No courses found.</div>
        )}
      </div>
    </div>
  );
}
