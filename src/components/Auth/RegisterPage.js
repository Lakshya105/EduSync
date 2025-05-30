import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", passwordHash: "" });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name === 'password' ? 'passwordHash' : name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    setError("");
    try {
      await API.post("/auth/register", { ...form, role: "Student" });
      setMsg("Registration successful! Please log in.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.response) {
        if (err.response.data && err.response.data.errors) {
          const errorMessages = Object.values(err.response.data.errors).flat();
          setError(errorMessages.join(", "));
        } else if (err.response.data && typeof err.response.data === 'string') {
          setError(err.response.data);
        } else if (err.response.data && err.response.data.title) {
          setError(err.response.data.title);
        } else {
          setError("Registration failed. Please try again.");
        }
      } else if (err.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="bg-white p-4 rounded-4 shadow" style={{maxWidth: 400, width: "100%"}}>
        <div className="text-center mb-4">
          <i className="bi bi-person-plus fs-1 text-success"></i>
          <h4 className="fw-bold">Register</h4>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            className="form-control mb-2"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            className="form-control mb-2"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            className="form-control mb-2"
            placeholder="Password"
            value={form.passwordHash}
            onChange={handleChange}
            required
            minLength={6}
          />
          <button className="btn btn-success w-100" type="submit">
            <i className="bi bi-person-plus"></i> Register
          </button>
          <div className="mt-3 text-center">
            <button type="button" className="btn btn-link p-0" onClick={() => navigate("/login")}>
              Already have an account? Login
            </button>
          </div>
        </form>
        {msg && <div className="alert alert-success mt-3">{msg}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}
