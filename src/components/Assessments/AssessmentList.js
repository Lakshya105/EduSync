import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { getUserRole } from "../../utils/auth";

export default function AssessmentList() {
  const { courseId } = useParams();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const userRole = getUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await API.get(`/courses/${courseId}/assessments`);
        setAssessments(response.data);
      } catch (err) {
        setError("Failed to load assessments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchAssessments();
    }
  }, [courseId]);

  const handleDelete = async (assessmentId) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) return;
    try {
      await API.delete(`/assessments/${assessmentId}`);
      setAssessments(prev => prev.filter(a => a.assessmentId !== assessmentId));
      setMsg("Assessment deleted.");
    } catch {
      setMsg("Failed to delete assessment.");
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">Loading assessments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-primary">Course Assessments</h4>
        {userRole === "Instructor" && (
          <Link to={`/courses/${courseId}/assessments/create`} className="btn btn-success">
            <i className="bi bi-plus-lg"></i> Create Assessment
          </Link>
        )}
      </div>
      {msg && <div className="alert alert-info">{msg}</div>}
      {assessments.length === 0 ? (
        <div className="alert alert-info">No assessments available for this course.</div>
      ) : (
        <div className="row">
          {assessments.map(assessment => (
            <div className="col-12 col-md-6 col-lg-4 mb-4" key={assessment.assessmentId}>
              <div className="card h-100 shadow-sm border-0" style={{borderRadius: "1.25rem"}}>
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title fw-bold">{assessment.title}</h6>
                  <span className="badge bg-primary mb-2">{assessment.maxScore} points</span>
                  <Link
                    to={`/courses/${courseId}/assessments/${assessment.assessmentId}`}
                    className="btn btn-outline-primary btn-sm mb-2"
                  >
                    <i className="bi bi-eye"></i> View
                  </Link>
                  {userRole === "Instructor" && (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(assessment.assessmentId)}
                    >
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
