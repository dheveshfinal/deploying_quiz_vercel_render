import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const Reviewresult = () => {
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { adminid } = useParams(); // ✅ correct usage
  const url = process.env.REACT_APP_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchReview = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${url}/reviewquiz`);
        setReviews(res.data);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReview();
  }, []);

  if (isLoading) {
    return (
      <div className="review-result-container">
        <div className="review-result-loading">
          <div className="review-result-spinner"></div>
          <p className="review-result-loading-text">Loading quiz reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-result-container">
      <div className="review-result-background">
        <div className="review-result-floating-elements">
          <div className="review-result-float-item review-result-float-1"></div>
          <div className="review-result-float-item review-result-float-2"></div>
          <div className="review-result-float-item review-result-float-3"></div>
          <div className="review-result-float-item review-result-float-4"></div>
        </div>
      </div>

      <div className="review-result-content">
        <div className="review-result-header">
          <div className="review-result-admin-badge">
            <span className="review-result-admin-icon">👤</span>
            <div className="review-result-admin-info">
              <span className="review-result-admin-label">Admin ID</span>
              <span className="review-result-admin-id">{adminid}</span>
            </div>
          </div>
          <h1 className="review-result-title">
            <span className="review-result-title-icon">📋</span>
            Quiz Review Dashboard
          </h1>
          <p className="review-result-subtitle">
            Manage and review all quiz submissions
          </p>
        </div>

        {message ? (
          <div className="review-result-error-container">
            <div className="review-result-error-card">
              <div className="review-result-error-icon">⚠️</div>
              <h3 className="review-result-error-title">Oops! Something went wrong</h3>
              <p className="review-result-error-message">{message}</p>
              <button 
                className="review-result-retry-btn"
                onClick={() => window.location.reload()}
              >
                <span className="review-result-retry-icon">🔄</span>
                Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="review-result-main-content">
            <div className="review-result-stats-bar">
              <div className="review-result-stat-item">
                <span className="review-result-stat-number">{reviews.length}</span>
                <span className="review-result-stat-label">Total Quizzes</span>
              </div>
              <div className="review-result-stat-divider"></div>
              <div className="review-result-stat-item">
                <span className="review-result-stat-number">
                  {reviews.filter(rev => rev.status === 'active').length || reviews.length}
                </span>
                <span className="review-result-stat-label">Active</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="review-result-empty-state">
                <div className="review-result-empty-icon">📝</div>
                <h3 className="review-result-empty-title">No Quizzes Found</h3>
                <p className="review-result-empty-message">
                  There are no quiz reviews to display at the moment.
                </p>
              </div>
            ) : (
              <div className="review-result-table-container">
                <div className="review-result-table-wrapper">
                  <table className="review-result-table">
                    <thead className="review-result-table-head">
                      <tr className="review-result-table-header-row">
                        <th className="review-result-table-th">
                          <span className="review-result-th-content">
                            <span className="review-result-th-icon">#</span>
                            ID
                          </span>
                        </th>
                        <th className="review-result-table-th">
                          <span className="review-result-th-content">
                            <span className="review-result-th-icon">📚</span>
                            Title
                          </span>
                        </th>
                        <th className="review-result-table-th">
                          <span className="review-result-th-content">
                            <span className="review-result-th-icon">📝</span>
                            Description
                          </span>
                        </th>
                        <th className="review-result-table-th review-result-actions-header">
                          <span className="review-result-th-content">
                            <span className="review-result-th-icon">⚡</span>
                            Actions
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="review-result-table-body">
                      {reviews.map((rev, index) => (
                        <tr key={rev.id} className="review-result-table-row" style={{animationDelay: `${index * 0.1}s`}}>
                          <td className="review-result-table-td review-result-id-cell">
                            <div className="review-result-id-badge">
                              {rev.id}
                            </div>
                          </td>
                          <td className="review-result-table-td">
                            <div className="review-result-title-cell">
                              <h4 className="review-result-quiz-title">{rev.title}</h4>
                            </div>
                          </td>
                          <td className="review-result-table-td">
                            <div className="review-result-description-cell">
                              <p className="review-result-quiz-description">
                                {rev.description}
                              </p>
                            </div>
                          </td>
                          <td className="review-result-table-td review-result-actions-cell">
                            <Link to={`/add_quiz/${rev.id}`} className="review-result-action-link">
                              <button className="review-result-action-btn">
                                <span className="review-result-btn-icon">➕</span>
                                <span className="review-result-btn-text">Add Quiz</span>
                                <div className="review-result-btn-glow"></div>
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="review-result-dashboard-section">
              <div className="review-result-dashboard-card">
                <div className="review-result-dashboard-content">
                  <h3 className="review-result-dashboard-title">
                    <span className="review-result-dashboard-icon">🎛️</span>
                    Admin Dashboard
                  </h3>
                  <p className="review-result-dashboard-description">
                    Access advanced admin features and comprehensive analytics
                  </p>
                </div>
                <Link to={`/dashboard2/${adminid}`} className="review-result-dashboard-link">
                  <button className="review-result-dashboard-btn">
                    <span className="review-result-dashboard-btn-icon">🚀</span>
                    <span className="review-result-dashboard-btn-text">Go to Dashboard</span>
                    <div className="review-result-dashboard-btn-arrow">→</div>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviewresult;