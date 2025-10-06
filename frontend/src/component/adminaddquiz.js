import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddQuiz = () => {
  const [addQuiz, setAddQuiz] = useState({ 
    title: "", 
    description: "", 
    Status: "offline" 
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL || "http://localhost:8000";

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddQuiz({ ...addQuiz, [name]: value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await axios.post(`${url}/AddData`, addQuiz);
      setMessage(res.data.message || "Quiz added successfully!");
      
      // Clear form after successful submission
      setAddQuiz({ title: "", description: "", Status: "offline" });
      
      // Auto navigate after 2 seconds
      setTimeout(() => {
        navigate("/quiz-management");
      }, 2000);
      
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || "Failed to add quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="addQuizContainer">
      {/* Floating Background Elements */}
      <div className="addQuizFloatingElements">
        <div className="addQuizFloatingElement"></div>
        <div className="addQuizFloatingElement"></div>
        <div className="addQuizFloatingElement"></div>
      </div>

      <div className="addQuizWrapper">
        <div className="addQuizCard">
          <h1 className="addQuizTitle">Create New Quiz</h1>
          <p className="addQuizSubtitle">Build an engaging quiz for your audience</p>
          
          {message && (
            <div className="addQuizAlert">
              ✅ {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="addQuizForm">
            <div className="addQuizFieldGroup">
              <label htmlFor="title" className="addQuizLabel">
                Quiz Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={addQuiz.title}
                onChange={handleChange}
                className="addQuizInput"
                placeholder="Enter an engaging quiz title..."
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="addQuizFieldGroup">
              <label htmlFor="description" className="addQuizLabel">
                Quiz Description
              </label>
              <textarea
                id="description"
                name="description"
                value={addQuiz.description}
                onChange={handleChange}
                className="addQuizTextarea"
                placeholder="Describe what this quiz is about..."
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="addQuizFieldGroup">
              <label htmlFor="status" className="addQuizLabel">
                Quiz Status
              </label>
              <div className="addQuizStatusGroup">
                <select 
                  id="status"
                  name="Status" 
                  value={addQuiz.Status} 
                  onChange={handleChange}
                  className="addQuizSelect"
                  disabled={isSubmitting}
                >
                  <option value="online">🟢 Online - Visible to users</option>
                  <option value="offline">🔴 Offline - Hidden from users</option>
                </select>
              </div>
            </div>

            <div className="addQuizButtonGroup">
              <button 
                type="button"
                onClick={handleCancel}
                className="addQuizCancelButton"
                disabled={isSubmitting}
              >
                ← Cancel
              </button>
              <button 
                type="submit" 
                className="addQuizSubmitButton"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Quiz..." : "🚀 Create Quiz"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddQuiz;