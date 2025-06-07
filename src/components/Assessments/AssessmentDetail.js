import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import { getUserRole } from "../../utils/auth";

export default function AssessmentDetail() {
  const { assessmentId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const userRole = getUserRole();

  useEffect(() => {
    const checkAttemptStatus = async () => {
      if (userRole === "Student" && assessmentId) {
        try {
          const res = await API.get(`/assessments/${assessmentId}/attempt-status`);
          setAlreadyAttempted(!!res.data.attempted);
        } catch {
          setAlreadyAttempted(false);
        }
      }
    };
    checkAttemptStatus();
  }, [assessmentId, userRole]);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await API.get(`/assessments/${assessmentId}`);
        setAssessment(response.data);
      } catch (err) {
        setError(
          err.response && err.response.status === 404
            ? "Assessment not found (404)."
            : "Failed to load assessment. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      fetchAssessment();
    }
  }, [assessmentId]);

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (Object.keys(userAnswers).length !== assessment.questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }
    try {
      const response = await API.post(`/assessments/${assessmentId}/attempt`, {
        answers: userAnswers
      });
      setScore(response.data.score);
      setSubmitted(true);
    } catch {
      setError("Failed to submit assessment. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">Loading assessment...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (alreadyAttempted && userRole === "Student") {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          You have already submitted this assessment.
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">Assessment not found.</div>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{maxWidth: 700}}>
      <div className="bg-white rounded-4 shadow-sm p-4">
        <h4 className="fw-bold mb-3">{assessment.title}</h4>
        {assessment.description && <p>{assessment.description}</p>}
        {userRole === "Student" && !submitted ? (
          <form onSubmit={handleSubmit}>
            {assessment.questions?.map((question, index) => (
              <div key={question.questionId} className="card mb-3 border-0 shadow-sm">
                <div className="card-body">
                  <h6 className="mb-2 fw-bold">Q{index + 1}: {question.questionText}</h6>
                  <div className="row">
                    {["A", "B", "C", "D"].map(option => (
                      <div className="col-12 col-md-6 mb-2" key={option}>
                        <label className="form-check-label w-100">
                          <input
                            type="radio"
                            name={`question_${question.questionId}`}
                            value={option}
                            checked={userAnswers[question.questionId] === option}
                            onChange={() => handleAnswerChange(question.questionId, option)}
                            className="form-check-input me-2"
                          />
                          <span className="">{question[`option${option}`]}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <button type="submit" className="btn btn-success w-100 mb-2">
              <i className="bi bi-send"></i> Submit Assessment
            </button>
            {error && <div className="alert alert-info">{error}</div>}
          </form>
        ) : (
          <div>
            {score !== null && (
              <div className="alert alert-info">
                <strong>Your score:</strong> {score}/{assessment.maxScore}
              </div>
            )}
            {userRole === "Instructor" && (
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="fw-bold">Assessment Details</h5>
                  <p><strong>Max Score:</strong> {assessment.maxScore}</p>
                  <h6 className="mt-3">Questions:</h6>
                  {assessment.questions?.map((question, index) => (
                    <div key={question.questionId} className="mb-3">
                      <p><strong>Q{index + 1}:</strong> {question.questionText}</p>
                      <ul className="list-unstyled ms-3 mb-1">
                        <li>A: {question.optionA}</li>
                        <li>B: {question.optionB}</li>
                        <li>C: {question.optionC}</li>
                        <li>D: {question.optionD}</li>
                        <li className="fw-bold">Correct: {question.correctOption}</li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
