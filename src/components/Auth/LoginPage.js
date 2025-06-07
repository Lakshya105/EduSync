import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        const userId =
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
          decoded["sub"] ||
          decoded["userId"] ||
          "";
        localStorage.setItem("userId", userId);
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
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(120deg, #c471f5 0%, #fa71cd 100%)",
        minHeight: "100vh",
        transition: "background 0.7s"
      }}
    >
      <div
        className="shadow-lg p-5 rounded-4"
        style={{
          background: "rgba(255,255,255,0.85)",
          maxWidth: 400,
          width: "100%",
          border: "1.5px solid #e7d3f8",
          backdropFilter: "blur(6px)"
        }}
      >
        <div className="text-center mb-4">
          <i className="bi bi-person-circle fs-1 text-primary"></i>
          <h4 className="fw-bold mb-1">Welcome to EduSync</h4>
          <small className="text-muted">Please sign in to continue</small>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Email field */}
          <div className="form-floating mb-3">
            <input
              id="loginEmail"
              type="email"
              className="form-control"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              autoFocus
            />
            <label htmlFor="loginEmail">Email address</label>
          </div>
          {/* Password field with eye icon */}
          <div className="form-floating mb-3 position-relative">
            <input
              id="loginPassword"
              type={showPassword ? "text" : "password"}
              className="form-control"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ paddingRight: 45 }}
            />
            <label htmlFor="loginPassword">Password</label>
            <span
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#a078b5"
              }}
              onClick={() => setShowPassword(v => !v)}
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
            </span>
          </div>
          <button className="btn btn-primary w-100 fw-semibold mb-2" type="submit">
            <i className="bi bi-box-arrow-in-right"></i> Login
          </button>
          <div className="text-center mb-2">
            <button type="button" className="btn btn-link p-0" onClick={() => navigate("/register")}>
              Register
            </button>
            {" | "}
            <button type="button" className="btn btn-link p-0" onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </button>
          </div>
          {msg && <div className="alert alert-danger text-center py-2">{msg}</div>}
        </form>
      </div>
    </div>
  );
}
