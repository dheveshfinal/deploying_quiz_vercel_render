import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Useroption = () => {
  const { id, quizId } = useParams(); // ✅ both userId & quizId
  const [questions, setQuestions] = useState([]);
  const [message, setMessage] = useState("");
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${url}/userquestion/${quizId}`);
        const optionRes = await axios.get(`${url}/optionquestion`);

        const questionsWithOptions = res.data.map((q) => ({
          ...q,
          options: optionRes.data
            .filter((opt) => opt.question_id === q.id)
            .map((o) => o.option_text),
        }));

        setQuestions(questionsWithOptions);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quizId]);

  const handleOptionChange = (qId, option) => {
    setAnswers({ ...answers, [qId]: option });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${url}/submitanswers`, {
        userId: id,
        quizId: quizId,
        answers,
      });
      alert("✅ Your answers have been submitted!");
      navigate(`/review/${id}/${quizId}`);
    } catch (error) {
      alert("❌ Failed to submit answers: " + error.message);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const getProgressPercentage = () => {
    return questions.length > 0 ? (getAnsweredCount() / questions.length) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="nexus-quiz-take-container">
        <div className="nexus-quiz-loading">
          <div className="nexus-quiz-spinner"></div>
          <p>Loading your quiz...</p>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="nexus-quiz-take-container">
        <div className="nexus-quiz-error">
          <div className="nexus-error-icon">⚠️</div>
          <h3>Unable to load quiz</h3>
          <p>{message}</p>
          <button onClick={() => navigate(`/quiz/${id}`)} className="nexus-back-btn-error">
            Back to Quiz Selection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="nexus-quiz-take-container">
      {/* Background Elements */}
      <div className="nexus-quiz-bg-pattern"></div>
      
      {/* Header */}
      <div className="nexus-quiz-take-header">
        <button 
          onClick={() => navigate(`/quiz/${id}`)} 
          className="nexus-quiz-back-btn"
        >
          ← Back to Quizzes
        </button>
        
        <div className="nexus-quiz-progress-info">
          <h1 className="nexus-quiz-take-title">Quiz Challenge</h1>
          <div className="nexus-progress-stats">
            <span className="nexus-question-counter">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="nexus-answered-counter">
              {getAnsweredCount()}/{questions.length} Answered
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="nexus-progress-container">
        <div className="nexus-progress-bar">
          <div 
            className="nexus-progress-fill" 
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <span className="nexus-progress-text">
          {Math.round(getProgressPercentage())}% Complete
        </span>
      </div>

      {/* Question Navigation */}
      <div className="nexus-question-nav">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestion(index)}
            className={`nexus-question-nav-btn ${
              index === currentQuestion ? 'nexus-nav-active' : ''
            } ${
              answers[questions[index]?.id] ? 'nexus-nav-answered' : 'nexus-nav-unanswered'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Main Quiz Content */}
      {questions.length > 0 && (
        <div className="nexus-quiz-main-content">
          <div className="nexus-question-card">
            <div className="nexus-question-header">
              <div className="nexus-question-info">
                <span className="nexus-question-number">Q{currentQuestion + 1}</span>
                <span className="nexus-question-marks">
                  🏆 {questions[currentQuestion].marks} marks
                </span>
              </div>
            </div>

            <div className="nexus-question-content">
              <h2 className="nexus-question-text">
                {questions[currentQuestion].question_text}
              </h2>

              <div className="nexus-options-container">
                {questions[currentQuestion].options && questions[currentQuestion].options.length > 0 ? (
                  questions[currentQuestion].options.map((opt, i) => (
                    <label
                      key={i}
                      className={`nexus-option-label ${
                        answers[questions[currentQuestion].id] === opt ? 'nexus-option-selected' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${questions[currentQuestion].id}`}
                        value={opt}
                        checked={answers[questions[currentQuestion].id] === opt}
                        onChange={() => handleOptionChange(questions[currentQuestion].id, opt)}
                        className="nexus-option-input"
                      />
                      <div className="nexus-option-content">
                        <span className="nexus-option-letter">{String.fromCharCode(65 + i)}</span>
                        <span className="nexus-option-text">{opt}</span>
                      </div>
                      <div className="nexus-option-checkmark">✓</div>
                    </label>
                  ))
                ) : (
                  <div className="nexus-no-options">
                    <p>No options available for this question</p>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="nexus-question-navigation">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                className="nexus-nav-btn nexus-prev-btn"
              >
                ← Previous
              </button>

              <div className="nexus-nav-center">
                <span className="nexus-question-status">
                  {answers[questions[currentQuestion].id] ? 
                    <span className="nexus-answered">✓ Answered</span> : 
                    <span className="nexus-unanswered">○ Not answered</span>
                  }
                </span>
              </div>

              <button
                onClick={handleNextQuestion}
                disabled={currentQuestion === questions.length - 1}
                className="nexus-nav-btn nexus-next-btn"
              >
                Next →
              </button>
            </div>
          </div>

          {/* Submit Section */}
          <div className="nexus-submit-section">
            <div className="nexus-submit-summary">
              <h3>Ready to submit?</h3>
              <p>
                You've answered <strong>{getAnsweredCount()}</strong> out of <strong>{questions.length}</strong> questions.
                {getAnsweredCount() < questions.length && (
                  <span className="nexus-warning">
                    <br />⚠️ You have {questions.length - getAnsweredCount()} unanswered questions.
                  </span>
                )}
              </p>
            </div>
            
            <button
              onClick={() => setShowConfirmDialog(true)}
              className="nexus-submit-quiz-btn"
            >
              🚀 Submit Quiz
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="nexus-modal-overlay">
          <div className="nexus-confirm-dialog">
            <h3>Confirm Submission</h3>
            <p>
              Are you sure you want to submit your quiz?<br />
              <strong>Answered: {getAnsweredCount()}/{questions.length} questions</strong>
            </p>
            <div className="nexus-dialog-actions">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="nexus-cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="nexus-confirm-submit-btn"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Useroption;