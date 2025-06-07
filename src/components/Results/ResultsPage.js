import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { getUserRole } from "../../utils/auth";

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [users, setUsers] = useState([]); // NEW: Store users
  const [msg, setMsg] = useState("");
  const role = getUserRole();

  useEffect(() => {
    API.get("/results")
      .then(res => setResults(res.data))
      .catch(() => setMsg("Failed to load results"));

    API.get("/assessments")
      .then(res => setAssessments(res.data))
      .catch(() => setAssessments([]));

    // Fetch all users (for instructor result page)
    if (role === "Instructor") {
      API.get("/users")
        .then(res => setUsers(res.data))
        .catch(() => setUsers([]));
    }
  }, [role]);

  // Helper to get assessment title by id
  const getAssessmentTitle = (id) => {
    const assessment = assessments.find(a => a.assessmentId === id);
    return assessment ? assessment.title : "Assessment";
  };

  // Helper to get student name by userId
  const getStudentName = (userId) => {
    const user = users.find(u => u.userId === userId);
    return user ? user.name : userId;
  };

  // Utility: Always parse as UTC and display in IST
  const parseUtc = (dt) => {
    if (!dt) return "";
    if (dt.endsWith("Z")) return new Date(dt);
    if (dt.includes("T")) return new Date(dt + "Z");
    return new Date(dt.replace(" ", "T") + "Z");
  };

  return (
    <div className="container mt-5">
      <h3>{role === "Instructor" ? "Student Results" : "My Assessment Results"}</h3>
      {msg && <div className="alert alert-danger">{msg}</div>}
      {results.length === 0 ? (
        <div className="alert alert-info">No results yet.</div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              {role === "Instructor" && <th>Student Name</th>}
              <th>Assessment</th>
              <th>Score</th>
              <th>Date (IST)</th>
            </tr>
          </thead>
          <tbody>
            {results.map(r => (
              <tr key={r.resultId}>
                {role === "Instructor" && <td>{getStudentName(r.userId)}</td>}
                <td>{getAssessmentTitle(r.assessmentId)}</td>
                <td>{r.score}</td>
                <td>
                  {parseUtc(r.attemptDate).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
