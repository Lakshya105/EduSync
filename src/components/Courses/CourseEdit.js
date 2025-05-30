import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { getUserRole } from "../../utils/auth";
import { jwtDecode } from "jwt-decode";

export default function CourseEdit() {
  const { courseId } = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    mediaUrl: ""
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const role = getUserRole();

  // Get instructorId from token
  let instructorId = "";
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      instructorId =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
        decoded["sub"] ||
        "";
    } catch {
      instructorId = "";
    }
  }

  useEffect(() => {
    if (role !== "Instructor") {
      navigate("/courses");
      return;
    }
    API.get(`/courses/${courseId}`)
      .then(res => {
        setForm({
          title: res.data.title,
          description: res.data.description || "",
          mediaUrl: res.data.mediaUrl || ""
        });
      })
      .catch(() => setError("Failed to load course details."));
  }, [courseId, navigate, role]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    setError("");
    if (!instructorId) {
      setError("InstructorId not found. Please re-login.");
      return;
    }
    try {
      await API.put(`/courses/${courseId}`, {
        ...form,
        instructorId: instructorId
      });
      setMsg("Course updated!");
      setTimeout(() => navigate(`/courses/${courseId}`), 1200);
    } catch (err) {
      setError("Failed to update course.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <h3>Edit Course</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          className="form-control mb-2"
          placeholder="Course Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          className="form-control mb-2"
          placeholder="Description"
          rows={3}
          value={form.description}
          onChange={handleChange}
        />
        <input
          name="mediaUrl"
          className="form-control mb-2"
          placeholder="Media/Image URL"
          value={form.mediaUrl}
          onChange={handleChange}
        />
        <button className="btn btn-success w-100" type="submit">
          Save Changes
        </button>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {msg && <div className="alert alert-success mt-3">{msg}</div>}
    </div>
  );
}
