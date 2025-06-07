import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useParams, Link } from "react-router-dom"; // Removed useNavigate
import { getUserRole } from "../../utils/auth";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [msg, setMsg] = useState("");
  const [enrolled, setEnrolled] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState("");
  const userRole = getUserRole();

  useEffect(() => {
    API.get(`/courses/${id}`)
      .then(res => setCourse(res.data))
      .catch(() => setMsg("Failed to load course"));

    API.get("/assessments")
      .then(res => {
        const courseAssessments = res.data.filter(a => a.courseId === id);
        setAssessments(courseAssessments);
      })
      .catch(() => setMsg("Failed to load assessments"));

    if (userRole === "Student") {
      API.get(`/courses/${id}/enrollment-status`)
        .then(res => setEnrolled(res.data.enrolled))
        .catch(() => setEnrolled(false));
    }
  }, [id, userRole]);

  const handleEnroll = async () => {
    try {
      await API.post(`/courses/${id}/enroll`);
      setEnrolled(true);
      setEnrollMsg("Enrolled successfully!");
    } catch (err) {
      let message = "Failed to enroll.";
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === "string") message = data;
        else if (data.title) message = data.title;
        else if (data.errors) message = Object.values(data.errors).flat().join(", ");
      }
      setEnrollMsg(message);
    }
  };

  const handleDelete = async (assessmentId) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) return;
    try {
      await API.delete(`/assessments/${assessmentId}`);
      setAssessments(prev => prev.filter(a => a.assessmentId !== assessmentId));
      setMsg("Assessment deleted.");
    } catch (err) {
      setMsg("Failed to delete assessment.");
    }
  };

  if (!course) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container py-5">
      <div className="bg-white p-4 rounded-4 shadow-sm mb-4" style={{maxWidth: 800, margin: "0 auto"}}>
        <h3 className="fw-bold text-primary">{course.title}</h3>
        <p className="text-secondary">{course.description}</p>
        {/* Show attachment download link if exists */}
        {course.attachmentUrl && (
          <div className="mb-3">
            <a
              href={course.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={course.attachmentName}
              className="btn btn-outline-primary"
            >
              <i className="bi bi-download"></i> Download Attachment ({course.attachmentName})
            </a>
          </div>
        )}
        {userRole === "Student" && !enrolled && (
          <button className="btn btn-primary mb-3" onClick={handleEnroll}>
            <i className="bi bi-box-arrow-in-right"></i> Enroll in Course
          </button>
        )}
        {enrollMsg && <div className="alert alert-info">{enrollMsg}</div>}
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold">Assessments</h5>
        {userRole === "Instructor" && (
          <Link to={`/courses/${id}/assessments/create`} className="btn btn-success">
            <i className="bi bi-plus-lg"></i> Add Assessment
          </Link>
        )}
      </div>
      {msg && <div className="alert alert-danger">{msg}</div>}
      {userRole === "Student" && !enrolled ? (
        <div className="alert alert-warning">You must enroll to view assessments.</div>
      ) : (
        <>
          {assessments.length === 0 ? (
            <div className="alert alert-info">No assessments yet.</div>
          ) : (
            <div className="row">
              {assessments.map(a => (
                <div className="col-12 col-md-6 col-lg-4 mb-4" key={a.assessmentId}>
                  <div className="card shadow-sm h-100 border-0" style={{borderRadius: "1.25rem"}}>
                    <div className="card-body d-flex flex-column">
                      <h6 className="card-title fw-bold">{a.title}</h6>
                      <p className="text-secondary small flex-grow-1">Max Score: {a.maxScore}</p>
                      <Link
                        to={`/courses/${id}/assessments/${a.assessmentId}`}
                        className="btn btn-outline-primary btn-sm mb-2"
                      >
                        <i className="bi bi-eye"></i> View
                      </Link>
                      {userRole === "Instructor" && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(a.assessmentId)}
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
        </>
      )}
    </div>
  );
}
