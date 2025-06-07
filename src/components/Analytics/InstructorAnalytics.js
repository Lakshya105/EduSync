import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function InstructorAnalytics() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const instructorId = localStorage.getItem("userId");
    // Fetch all courses by this instructor, then get their assessments
    API.get("/courses")
      .then(res => {
        const myCourses = res.data.filter(c => c.instructorId === instructorId);
        // Flatten all assessments with course title
        let allAssessments = [];
        Promise.all(myCourses.map(course =>
          API.get(`/courses/${course.courseId}`)
            .then(crs => {
              // For each course, fetch its assessments
              return API.get("/assessments").then(asRes => {
                const courseAssessments = asRes.data.filter(a => a.courseId === course.courseId);
                courseAssessments.forEach(a => {
                  allAssessments.push({
                    ...a,
                    courseTitle: course.title
                  });
                });
              });
            })
        )).then(() => {
          setAssessments(allAssessments);
          setLoading(false);
        });
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="container py-5">Loading...</div>;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Your Assessments</h2>
      {assessments.length === 0 ? (
        <div>No assessments found.</div>
      ) : (
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th>Course</th>
              <th>Assessment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map(a => (
              <tr key={a.assessmentId}>
                <td>{a.courseTitle}</td>
                <td>{a.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => navigate(`/assessments/${a.assessmentId}/analytics`)}
                  >
                    <i className="bi bi-bar-chart-line"></i> View Analytics
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
