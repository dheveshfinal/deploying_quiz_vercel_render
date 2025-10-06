import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const Userdash = () => {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const url = process.env.REACT_APP_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${url}/usernames/${id}`);
        setUsername(res.data.username);
      } catch (error) {
        setMessage(error.response?.data?.message || "Error fetching user");
      }
    };
    fetchUser();
  }, [id]);

  return (
    <div className="nexus-dashboard-container">
      {/* Animated Background Elements */}
      <div className="nexus-bg-circles">
        <div className="nexus-circle nexus-circle-1"></div>
        <div className="nexus-circle nexus-circle-2"></div>
        <div className="nexus-circle nexus-circle-3"></div>
      </div>

      {/* Header */}
      <header className="nexus-dashboard-header">
        <div className="nexus-header-content">
          <div className="nexus-welcome-section">
            <h2 className="nexus-welcome-text">
              Welcome back,{" "}
              {message ? (
                <span className="nexus-error-text">{message}</span>
              ) : (
                <span className="nexus-username">{username || `User ${id}`}</span>
              )}
            </h2>
            <div className="nexus-status-badge">
              <span className="nexus-status-dot"></span>
              Online
            </div>
          </div>
          
          <nav className="nexus-navigation">
            <Link to={`/quiz/${id}`} className="nexus-nav-link nexus-nav-quiz">
              <div className="nexus-nav-icon">🧠</div>
              <span>Start Quiz</span>
            </Link>
            <Link to={`/review/${id}`} className="nexus-nav-link nexus-nav-review">
              <div className="nexus-nav-icon">📊</div>
              <span>Review Marks</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="nexus-dashboard-main">
        <div className="nexus-hero-section">
          <div className="nexus-hero-content">
            <h1 className="nexus-hero-title">
              Ready to Challenge 
              <span className="nexus-highlight"> Your Knowledge?</span>
            </h1>
            <p className="nexus-hero-description">
              Take interactive quizzes, test your skills, and track your progress in real time.
              Every challenge brings you closer to becoming a quiz master!
            </p>
            
            <div className="nexus-stats-grid">
              <div className="nexus-stat-card">
                <div className="nexus-stat-icon">🎯</div>
                <div className="nexus-stat-content">
                  <h3>Challenge Yourself</h3>
                  <p>Test your knowledge with our interactive quizzes</p>
                </div>
              </div>
              
              <div className="nexus-stat-card">
                <div className="nexus-stat-icon">📈</div>
                <div className="nexus-stat-content">
                  <h3>Track Progress</h3>
                  <p>Monitor your improvement over time</p>
                </div>
              </div>
              
              <div className="nexus-stat-card">
                <div className="nexus-stat-icon">🏆</div>
                <div className="nexus-stat-content">
                  <h3>Achieve Excellence</h3>
                  <p>Become a true quiz master</p>
                </div>
              </div>
            </div>
            
            <div className="nexus-action-buttons">
              <Link to={`/quiz/${id}`} className="nexus-primary-btn">
                <span>🚀 Start Quiz Now</span>
              </Link>
              <Link to={`/review/${id}`} className="nexus-secondary-btn">
                <span>📋 View Results</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Userdash;