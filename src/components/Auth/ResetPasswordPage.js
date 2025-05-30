import React, { useState } from "react";
import API from "../../services/api";
import { useNavigate, useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const query = useQuery();
  const token = query.get("token");

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    try {
      await API.post("/auth/reset-password", { token, newPassword: password });
      setMsg("Password reset! You can now log in.");
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg(err?.response?.data || "Failed to reset password.");
    }
  };

  if (!token) {
    return (
      <div className="container py-5 d-flex justify-content-center">
        <div className="alert alert-danger">Invalid or missing reset token.</div>
      </div>
    );
  }

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="bg-white p-4 rounded-4 shadow" style={{maxWidth: 400, width: "100%"}}>
        <div className="text-center mb-4">
          <i className="bi bi-key-fill fs-1 text-info"></i>
          <h4 className="fw-bold">Reset Password</h4>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            name="password"
            type="password"
            className="form-control mb-2"
            placeholder="Enter new password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button className="btn btn-info w-100" type="submit" disabled={success}>
            <i className="bi bi-arrow-repeat"></i> Reset Password
          </button>
        </form>
        {msg && <div className={`alert mt-3 ${success ? 'alert-success' : 'alert-info'}`}>{msg}</div>}
      </div>
    </div>
  );
}
