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
    try {
      await API.post("/auth/forgot-password", { email });
      setMsg("Reset link sent! Check your email.");
      setSent(true);
    } catch (err) {
      setMsg(err?.response?.data || "Failed to send reset email.");
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="bg-white p-4 rounded-4 shadow" style={{maxWidth: 400, width: "100%"}}>
        <div className="text-center mb-4">
          <i className="bi bi-envelope-exclamation fs-1 text-warning"></i>
          <h4 className="fw-bold">Forgot Password</h4>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            className="form-control mb-2"
            placeholder="Enter your registered email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button className="btn btn-warning w-100" type="submit" disabled={sent}>
            <i className="bi bi-envelope"></i> Send Reset Link
          </button>
          <div className="mt-3 text-center">
            <button type="button" className="btn btn-link p-0" onClick={() => navigate("/login")}>
              Back to Login
            </button>
          </div>
        </form>
        {msg && <div className={`alert mt-3 ${sent ? 'alert-success' : 'alert-info'}`}>{msg}</div>}
      </div>
    </div>
  );
}
