import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function CourseCreate() {
  const [form, setForm] = useState({ title: "", description: "", mediaUrl: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // Extract instructorId from JWT
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!instructorId) {
      setMsg("InstructorId not found in token. Please re-login as an Instructor.");
      return;
    }
    try {
      await API.post("/courses", {
        title: form.title,
        description: form.description,
        mediaUrl: form.mediaUrl,
        instructorId: instructorId,
      });
      setMsg("Course created!");
      setTimeout(() => navigate("/courses"), 1200);
    } catch (err) {
      let message = "Failed to create course.";
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === "string") message = data;
        else if (data.title) message = data.title;
        else if (data.errors) message = Object.values(data.errors).flat().join(", ");
      }
      setMsg(message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h3>Create Course</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          className="form-control mb-2"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          className="form-control mb-2"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="mediaUrl"
          className="form-control mb-2"
          placeholder="Media URL (optional)"
          value={form.mediaUrl}
          onChange={handleChange}
        />
        <button className="btn btn-success w-100" type="submit">
          Create Course
        </button>
      </form>
      {msg && <div className="alert alert-info mt-2">{msg}</div>}
    </div>
  );
}
