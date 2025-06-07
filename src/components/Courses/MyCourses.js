import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Link } from "react-router-dom";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    API.get("/courses/enrolled")
      .then(res => setCourses(res.data));
  }, []);
  return (
    <div className="container py-5">
      <h3 className="fw-bold text-primary mb-4">My Enrolled Courses</h3>
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
                <div className="mt-auto">
                  <Link to={`/courses/${course.courseId}`} className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-eye"></i> View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="col-12 text-center text-muted py-5">No enrolled courses yet.</div>
        )}
      </div>
    </div>
  );
}
