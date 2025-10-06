import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const QuizManagement = () => {
  const [quizData, setQuizData] = useState([]);
  const [message, setMessage] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const url = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`{url}/Quizdetails`);
      setQuizData(res.data.quizdetails || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (index !== null) {
      const updated = [...quizData];
      updated[index][name] = value;
      setQuizData(updated);
    }
  };

  const saveEdit = async (quiz) => {
    try {
      await axios.put(`${url}/Quizdetails/${quiz.id}`, quiz);
      setEditingIndex(null);
      fetchQuizzes();
      setMessage("Quiz updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const deleteQuiz = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await axios.delete(`${url}/Quizdetails/${quizId}`);
        fetchQuizzes();
        setMessage("Quiz deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        setMessage(error.message);
      }
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    fetchQuizzes(); // Reset data
  };

  const getStatusClass = (status) => {
    return status?.toLowerCase() === 'online' 
      ? 'quizMgmtStatusOnline' 
      : 'quizMgmtStatusOffline';
  };

  return (
    <div className="quizMgmtContainer">
      {/* Header */}
      <div className="quizMgmtHeader">
        <h1 className="quizMgmtTitle">Quiz Management Center</h1>
      </div>

      {/* Alert Message */}
      {message && (
        <div className="quizMgmtAlert">
          {message}
        </div>
      )}

      {/* Main Content */}
      <div className="quizMgmtContent">
        {/* Action Section */}
        <div className="quizMgmtActionSection">
          <button 
            className="quizMgmtAddButton"
            onClick={() => navigate("/add-quiz")}
          >
            ➕ Add New Quiz
          </button>
          <div className="quizMgmtQuizCount">
            Total Quizzes: {quizData.length}
          </div>
        </div>

        {/* Quiz Table */}
        {loading ? (
          <div className="quizMgmtNoData">
            Loading quizzes...
          </div>
        ) : (
          <div className="quizMgmtTableContainer">
            <table className="quizMgmtTable">
              <thead className="quizMgmtTableHead">
                <tr>
                  <th className="quizMgmtTableHeader">Title</th>
                  <th className="quizMgmtTableHeader">Description</th>
                  <th className="quizMgmtTableHeader">Status</th>
                  <th className="quizMgmtTableHeader">Actions</th>
                </tr>
              </thead>
              <tbody className="quizMgmtTableBody">
                {quizData.length > 0 ? (
                  quizData.map((quiz, index) => (
                    <tr key={quiz.id} className="quizMgmtTableRow">
                      <td className="quizMgmtTableCell">
                        {editingIndex === index ? (
                          <input
                            type="text"
                            name="title"
                            value={quiz.title || ''}
                            onChange={(e) => handleChange(e, index)}
                            className="quizMgmtInput"
                            placeholder="Enter quiz title"
                          />
                        ) : (
                          <span className="quizMgmtQuizTitle">{quiz.title}</span>
                        )}
                      </td>
                      <td className="quizMgmtTableCell">
                        {editingIndex === index ? (
                          <input
                            type="text"
                            name="description"
                            value={quiz.description || ''}
                            onChange={(e) => handleChange(e, index)}
                            className="quizMgmtInput"
                            placeholder="Enter quiz description"
                          />
                        ) : (
                          <span className="quizMgmtQuizDescription">{quiz.description}</span>
                        )}
                      </td>
                      <td className="quizMgmtTableCell">
                        {editingIndex === index ? (
                          <select
                            name="Status"
                            value={quiz.Status || quiz.status || ''}
                            onChange={(e) => handleChange(e, index)}
                            className="quizMgmtSelect"
                          >
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                          </select>
                        ) : (
                          <span className={`quizMgmtStatusBadge ${getStatusClass(quiz.Status || quiz.status)}`}>
                            {quiz.Status || quiz.status}
                          </span>
                        )}
                      </td>
                      <td className="quizMgmtTableCell">
                        <div className="quizMgmtActionButtons">
                          {editingIndex === index ? (
                            <>
                              <button 
                                onClick={() => saveEdit(quiz)}
                                className="quizMgmtButton quizMgmtButtonSave"
                              >
                                💾 Save
                              </button>
                              <button 
                                onClick={cancelEdit}
                                className="quizMgmtButton quizMgmtButtonEdit"
                              >
                                ❌ Cancel
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => setEditingIndex(index)}
                              className="quizMgmtButton quizMgmtButtonEdit"
                            >
                              ✏️ Edit
                            </button>
                          )}
                          <button
                            onClick={() => deleteQuiz(quiz.id)}
                            className="quizMgmtButton quizMgmtButtonDelete"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="quizMgmtTableCell">
                      <div className="quizMgmtNoData">
                        📋 No quizzes found. Create your first quiz!
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="quizMgmtBottomNav">
          <button 
            onClick={() => navigate(`/dashboard2/${id}`)}
            className="quizMgmtDashboardButton"
          >
            🏠 Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizManagement;