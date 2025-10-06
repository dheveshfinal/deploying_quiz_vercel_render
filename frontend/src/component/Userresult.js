import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Userresult = () => {
  const { id, quizId } = useParams();
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${url}/userresult/${id}/${quizId}`
        );
        setResult(res.data);
      } catch (error) {
        setMessage(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id, quizId]);

  function reviewanswer(quizId, questionIds) {
    navigate(`/reviewanswer/${id}/${quizId}`, { state: { questionIds } });
  }

  const handleBackToReview = () => {
    navigate(`/review/${id}`);
  };

  const handleRetakeQuiz = async() => {
    if (!window.confirm("Retaking the quiz will delete your previous result. Continue?")) return;

  try {
    // Call backend to delete previous result
    await axios.delete(`${url}/userresult/${id}/${quizId}`);

    // Navigate to quiz page to retake
    navigate(`/useroption/${id}/${quizId}`);
  } catch (error) {
    alert(error.response?.data?.message || error.message);
  }
  };

  if (loading) {
    return (
      <div className="nexus-result-container">
        <div className="nexus-result-loading">
          <div className="nexus-result-spinner"></div>
          <p>Calculating your results...</p>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="nexus-result-container">
        <div className="nexus-result-error">
          <div className="nexus-error-icon">⚠️</div>
          <h3>Unable to Load Results</h3>
          <p className="nexus-error-message">{message}</p>
          <button onClick={handleBackToReview} className="nexus-back-btn-error">
            Back to Review
          </button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const percentage = ((result.total_score / result.total_marks) * 100).toFixed(2);
  
  let grade = "";
  let gradeColor = "";
  let gradeIcon = "";
  
  if (percentage < 50) {
    grade = "Needs Improvement";
    gradeColor = "#f44336";
    gradeIcon = "📚";
  } else if (percentage >= 50 && percentage < 75) {
    grade = "Good Progress";
    gradeColor = "#ff9800";
    gradeIcon = "⭐";
  } else if (percentage >= 75 && percentage <= 85) {
    grade = "Well Done";
    gradeColor = "#2196f3";
    gradeIcon = "🎯";
  } else if (percentage > 85) {
    grade = "Excellent";
    gradeColor = "#4caf50";
    gradeIcon = "🏆";
  }

  return (
    <div className="nexus-result-container">
      {/* Background Elements */}
      <div className="nexus-result-bg">
        <div className="nexus-result-circle nexus-circle-1"></div>
        <div className="nexus-result-circle nexus-circle-2"></div>
        <div className="nexus-result-circle nexus-circle-3"></div>
      </div>

      {/* Header */}
      <div className="nexus-result-header">
        <button onClick={handleBackToReview} className="nexus-result-back-btn">
          ← Back to Review
        </button>
        <h1 className="nexus-result-main-title">Quiz Results</h1>
      </div>

      {/* Main Result Card */}
      <div className="nexus-result-main-card">
        {/* Score Circle */}
        <div className="nexus-score-section">
          <div className="nexus-score-circle">
            <div className="nexus-score-inner">
              <div className="nexus-percentage">{percentage}%</div>
              <div className="nexus-score-text">
                {result.total_score}/{result.total_marks}
              </div>
            </div>
            <svg className="nexus-progress-ring" width="200" height="200">
              <circle
                className="nexus-progress-ring-bg"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="transparent"
                r="92"
                cx="100"
                cy="100"
              />
              <circle
                className="nexus-progress-ring-fill"
                stroke={gradeColor}
                strokeWidth="8"
                fill="transparent"
                r="92"
                cx="100"
                cy="100"
                strokeDasharray={`${2 * Math.PI * 92}`}
                strokeDashoffset={`${2 * Math.PI * 92 * (1 - percentage / 100)}`}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 2s ease-in-out',
                  transform: 'rotate(-90deg)',
                  transformOrigin: '100px 100px'
                }}
              />
            </svg>
          </div>
          
          <div className="nexus-grade-badge" style={{ background: `${gradeColor}20`, borderColor: gradeColor }}>
            <span className="nexus-grade-icon">{gradeIcon}</span>
            <span className="nexus-grade-text" style={{ color: gradeColor }}>
              {grade}
            </span>
          </div>
        </div>

        {/* Quiz Info */}
        <div className="nexus-quiz-info">
          <h2 className="nexus-quiz-title">{result.quiz_title}</h2>
          <p className="nexus-quiz-description">{result.quiz_description}</p>
          
          <div className="nexus-info-grid">
            <div className="nexus-info-item">
              <div className="nexus-info-icon">👤</div>
              <div className="nexus-info-content">
                <div className="nexus-info-label">Student</div>
                <div className="nexus-info-value">{result.user_name}</div>
              </div>
            </div>
            
            <div className="nexus-info-item">
              <div className="nexus-info-icon">📅</div>
              <div className="nexus-info-content">
                <div className="nexus-info-label">Submitted</div>
                <div className="nexus-info-value">
                  {new Date(result.submitted_at).toLocaleDateString()}
                </div>
                <div className="nexus-info-time">
                  {new Date(result.submitted_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="nexus-performance-card">
        <h3 className="nexus-performance-title">
          <span className="nexus-performance-icon">📊</span>
          Performance Analysis
        </h3>
        
        <div className="nexus-performance-grid">
          <div className="nexus-performance-stat">
            <div className="nexus-stat-icon nexus-stat-score">🎯</div>
            <div className="nexus-stat-content">
              <div className="nexus-stat-value">{result.total_score}</div>
              <div className="nexus-stat-label">Points Earned</div>
            </div>
          </div>
          
          <div className="nexus-performance-stat">
            <div className="nexus-stat-icon nexus-stat-total">📈</div>
            <div className="nexus-stat-content">
              <div className="nexus-stat-value">{result.total_marks}</div>
              <div className="nexus-stat-label">Total Points</div>
            </div>
          </div>
          
          <div className="nexus-performance-stat">
            <div className="nexus-stat-icon nexus-stat-percentage">🔥</div>
            <div className="nexus-stat-content">
              <div className="nexus-stat-value">{percentage}%</div>
              <div className="nexus-stat-label">Success Rate</div>
            </div>
          </div>
          
          <div className="nexus-performance-stat">
            <div className="nexus-stat-icon nexus-stat-grade">{gradeIcon}</div>
            <div className="nexus-stat-content">
              <div className="nexus-stat-value" style={{ color: gradeColor }}>
                {grade}
              </div>
              <div className="nexus-stat-label">Grade</div>
            </div>
          </div>
        </div>

        {/* Performance Bar */}
        <div className="nexus-performance-bar-container">
          <div className="nexus-performance-bar">
            <div 
              className="nexus-performance-bar-fill"
              style={{ 
                width: `${percentage}%`,
                background: `linear-gradient(90deg, ${gradeColor}, ${gradeColor}aa)`
              }}
            ></div>
          </div>
          <div className="nexus-performance-labels">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="nexus-action-section">
        <div className="nexus-action-grid">
          <button 
            onClick={() => reviewanswer(quizId, result.question_ids)}
            className="nexus-action-btn nexus-review-btn"
          >
            <span className="nexus-btn-icon">🔍</span>
            <div className="nexus-btn-content">
              <div className="nexus-btn-title">Review Answers</div>
              <div className="nexus-btn-subtitle">See detailed breakdown</div>
            </div>
          </button>
          
          <button 
            onClick={handleRetakeQuiz}
            className="nexus-action-btn nexus-retake-btn"
          >
            <span className="nexus-btn-icon">🔄</span>
            <div className="nexus-btn-content">
              <div className="nexus-btn-title">Retake Quiz</div>
              <div className="nexus-btn-subtitle">Improve your score</div>
            </div>
          </button>
          
          <button 
            onClick={() => navigate(`/quiz/${id}`)}
            className="nexus-action-btn nexus-more-btn"
          >
            <span className="nexus-btn-icon">📚</span>
            <div className="nexus-btn-content">
              <div className="nexus-btn-title">More Quizzes</div>
              <div className="nexus-btn-subtitle">Continue learning</div>
            </div>
          </button>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="nexus-motivation-card">
        <div className="nexus-motivation-content">
          {percentage >= 85 ? (
            <>
              <div className="nexus-motivation-icon">🎉</div>
              <h4>Outstanding Performance!</h4>
              <p>You've mastered this topic brilliantly. Keep up the excellent work!</p>
            </>
          ) : percentage >= 75 ? (
            <>
              <div className="nexus-motivation-icon">👏</div>
              <h4>Great Job!</h4>
              <p>You're doing well! A little more practice and you'll be a master.</p>
            </>
          ) : percentage >= 50 ? (
            <>
              <div className="nexus-motivation-icon">💪</div>
              <h4>Good Progress!</h4>
              <p>You're on the right track. Review your answers and try again to improve.</p>
            </>
          ) : (
            <>
              <div className="nexus-motivation-icon">🌱</div>
              <h4>Keep Learning!</h4>
              <p>Every expert was once a beginner. Review the material and try again!</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Userresult;