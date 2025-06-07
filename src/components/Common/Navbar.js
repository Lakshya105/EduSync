import { Link } from "react-router-dom";

export default function Navbar({ isLoggedIn, onLogout }) {
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name") || "User";

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-3">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          EduSync
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    <i className="bi bi-house-door"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/courses" className="nav-link">
                    <i className="bi bi-journal-bookmark"></i> Courses
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/results" className="nav-link">
                    <i className="bi bi-bar-chart-line"></i> Results
                  </Link>
                </li>
                {/* Student: My Progress */}
                {role === "Student" && (
                  <li className="nav-item">
                    <Link to="/my-progress" className="nav-link">
                      <i className="bi bi-graph-up"></i> My Progress
                    </Link>
                  </li>
                )}
                {/* Instructor: User Management */}
                {role === "Instructor" && (
                  <li className="nav-item">
                    <Link to="/user-management" className="nav-link">
                      <i className="bi bi-people"></i> Manage Users
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link to="/profile" className="nav-link">
                    <i className="bi bi-person-circle"></i> Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={onLogout}>
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </button>
                </li>
                <li className="nav-item">
                  <span className="badge bg-primary ms-2">{name}</span>
                </li>
              </>
            )}
            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
