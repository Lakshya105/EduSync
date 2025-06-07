import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        passwordHash: form.password,
        role: "Student"
      });
      setMsg("Registration successful! Please log in.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setMsg(
        err?.response?.data || "Registration failed. Email may already be in use."
      );
    }
    setLoading(false);
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(120deg, #8fd3f4 0%, #a6c1ee 100%)",
        minHeight: "100vh"
      }}
    >
      <div
        className="shadow-lg p-5 rounded-4"
        style={{
          background: "rgba(255,255,255,0.87)",
          maxWidth: 420,
          width: "100%",
          border: "1.5px solid #a6c1ee",
          backdropFilter: "blur(8px)"
        }}
      >
        <div className="text-center mb-4">
          <i className="bi bi-person-plus fs-1 text-success"></i>
          <h4 className="fw-bold mb-1">Register for EduSync</h4>
          <small className="text-muted">Students only</small>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-floating mb-3">
            <input
              id="regName"
              name="name"
              type="text"
              className="form-control"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="regName">Full Name</label>
          </div>
          <div className="form-floating mb-3">
            <input
              id="regEmail"
              name="email"
              type="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="regEmail">Email address</label>
          </div>
          <div className="form-floating mb-3">
            <input
              id="regPassword"
              name="password"
              type="password"
              className="form-control"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
            <label htmlFor="regPassword">Password</label>
          </div>
          <button
            className="btn btn-success w-100 fw-semibold mb-2"
            type="submit"
            disabled={loading}
          >
            <i className="bi bi-person-plus"></i> Register
          </button>
          <div className="text-center mb-2">
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => navigate("/login")}
            >
              Already registered? Login
            </button>
          </div>
          {msg && (
  <div className={`alert ${
    typeof msg === "string" && msg.startsWith("Registration successful")
      ? "alert-success"
      : "alert-danger"
  } text-center py-2`}>
    {typeof msg === "string" ? msg : "Registration failed."}
  </div>
)}

        </form>
      </div>
    </div>
  );
}
