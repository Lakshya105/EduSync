import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Link } from "react-router-dom";

export default function StudentAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/courses/enrolled")
      .then(courseRes => {
        const ids = courseRes.data.map(c => c.courseId);
        API.get("/assessments")
          .then(assessRes => {
            const userAssessments = assessRes.data.filter(a =>
              ids.includes(a.courseId)
            );
            setAssessments(userAssessments);
            setLoading(false);
          })
          .catch(() => {
            setMsg("Failed to load assessments");
            setLoading(false);
          });
      })
      .catch(() => {
        setMsg("Failed to load your enrolled courses");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="container mt-5">
        <div>Loading your assessments...</div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h3>My Assessments</h3>
      {msg && <div className="alert alert-danger">{msg}</div>}
      {assessments.length === 0 ? (
        <div className="alert alert-info">No assessments assigned to you yet.</div>
      ) : (
        <div className="list-group">
          {assessments.map(assessment => (
            <Link
              key={assessment.assessmentId}
              to={`/assessments/${assessment.assessmentId}`}
              className="list-group-item list-group-item-action"
            >
              <div>
                <strong>{assessment.title}</strong>
                {assessment.description && (
                  <div className="small text-muted">{assessment.description}</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
