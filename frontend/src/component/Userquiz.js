import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Userquiz = () => {
  const { id } = useParams(); // ✅ userId from route
  const [userquiz, setUserquiz] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchUserQuiz = async () => {
      try {
        setLoading(true);
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

  const handleSelect = (quizId, status) => {
    if (status.toLowerCase() === "offline") {
      alert("❌ Access denied: Quiz is offline");
      return;
    }
    // ✅ Navigate to quiz option page if online
    navigate(`/useroption/${id}/${quizId}`);
  };

  const handleBackToDashboard = () => {
    navigate(`/dashboard1/${id}`);
  };

  if (loading) {
    return (
      <div className="nexus-quiz-container">
        <div className="nexus-loading-spinner">
          <div className="nexus-spinner"></div>
          <p>Loading amazing quizzes for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nexus-quiz-container">
      {/* Background Elements */}
      <div className="nexus-quiz-bg-elements">
        <div className="nexus-quiz-circle nexus-quiz-circle-1"></div>
        <div className="nexus-quiz-circle nexus-quiz-circle-2"></div>
        <div className="nexus-quiz-circle nexus-quiz-circle-3"></div>
      </div>

      {/* Header */}
      <div className="nexus-quiz-header">
        <button onClick={handleBackToDashboard} className="nexus-back-btn">
          <span>← Back to Dashboard</span>
        </button>
        <h1 className="nexus-quiz-title">
          <span className="nexus-quiz-icon">🧠</span>
          Choose Your Challenge
        </h1>
        <p className="nexus-quiz-subtitle">
          Select a quiz below to test your knowledge and skills
        </p>
      </div>

      {/* Main Content */}
      <div className="nexus-quiz-content">
        {message ? (
          <div className="nexus-error-container">
            <div className="nexus-error-icon">⚠️</div>
            <h3>Oops! Something went wrong</h3>
            <p className="nexus-error-message">{message}</p>
            <button onClick={() => window.location.reload()} className="nexus-retry-btn">
              Try Again
            </button>
          </div>
        ) : (
          <div className="nexus-quiz-grid">
            {userquiz.length === 0 ? (
              <div className="nexus-empty-state">
                <div className="nexus-empty-icon">📚</div>
                <h3>No Quizzes Available</h3>
                <p>Check back later for new challenges!</p>
              </div>
            ) : (
              userquiz.map((data) => (
                <div 
                  key={data.id} 
                  className={`nexus-quiz-card ${
                    data.Status?.toLowerCase() === "offline" 
                      ? "nexus-quiz-offline" 
                      : "nexus-quiz-online"
                  }`}
                >
                  {/* Status Badge */}
                  <div className="nexus-status-indicator">
                    <span className={`nexus-status-badge ${
                      data.Status?.toLowerCase() === "offline" 
                        ? "nexus-status-offline" 
                        : "nexus-status-online"
                    }`}>
                      {data.Status?.toLowerCase() === "offline" ? "🔒 Offline" : "🟢 Online"}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="nexus-quiz-card-content">
                    <h3 className="nexus-quiz-card-title">{data.title}</h3>
                    <p className="nexus-quiz-card-description">{data.description}</p>
                    
                    <div className="nexus-quiz-card-footer">
                      <button 
                        onClick={() => handleSelect(data.id, data.Status)}
                        className={`nexus-select-btn ${
                          data.Status?.toLowerCase() === "offline" 
                            ? "nexus-select-disabled" 
                            : "nexus-select-active"
                        }`}
                        disabled={data.Status?.toLowerCase() === "offline"}
                      >
                        {data.Status?.toLowerCase() === "offline" ? (
                          <span>🔒 Unavailable</span>
                        ) : (
                          <span>🚀 Start Quiz</span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Hover Effect */}
                  <div className="nexus-card-shimmer"></div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Userquiz;