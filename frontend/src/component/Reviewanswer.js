import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ReviewAnswer = () => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ correct: 0, wrong: 0, total: 0 });
  const { id, quizId } = useParams();
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${url}/reviewanswer/${id}/${quizId}`
        );
        setAnswers(res.data);
        
        // Calculate stats
        const correct = res.data.filter(ans => ans.is_correct).length;
        const wrong = res.data.length - correct;
        setStats({ correct, wrong, total: res.data.length });
      } catch (error) {
        console.error(error);
        setError("Failed to load quiz review data");
      } finally {
        setLoading(false);
      }
    };
    fetchAnswers();
  }, [id, quizId]);

  const handleBackToResults = () => {
    navigate(`/review/${id}/${quizId}`);
  };

  const getScorePercentage = () => {
    return stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="nexus-review-answer-container">
        <div className="nexus-review-loading">
          <div className="nexus-review-spinner"></div>
          <p>Loading your answer review...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nexus-review-answer-container">
        <div className="nexus-review-error">
          <div className="nexus-error-icon">⚠️</div>
          <h3>Unable to Load Review</h3>
          <p>{error}</p>
          <button onClick={handleBackToResults} className="nexus-back-btn">
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="nexus-review-answer-container">
      {/* Background Elements */}
      <div className="nexus-review-bg">
        <div className="nexus-review-particle nexus-particle-1"></div>
        <div className="nexus-review-particle nexus-particle-2"></div>
        <div className="nexus-review-particle nexus-particle-3"></div>
      </div>

      {/* Header */}
      <div className="nexus-review-header">
        <button onClick={handleBackToResults} className="nexus-review-back-btn">
          ← Back to Results
        </button>
        <div className="nexus-review-header-content">
          <h1 className="nexus-review-title">
            <span className="nexus-review-icon">🔍</span>
            Detailed Answer Review
          </h1>
          <p className="nexus-review-subtitle">
            Analyze your performance question by question
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="nexus-review-stats-card">
        <div className="nexus-stats-overview">
          <div className="nexus-stat-item nexus-stat-correct">
            <div className="nexus-stat-icon">✅</div>
            <div className="nexus-stat-content">
              <div className="nexus-stat-number">{stats.correct}</div>
              <div className="nexus-stat-label">Correct</div>
            </div>
          </div>
          
          <div className="nexus-stat-item nexus-stat-wrong">
            <div className="nexus-stat-icon">❌</div>
            <div className="nexus-stat-content">
              <div className="nexus-stat-number">{stats.wrong}</div>
              <div className="nexus-stat-label">Incorrect</div>
            </div>
          </div>
          
          <div className="nexus-stat-item nexus-stat-total">
            <div className="nexus-stat-icon">📊</div>
            <div className="nexus-stat-content">
              <div className="nexus-stat-number">{stats.total}</div>
              <div className="nexus-stat-label">Total Questions</div>
            </div>
          </div>
          
          <div className="nexus-stat-item nexus-stat-percentage">
            <div className="nexus-stat-icon">🎯</div>
            <div className="nexus-stat-content">
              <div className="nexus-stat-number">{getScorePercentage()}%</div>
              <div className="nexus-stat-label">Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Review */}
      <div className="nexus-review-content">
        {answers.length === 0 ? (
          <div className="nexus-no-answers">
            <div className="nexus-empty-icon">📝</div>
            <h3>No Answers Found</h3>
            <p>There are no answers to review for this quiz.</p>
            <button onClick={handleBackToResults} className="nexus-empty-btn">
              Back to Results
            </button>
          </div>
        ) : (
          <div className="nexus-answers-list">
            {answers.map((ans, index) => (
              <div 
                className={`nexus-answer-card ${
                  ans.is_correct ? 'nexus-card-correct' : 'nexus-card-wrong'
                }`} 
                key={ans.question_id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Question Header */}
                <div className="nexus-question-header">
                  <div className="nexus-question-number">Q{index + 1}</div>
                  <div className="nexus-question-marks">
                    <span className="nexus-marks-label">Worth:</span>
                    <span className="nexus-marks-value">{ans.marks} pts</span>
                  </div>
                  <div className={`nexus-status-badge ${
                    ans.is_correct ? 'nexus-status-correct' : 'nexus-status-wrong'
                  }`}>
                    {ans.is_correct ? '✅ Correct' : '❌ Incorrect'}
                  </div>
                </div>

                {/* Question Text */}
                <div className="nexus-question-content">
                  <h3 className="nexus-question-text">{ans.question_text}</h3>
                </div>

                {/* Answer Analysis */}
                <div className="nexus-answer-analysis">
                  <div className="nexus-answer-row">
                    <div className="nexus-answer-item nexus-your-answer">
                      <div className="nexus-answer-label">
                        <span className="nexus-answer-icon">👤</span>
                        Your Answer
                      </div>
                      <div className={`nexus-answer-value ${
                        ans.is_correct ? 'nexus-answer-correct-value' : 'nexus-answer-wrong-value'
                      }`}>
                        {ans.selected_option}
                      </div>
                    </div>

                    <div className="nexus-answer-item nexus-correct-answer">
                      <div className="nexus-answer-label">
                        <span className="nexus-answer-icon">✓</span>
                        Correct Answer
                      </div>
                      <div className="nexus-answer-value nexus-correct-answer-value">
                        {ans.correct_answer}
                      </div>
                    </div>
                  </div>

                  {/* Score Information */}
                  <div className="nexus-score-info">
                    <div className="nexus-score-earned">
                      <span className="nexus-score-label">Points Earned:</span>
                      <span className={`nexus-score-value ${
                        ans.marks_obtained > 0 ? 'nexus-score-positive' : 'nexus-score-zero'
                      }`}>
                        {ans.marks_obtained}/{ans.marks}
                      </span>
                    </div>
                  </div>

                  {/* Visual Feedback */}
                  {ans.is_correct ? (
                    <div className="nexus-feedback nexus-feedback-correct">
                      <div className="nexus-feedback-icon">🎉</div>
                      <div className="nexus-feedback-text">Great job! You got this one right.</div>
                    </div>
                  ) : (
                    <div className="nexus-feedback nexus-feedback-wrong">
                      <div className="nexus-feedback-icon">💡</div>
                      <div className="nexus-feedback-text">
                        Don't worry! Review this topic and you'll get it next time.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {answers.length > 0 && (
        <div className="nexus-review-footer">
          <div className="nexus-footer-summary">
            <h3>Review Complete!</h3>
            <p>
              You answered <strong>{stats.correct}</strong> out of <strong>{stats.total}</strong> questions correctly 
              for an accuracy rate of <strong>{getScorePercentage()}%</strong>
            </p>
            <div className="nexus-footer-actions">
              <button 
                onClick={() => navigate(`/quiz/${id}`)}
                className="nexus-more-quizzes-btn"
              >
                📚 More Quizzes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewAnswer;