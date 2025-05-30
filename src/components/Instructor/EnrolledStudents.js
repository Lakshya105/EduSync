import React, { useEffect, useState } from "react";
import API from "../../services/api";

export default function EnrolledStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    API.get("/courses/enrolled-students")
      .then(res => setStudents(res.data));
  }, []);

  return (
    <div className="container mt-5">
      <h3>All Enrolled Students</h3>
      {students.length === 0 ? (
        <div>No students enrolled yet.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Course</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.userId + s.courseId}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.courseTitle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
