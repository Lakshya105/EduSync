import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function InstructorAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get instructor's courses
    API.get("/courses")
      .then(res => {
        setCourses(res.data);
        const courseIds = res.data.map(c => c.courseId);
        // Then get all assessments and filter by courses instructor teaches
        API.get("/assessments")
          .then(aRes => {
            setAssessments(
              aRes.data.filter(a => courseIds.includes(a.courseId))
            );
          })
          .catch(() => setMsg("Failed to load assessments"));
      })
      .catch(() => setMsg("Failed to load your courses"));
  }, []);

  // Delete handler
  const handleDelete = async (assessmentId) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) return;
    try {
      await API.delete(`/assessments/${assessmentId}`);
      setAssessments(prev => prev.filter(a => a.assessmentId !== assessmentId));
    } catch {
      alert("Failed to delete assessment.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>My Assessments</h3>
        <button className="btn btn-primary" onClick={() => navigate("/courses")}>
          + Create Assessment (choose course)
        </button>
      </div>
      {msg && <div className="alert alert-danger">{msg}</div>}
      {assessments.length === 0 ? (
        <div className="alert alert-info">No assessments created yet.</div>
      ) : (
        <div className="list-group">
          {assessments.map(assessment => (
            <div
              key={assessment.assessmentId}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <Link to={`/assessments/${assessment.assessmentId}`}>
                  <b>{assessment.title}</b>
                </Link>
                <div className="small text-muted">
                  {assessment.description} <br />
                  Course: {courses.find(c => c.courseId === assessment.courseId)?.title || ""}
                </div>
              </div>
              <div>
                <button
                  className="btn btn-sm btn-outline-success me-2"
                  onClick={() => navigate(`/courses/${assessment.courseId}/assessments/${assessment.assessmentId}/edit`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(assessment.assessmentId)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
