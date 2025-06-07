import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function CourseCreate() {
  const [form, setForm] = useState({ title: "", description: "", mediaUrl: "" });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = e => setFile(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Title", form.title);
    formData.append("Description", form.description);
    formData.append("MediaUrl", form.mediaUrl);
    formData.append("InstructorId", localStorage.getItem("userId"));
    if (file) formData.append("file", file);

    try {
      const res = await API.post("/courses", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMsg("Course created!");
      setTimeout(() => navigate(`/courses/${res.data.courseId}`), 1500);
    } catch (err) {
      setMsg("Failed to create course.");
    }
  };

  return (
    <div className="container py-5">
      <div className="bg-white p-4 rounded-4 shadow" style={{maxWidth: 600, margin: "0 auto"}}>
        <h4 className="fw-bold mb-4">Create New Course</h4>
        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            placeholder="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            className="form-control mb-2"
            placeholder="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            required
          />
          <input
            className="form-control mb-2"
            placeholder="Media URL (optional)"
            name="mediaUrl"
            value={form.mediaUrl}
            onChange={handleChange}
          />
          <label className="form-label mt-2">Attachment (PDF, DOCX, etc):</label>
          <input
            type="file"
            className="form-control mb-3"
            onChange={handleFileChange}
          />
          <button type="submit" className="btn btn-success w-100">
            <i className="bi bi-plus-lg"></i> Create Course
          </button>
        </form>
        {msg && <div className="alert alert-info mt-3">{msg}</div>}
      </div>
    </div>
  );
}
