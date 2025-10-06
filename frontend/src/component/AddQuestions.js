import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const AddQuizQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [editId, setEditId] = useState(null); // track editing row
  const [editData, setEditData] = useState({}); // hold editable data
  const { id } = useParams();
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL || "http://localhost:8000";



  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const res = await axios.get(`${url}/questions/${id}`);
        setQuestions(res.data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };

    fetchQuizQuestions();
  }, [id]); // ✅ add 'id' as a dependency

  // 🔹 Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;

    try {
      await axios.delete(`${url}/question/${id}`);
      setQuestions(questions.filter((q) => q.id !== id));
    } catch (err) {
      console.error("Error deleting question:", err);
    }
  };

  // 🔹 Handle Edit Click
  const handleEdit = (q) => {
    setEditId(q.id);
    setEditData({ ...q });
  };

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // 🔹 Handle Save
  const handleSave = async (id) => {
    try {
      await axios.put(`${url}/question/${id}`, editData);
      setQuestions(
        questions.map((q) => (q.id === id ? { ...q, ...editData } : q))
      );
      setEditId(null); // exit edit mode
    } catch (err) {
      console.error("Error updating question:", err);
    }
  };

  // 🔹 Handle Cancel
  const handleCancel = () => {
    setEditId(null);
    setEditData({});
  };

  const handleOptions = (id) => {
    navigate(`/option/${id}`);
  };

  return (
    <div className="quiz-questions-container">
      <div className="quiz-questions-header">
        <h2 className="quiz-questions-title">Quiz Questions Management</h2>
        <Link to={`/addquizequestionrow/${id}`} className="add-question-link">
          <button className="add-question-btn">
            <span className="add-question-icon">+</span>
            Add New Question
          </button>
        </Link>
      </div>

      <div className="quiz-questions-table-wrapper">
        <table className="quiz-questions-table">
          <thead className="quiz-questions-thead">
            <tr className="quiz-questions-header-row">
              <th className="quiz-questions-th">ID</th>
              <th className="quiz-questions-th">Quiz ID</th>
              <th className="quiz-questions-th">Question Text</th>
              <th className="quiz-questions-th">Question Type</th>
              <th className="quiz-questions-th">Marks</th>
              <th className="quiz-questions-th">Correct Answer</th>
              <th className="quiz-questions-th">Actions</th>
            </tr>
          </thead>
          <tbody className="quiz-questions-tbody">
            {questions.length > 0 ? (
              questions.map((q) => (
                <tr key={q.id} className="quiz-questions-row">
                  <td className="quiz-questions-td quiz-questions-id">{q.id}</td>

                  <td className="quiz-questions-td">
                    {editId === q.id ? (
                      <input
                        type="number"
                        name="quiz_id"
                        value={editData.quiz_id}
                        onChange={handleChange}
                        className="quiz-questions-input quiz-questions-input-number"
                      />
                    ) : (
                      <span className="quiz-questions-text">{q.quiz_id}</span>
                    )}
                  </td>

                  <td className="quiz-questions-td">
                    {editId === q.id ? (
                      <input
                        type="text"
                        name="question_text"
                        value={editData.question_text}
                        onChange={handleChange}
                        className="quiz-questions-input quiz-questions-input-text"
                      />
                    ) : (
                      <span className="quiz-questions-text quiz-questions-question-text">
                        {q.question_text}
                      </span>
                    )}
                  </td>

                  <td className="quiz-questions-td">
                    {editId === q.id ? (
                      <select
                        name="question_type"
                        value={editData.question_type}
                        onChange={handleChange}
                        className="quiz-questions-select"
                      >
                        <option value="MCQ">MCQ</option>
                        <option value="MSQ">MSQ</option>
                        <option value="True/False">True/False</option>
                      </select>
                    ) : (
                      <span className="quiz-questions-text quiz-questions-type-badge">
                        {q.question_type}
                      </span>
                    )}
                  </td>

                  <td className="quiz-questions-td">
                    {editId === q.id ? (
                      <input
                        type="number"
                        name="marks"
                        value={editData.marks}
                        onChange={handleChange}
                        className="quiz-questions-input quiz-questions-input-number"
                      />
                    ) : (
                      <span className="quiz-questions-text quiz-questions-marks">
                        {q.marks}
                      </span>
                    )}
                  </td>

                  <td className="quiz-questions-td">
                    {editId === q.id ? (
                      <input
                        type="text"
                        name="correct_answer"
                        value={editData.correct_answer}
                        onChange={handleChange}
                        className="quiz-questions-input quiz-questions-input-text"
                      />
                    ) : (
                      <span className="quiz-questions-text quiz-questions-answer">
                        {q.correct_answer}
                      </span>
                    )}
                  </td>

                  <td className="quiz-questions-td quiz-questions-actions">
                    {editId === q.id ? (
                      <div className="quiz-questions-action-group">
                        <button
                          onClick={() => handleSave(q.id)}
                          className="quiz-questions-btn quiz-questions-btn-save"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="quiz-questions-btn quiz-questions-btn-cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="quiz-questions-action-group">
                        <button
                          onClick={() => handleEdit(q)}
                          className="quiz-questions-btn quiz-questions-btn-edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="quiz-questions-btn quiz-questions-btn-delete"
                        >
                          Delete
                        </button>
                        <button 
                          onClick={() => handleOptions(q.id)} 
                          className="quiz-questions-btn quiz-questions-btn-options"
                        >
                          Options
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="quiz-questions-empty-row">
                <td colSpan="7" className="quiz-questions-td quiz-questions-empty-message">
                  <div className="quiz-questions-no-data">
                    <span className="quiz-questions-no-data-icon">📝</span>
                    <p>No questions found</p>
                    <p className="quiz-questions-no-data-subtitle">
                      Start by adding your first question
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddQuizQuestion;