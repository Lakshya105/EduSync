import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserRole } from "../../utils/auth";

export default function Navbar({ isLoggedIn, onLogout }) {
  const role = getUserRole();
  const name = localStorage.getItem("name") || "User";
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark"
      style={{
        background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
        boxShadow: "0 2px 12px rgba(50,50,93,0.1)"
      }}
    >
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span className="fw-bold fs-4 me-2">EduSync</span>
          <span className="badge bg-light text-primary rounded-pill">LMS</span>
        </Link>
        {isLoggedIn && (
          <>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="mainNavbar">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/courses">Courses</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/results">Results</Link>
                </li>
              </ul>
              <div className="d-flex align-items-center">
                {/* Welcome message */}
                <span className="text-white me-3 fw-bold fs-5">
                  Welcome {name}!
                </span>
                {/* User role badge */}
                <span className={`badge me-3 ${role === "Instructor" ? "bg-success" : "bg-info"}`}>{role}</span>
                <button className="btn btn-outline-light me-2"
                  onClick={() => navigate("/profile")}>
                  <i className="bi bi-person"></i> Profile
                </button>
                <button className="btn btn-danger"
                  onClick={onLogout}>
                  <i className="bi bi-box-arrow-right"></i> Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
