import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await API.post("/auth/login", form);
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        const decoded = jwtDecode(res.data.token);
        localStorage.setItem("role", decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "");
        localStorage.setItem("name", decoded["name"] || "");
        localStorage.setItem("email", decoded["email"] || "");
        onLogin();
        navigate("/");
      } else {
        setMsg("Invalid login: no token returned.");
      }
    } catch {
      setMsg("Invalid credentials.");
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="bg-white p-4 rounded-4 shadow" style={{maxWidth: 400, width: "100%"}}>
        <div className="text-center mb-4">
          <i className="bi bi-person-circle fs-1 text-primary"></i>
          <h4 className="fw-bold">Login</h4>
        </div>
        <form onSubmit={handleSubmit}>
          <input name="email" type="email" className="form-control mb-2"
            placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="password" type="password" className="form-control mb-2"
            placeholder="Password" value={form.password} onChange={handleChange} required />
          <button className="btn btn-primary w-100" type="submit">
            <i className="bi bi-box-arrow-in-right"></i> Login
          </button>
          <div className="mt-3 text-center">
            <button type="button" className="btn btn-link p-0" onClick={() => navigate("/register")}>
              Register
            </button> | 
            <button type="button" className="btn btn-link p-0" onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </button>
          </div>
        </form>
        {msg && <div className="alert alert-danger mt-3">{msg}</div>}
      </div>
    </div>
  );
}
