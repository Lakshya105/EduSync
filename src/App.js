import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Navbar from "./components/Common/Navbar";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import ForgotPasswordPage from "./components/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./components/Auth/ResetPasswordPage";
import ProfilePage from "./components/ProfilePage";
import CoursesList from "./components/Courses/CoursesList";
import MyCourses from "./components/Courses/MyCourses";
import ResultsPage from "./components/Results/ResultsPage";
import EnrolledStudents from "./components/Instructor/EnrolledStudents";
import CourseCreate from "./components/Courses/CourseCreate";
import CourseDetail from "./components/Courses/CourseDetail";
import AssessmentCreate from "./components/Assessments/AssessmentCreate";
import AssessmentDetail from "./components/Assessments/AssessmentDetail";
import StudentAssessments from "./components/Assessments/StudentAssessments";
import CourseEdit from "./components/Courses/CourseEdit";
import AssessmentAnalytics from "./components/Analytics/AssessmentAnalytics";
import StudentProgress from "./components/Analytics/StudentProgress";
import InstructorAnalytics from "./components/Analytics/InstructorAnalytics";
import UserManagement from "./components/Admin/UserManagement";

function isTokenValid() {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isTokenValid());

  const handleLogin = () => setIsLoggedIn(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location = "/login";
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route
          path="/login"
          element={!isLoggedIn ? <LoginPage onLogin={handleLogin} /> : <Dashboard />}
        />
        <Route
          path="/register"
          element={!isLoggedIn ? <RegisterPage /> : <Dashboard />}
        />
        <Route
          path="/forgot-password"
          element={!isLoggedIn ? <ForgotPasswordPage /> : <Dashboard />}
        />
        <Route
          path="/reset-password"
          element={!isLoggedIn ? <ResetPasswordPage /> : <Dashboard />}
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/"
          element={isLoggedIn ? <Dashboard /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <ProfilePage /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/user-management"
          element={isLoggedIn && localStorage.getItem("role") === "Instructor" ? <UserManagement /> : <Dashboard />}
        />
        <Route
          path="/courses"
          element={isLoggedIn ? <CoursesList /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/courses/create"
          element={isLoggedIn ? <CourseCreate /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/courses/:id"
          element={isLoggedIn ? <CourseDetail /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/courses/:courseId/edit"
          element={isLoggedIn ? <CourseEdit /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/assessments"
          element={isLoggedIn ? <StudentAssessments /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/instructor-analytics"
          element={isLoggedIn ? <InstructorAnalytics /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/assessments/:assessmentId"
          element={isLoggedIn ? <AssessmentDetail /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/courses/:courseId/assessments/create"
          element={isLoggedIn ? <AssessmentCreate /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/courses/:courseId/assessments/:assessmentId"
          element={isLoggedIn ? <AssessmentDetail /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/assessments/:assessmentId/analytics"
          element={isLoggedIn ? <AssessmentAnalytics /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route 
          path="/my-progress"
          element={<StudentProgress />} 
        />
        <Route
          path="/my-courses"
          element={isLoggedIn ? <MyCourses /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/results"
          element={isLoggedIn ? <ResultsPage /> : <LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/enrolled-students"
          element={isLoggedIn ? <EnrolledStudents /> : <LoginPage onLogin={handleLogin} />}
        />
        {/* ...add any more protected routes here */}
      </Routes>
    </>
  );
}
