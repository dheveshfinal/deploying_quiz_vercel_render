import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Userquiz = () => {
  const { id } = useParams(); // userId from route
  const [userquiz, setUserquiz] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchUserQuiz = async () => {
      try {
        setLoading(true);
        // Fetch quizzes available for the user
        const res = await axios.get(`${url}/userquiz`);
        setUserquiz(res.data);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserQuiz();
  }, [id]);

  const handleResult = (quizId) => {
    // Navigate to result page passing both userId and quizId
    navigate(`/review/${id}/${quizId}`);
  };

  const handleBackToDashboard = () => {
    navigate(`/dashboard1/${id}`);
  };

  if (loading) {
    return (
      <div className="nexus-review-container">
        <div className="nexus-review-loading">
          <div className="nexus-review-spinner"></div>
          <p>Loading your quiz results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nexus-review-container">
      {/* Background Elements */}
      <div className="nexus-review-bg-elements">
        <div className="nexus-review-particle nexus-particle-1"></div>
        <div className="nexus-review-particle nexus-particle-2"></div>
        <div className="nexus-review-particle nexus-particle-3"></div>
        <div className="nexus-review-particle nexus-particle-4"></div>
      </div>

      {/* Header */}
      <div className="nexus-review-header">
        <button onClick={handleBackToDashboard} className="nexus-review-back-btn">
          <span>← Dashboard</span>
        </button>
        
        <div className="nexus-review-header-content">
          <h1 className="nexus-review-title">
            <span className="nexus-review-icon">📊</span>
            Quiz Results Center
          </h1>
          <p className="nexus-review-subtitle">
            Review your performance and track your progress
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="nexus-review-stats">
        <div className="nexus-stat-item">
          <div className="nexus-stat-value">{userquiz.length}</div>
          <div className="nexus-stat-label">Available Quizzes</div>
        </div>
        <div className="nexus-stat-item">
          <div className="nexus-stat-value">📈</div>
          <div className="nexus-stat-label">Track Progress</div>
        </div>
        <div className="nexus-stat-item">
          <div className="nexus-stat-value">🎯</div>
          <div className="nexus-stat-label">View Scores</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="nexus-review-content">
        {message ? (
          <div className="nexus-review-error">
            <div className="nexus-error-icon">⚠️</div>
            <h3>Unable to load quiz results</h3>
            <p className="nexus-error-message">{message}</p>
            <button onClick={() => window.location.reload()} className="nexus-retry-btn">
              Retry Loading
            </button>
          </div>
        ) : (
          <div className="nexus-review-grid">
            {userquiz.length === 0 ? (
              <div className="nexus-empty-results">
                <div className="nexus-empty-icon">📚</div>
                <h3>No Quiz Results Available</h3>
                <p>Take some quizzes first to see your results here!</p>
                <button 
                  onClick={() => navigate(`/quiz/${id}`)} 
                  className="nexus-take-quiz-btn"
                >
                  Take Your First Quiz
                </button>
              </div>
            ) : (
              userquiz.map((quiz, index) => (
                <div 
                  key={quiz.id} 
                  className="nexus-quiz-result-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Card Header */}
                  <div className="nexus-card-header">
                    <div className="nexus-quiz-number">#{index + 1}</div>
                    <div className="nexus-quiz-status-badge">
                      <span className="nexus-status-dot"></span>
                      Available
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="nexus-card-content">
                    <h3 className="nexus-quiz-title">{quiz.title}</h3>
                    <p className="nexus-quiz-description">{quiz.description}</p>
                    
                    {/* Quiz Stats */}
                    <div className="nexus-quiz-stats">
                      <div className="nexus-quiz-stat">
                        <span className="nexus-stat-icon">📝</span>
                        <span className="nexus-stat-text">Quiz Results</span>
                      </div>
                      <div className="nexus-quiz-stat">
                        <span className="nexus-stat-icon">⏱️</span>
                        <span className="nexus-stat-text">Performance Data</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="nexus-card-footer">
                    <button 
                      onClick={() => handleResult(quiz.id)}
                      className="nexus-view-result-btn"
                    >
                      <span className="nexus-btn-icon">📊</span>
                      <span>View Detailed Results</span>
                      <div className="nexus-btn-arrow">→</div>
                    </button>
                  </div>

                  {/* Card Shine Effect */}
                  <div className="nexus-card-shine"></div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {userquiz.length > 0 && (
        <div className="nexus-review-footer">
          <div className="nexus-footer-content">
            <h3>Ready for More Challenges?</h3>
            <p>Continue your learning journey with new quizzes</p>
            <button 
              onClick={() => navigate(`/quiz/${id}`)} 
              className="nexus-new-quiz-btn"
            >
              <span>🚀 Take Another Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Userquiz;