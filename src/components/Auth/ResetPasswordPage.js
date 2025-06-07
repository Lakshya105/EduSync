import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get token from query string
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    setDone(false);
    try {
      await API.post("/auth/reset-password", { token, newPassword: password });
      setMsg("Password reset successful! Please login.");
      setDone(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      setMsg("Password reset failed. Please try again.");
    }
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
          background: "rgba(255,255,255,0.90)",
          maxWidth: 420,
          width: "100%",
          border: "1.5px solid #a6c1ee",
          backdropFilter: "blur(8px)"
        }}
      >
        <div className="text-center mb-4">
          <i className="bi bi-key fs-1 text-primary"></i>
          <h4 className="fw-bold mb-1">Reset Password</h4>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              id="resetPassword"
              type="password"
              className="form-control"
              placeholder="New Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              autoFocus
            />
            <label htmlFor="resetPassword">New Password</label>
          </div>
          <button className="btn btn-primary w-100 fw-semibold mb-2" type="submit" disabled={done}>
            <i className="bi bi-arrow-repeat"></i> Reset Password
          </button>
          <div className="text-center mb-2">
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </div>
          {msg && (
            <div className={`alert ${done ? "alert-success" : "alert-danger"} text-center py-2`}>
              {msg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
