import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    setSent(false);
    try {
      await API.post("/auth/forgot-password", { email });
      setMsg("Password reset email sent! Check your inbox.");
      setSent(true);
    } catch {
      setMsg("Failed to send reset email.");
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(120deg, #f7971e 0%, #ffd200 100%)",
        minHeight: "100vh"
      }}
    >
      <div
        className="shadow-lg p-5 rounded-4"
        style={{
          background: "rgba(255,255,255,0.90)",
          maxWidth: 420,
          width: "100%",
          border: "1.5px solid #ffd200",
          backdropFilter: "blur(7px)"
        }}
      >
        <div className="text-center mb-4">
          <i className="bi bi-envelope-at fs-1 text-warning"></i>
          <h4 className="fw-bold mb-1">Forgot Password?</h4>
          <small className="text-muted">Enter your email to reset</small>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              id="forgotEmail"
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
            <label htmlFor="forgotEmail">Email address</label>
          </div>
          <button className="btn btn-warning w-100 fw-semibold mb-2" type="submit" disabled={sent}>
            <i className="bi bi-send"></i> Send Reset Link
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
            <div className={`alert ${sent ? "alert-success" : "alert-danger"} text-center py-2`}>
              {msg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
