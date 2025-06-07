import React, { useState } from "react";
import API from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";

export default function AssessmentCreate() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    maxScore: "",
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "A"
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // Functional update ensures the latest state is used!
  const addQuestion = () => {
    if (
      !currentQuestion.questionText ||
      !currentQuestion.optionA ||
      !currentQuestion.optionB ||
      !currentQuestion.optionC ||
      !currentQuestion.optionD ||
      !currentQuestion.correctOption
    ) {
      setError("Please fill out all fields for the question.");
      return;
    }
    setForm(prevForm => ({
      ...prevForm,
      questions: [...prevForm.questions, { ...currentQuestion }]
    }));
    setCurrentQuestion({
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctOption: "A"
    });
    setError(""); // clear any previous error
    setMsg("");   // clear submit message too
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    if (form.questions.length === 0) {
      setError("Please add at least one question.");
      return;
    }
    try {
      await API.post("/assessments", {
        title: form.title,
        maxScore: Number(form.maxScore),
        courseId: courseId,
        questions: form.questions
      });
      setMsg("Assessment created!");
      setTimeout(() => navigate(`/courses/${courseId}`), 1200);
    } catch (err) {
      let message = "Failed to create assessment.";
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === "string") message = data;
        else if (data.title) message = data.title;
        else if (data.errors) message = Object.values(data.errors).flat().join(", ");
      }
      setError(message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 650 }}>
      <h3>Create MCQ Assessment</h3>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          className="form-control mb-2"
          placeholder="Assessment Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="maxScore"
          className="form-control mb-2"
          type="number"
          placeholder="Max Score"
          min={1}
          value={form.maxScore}
          onChange={handleChange}
          required
        />

        <hr />
        <h5>Add MCQ Question</h5>
        <input
          name="questionText"
          className="form-control mb-2"
          placeholder="Question"
          value={currentQuestion.questionText}
          onChange={handleQuestionChange}
        />
        <input
          name="optionA"
          className="form-control mb-2"
          placeholder="Option A"
          value={currentQuestion.optionA}
          onChange={handleQuestionChange}
        />
        <input
          name="optionB"
          className="form-control mb-2"
          placeholder="Option B"
          value={currentQuestion.optionB}
          onChange={handleQuestionChange}
        />
        <input
          name="optionC"
          className="form-control mb-2"
          placeholder="Option C"
          value={currentQuestion.optionC}
          onChange={handleQuestionChange}
        />
        <input
          name="optionD"
          className="form-control mb-2"
          placeholder="Option D"
          value={currentQuestion.optionD}
          onChange={handleQuestionChange}
        />
        <div className="mb-2">
          <label><b>Correct Option:</b></label>
          <select
            name="correctOption"
            className="form-select"
            value={currentQuestion.correctOption}
            onChange={handleQuestionChange}
            required
            style={{ maxWidth: 150 }}
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={addQuestion}
        >
          Add Question
        </button>

        <ul className="list-group mb-3">
          {form.questions.map((q, idx) => (
            <li key={idx} className="list-group-item">
              <b>Q{idx + 1}.</b> {q.questionText} &nbsp;
              <span className="text-muted">
                (A: {q.optionA} | B: {q.optionB} | C: {q.optionC} | D: {q.optionD} | Correct: <b>{q.correctOption}</b>)
              </span>
            </li>
          ))}
        </ul>

        <button
          className="btn btn-success w-100"
          type="submit"
          disabled={form.questions.length === 0}
        >
          Create Assessment
        </button>
      </form>
      {error && (
        <div className="alert alert-info mt-3">{error}</div>
      )}
      {msg && (
        <div className="alert alert-success mt-3">{msg}</div>
      )}
    </div>
  );
}
