import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AddQuizQuestionRow = () => {
  const navigate = useNavigate();
  const { quizid } = useParams(); // ✅ get quiz id from URL
  const url = process.env.REACT_APP_API_URL || "http://localhost:8000";
  // Form state
  const [formData, setFormData] = useState({
    question_text: "",
    question_type: "MCQ",
    marks: "",
    correct_answer: "",
    options: "", // for MCQ/MSQ comma separated
  });

  const [isLoading, setIsLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert options string to array if MCQ or MSQ
      const optionsArray =
        formData.question_type === "MCQ" || formData.question_type === "MSQ"
          ? formData.options.split(",").map((opt) => opt.trim())
          : [];

      // Send data to backend
      await axios.post(`${url}/addquestionrow/${quizid}`, {
        question_text: formData.question_text,
        question_type: formData.question_type,
        marks: formData.marks,
        correct_answer: formData.correct_answer,
        options: optionsArray,
      });

      alert("Question added successfully!");
      navigate(`/add_quiz/${quizid}`); // go back to quiz questions list
    } catch (err) {
      console.error("Error adding question:", err);
      alert("Failed to add question.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(`/add_quiz/${quizid}`);
  };

  return (
    <div className="add-question-row-container">
      <div className="add-question-row-background">
        <div className="add-question-row-floating-shapes">
          <div className="add-question-row-shape add-question-row-shape-1"></div>
          <div className="add-question-row-shape add-question-row-shape-2"></div>
          <div className="add-question-row-shape add-question-row-shape-3"></div>
          <div className="add-question-row-shape add-question-row-shape-4"></div>
        </div>
      </div>

      <div className="add-question-row-content">
        <div className="add-question-row-header">
          <h2 className="add-question-row-title">
            <span className="add-question-row-title-icon">✨</span>
            Create New Quiz Question
          </h2>
          <p className="add-question-row-subtitle">
            Design engaging questions to challenge your learners
          </p>
        </div>

        <div className="add-question-row-form-wrapper">
          <form onSubmit={handleSubmit} className="add-question-row-form">
            <div className="add-question-row-field-group">
              <label className="add-question-row-label">
                <span className="add-question-row-label-text">Question Text</span>
                <span className="add-question-row-required">*</span>
              </label>
              <div className="add-question-row-input-wrapper">
                <textarea
                  name="question_text"
                  value={formData.question_text}
                  onChange={handleChange}
                  required
                  className="add-question-row-textarea"
                  placeholder="Enter your question here..."
                  rows="3"
                />
              </div>
            </div>

            <div className="add-question-row-field-group">
              <label className="add-question-row-label">
                <span className="add-question-row-label-text">Question Type</span>
                <span className="add-question-row-required">*</span>
              </label>
              <div className="add-question-row-input-wrapper">
                <select
                  name="question_type"
                  value={formData.question_type}
                  onChange={handleChange}
                  className="add-question-row-select"
                >
                  <option value="MCQ">Multiple Choice (Single Answer)</option>
                  <option value="MSQ">Multiple Choice (Multiple Answers)</option>
                  <option value="True/False">True/False</option>
                </select>
                <div className="add-question-row-select-icon">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="add-question-row-field-group">
              <label className="add-question-row-label">
                <span className="add-question-row-label-text">Marks</span>
                <span className="add-question-row-required">*</span>
              </label>
              <div className="add-question-row-input-wrapper">
                <input
                  type="number"
                  name="marks"
                  value={formData.marks}
                  onChange={handleChange}
                  required
                  className="add-question-row-input"
                  placeholder="Enter marks (e.g., 5)"
                  min="1"
                />
                <div className="add-question-row-input-icon">
                  <span>🏆</span>
                </div>
              </div>
            </div>

            {/* Show options input for MCQ or MSQ */}
            {(formData.question_type === "MCQ" || formData.question_type === "MSQ") && (
              <div className="add-question-row-field-group add-question-row-options-field">
                <label className="add-question-row-label">
                  <span className="add-question-row-label-text">Answer Options</span>
                  <span className="add-question-row-required">*</span>
                </label>
                <div className="add-question-row-input-wrapper">
                  <textarea
                    name="options"
                    value={formData.options}
                    onChange={handleChange}
                    placeholder="Enter options separated by commas&#10;e.g. Option A, Option B, Option C, Option D"
                    className="add-question-row-textarea add-question-row-options-textarea"
                    rows="3"
                  />
                </div>
                <div className="add-question-row-field-hint">
                  <span className="add-question-row-hint-icon">💡</span>
                  Separate each option with a comma for better organization
                </div>
              </div>
            )}

            <div className="add-question-row-field-group">
              <label className="add-question-row-label">
                <span className="add-question-row-label-text">Correct Answer</span>
                <span className="add-question-row-required">*</span>
              </label>
              <div className="add-question-row-input-wrapper">
                <input
                  type="text"
                  name="correct_answer"
                  value={formData.correct_answer}
                  onChange={handleChange}
                  placeholder={
                    formData.question_type === "MSQ" 
                      ? "For multiple answers, separate by commas" 
                      : "Enter the correct answer"
                  }
                  required
                  className="add-question-row-input"
                />
                <div className="add-question-row-input-icon">
                  <span>✓</span>
                </div>
              </div>
              {formData.question_type === "MSQ" && (
                <div className="add-question-row-field-hint">
                  <span className="add-question-row-hint-icon">ℹ️</span>
                  For multiple correct answers, separate them with commas
                </div>
              )}
            </div>

            <div className="add-question-row-form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="add-question-row-btn add-question-row-btn-cancel"
                disabled={isLoading}
              >
                <span className="add-question-row-btn-icon">↩</span>
                Cancel
              </button>
              <button
                type="submit"
                className="add-question-row-btn add-question-row-btn-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="add-question-row-spinner"></div>
                    Adding Question...
                  </>
                ) : (
                  <>
                    <span className="add-question-row-btn-icon">✨</span>
                    Add Question
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddQuizQuestionRow;