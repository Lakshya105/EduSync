import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    if (!role) {
      navigate("/login");
    } else {
      setRole(role);
      setName(name);
    }
  }, [navigate]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)"
      }}>
      <div className="container py-5">
        <motion.div
          className="p-5 rounded-4 shadow-lg bg-white bg-opacity-90"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4">
            <h2 className="fw-bold text-primary">
              Welcome {name ? name : "User"}!
            </h2>
            <span className={`badge ${role === "Instructor" ? "bg-success" : "bg-info"} ms-2`}>
              {role}
            </span>
          </div>
          <hr />
          <div className="row gy-4">
            {/* Courses Card */}
            <div className="col-12 col-md-6">
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="card border-0 shadow h-100 cursor-pointer"
                style={{
                  background: "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",
                  borderRadius: "1.5rem"
                }}
                onClick={() => navigate("/courses")}
              >
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-journal-bookmark-fill fs-2 text-primary me-3"></i>
                    <h5 className="card-title fw-bold mb-0">Courses</h5>
                  </div>
                  <p className="card-text text-secondary">
                    {role === "Student"
                      ? "Browse and enroll in available courses."
                      : "Manage courses you instruct."}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Analytics Card for Instructor */}
            {role === "Instructor" && (
              <div className="col-12 col-md-6">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  className="card border-0 shadow h-100 cursor-pointer"
                  style={{
                    background: "linear-gradient(120deg, #fbc2eb 0%, #a6c1ee 100%)",
                    borderRadius: "1.5rem"
                  }}
                  onClick={() => navigate("/instructor-analytics")}
                >
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-bar-chart-line fs-2 text-info me-3"></i>
                      <h5 className="card-title fw-bold mb-0">Analytics</h5>
                    </div>
                    <p className="card-text text-secondary">
                      View statistics, top students, and score insights for your assessments.
                    </p>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Assessments Card for Students */}
            {role === "Student" && (
              <div className="col-12 col-md-6">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  className="card border-0 shadow h-100 cursor-pointer"
                  style={{
                    background: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
                    borderRadius: "1.5rem"
                  }}
                  onClick={() => navigate("/assessments")}
                >
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-ui-checks fs-2 text-success me-3"></i>
                      <h5 className="card-title fw-bold mb-0">Assessments</h5>
                    </div>
                    <p className="card-text text-secondary">
                      View and attempt all your course assessments.
                    </p>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Results Card */}
            <div className="col-12 col-md-6">
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="card border-0 shadow h-100 cursor-pointer"
                style={{
                  background: "linear-gradient(120deg, #c2e9fb 0%, #e0c3fc 100%)",
                  borderRadius: "1.5rem"
                }}
                onClick={() => navigate("/results")}
              >
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-bar-chart-line-fill fs-2 text-info me-3"></i>
                    <h5 className="card-title fw-bold mb-0">Results</h5>
                  </div>
                  <p className="card-text text-secondary">
                    {role === "Student"
                      ? "View your assessment results."
                      : "Monitor your students' performance."}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Profile Card */}
            <div className="col-12 col-md-6">
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="card border-0 shadow h-100 cursor-pointer"
                style={{
                  background: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)",
                  borderRadius: "1.5rem"
                }}
                onClick={() => navigate("/profile")}
              >
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-person-circle fs-2 text-warning me-3"></i>
                    <h5 className="card-title fw-bold mb-0">Profile</h5>
                  </div>
                  <p className="card-text text-secondary">
                    View and update your account details.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
