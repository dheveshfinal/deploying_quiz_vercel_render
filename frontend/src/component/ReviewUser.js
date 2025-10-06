import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const ReviewUser = () => {
  const { quizId, adminid } = useParams();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const url = process.env.REACT_APP_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${url}/viewusers/${quizId}`);
        setUsers(res.data);
      } catch (error) {
        setMessage(error.response?.data?.error || error.message);
      }
    };
    fetchUsers();
  }, [quizId]);

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto", padding: "20px" }}>
      <h2>Users Who Attempted Quiz ID: {quizId}</h2>

      {message ? (
        <p style={{ color: "red" }}>{message}</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "2px solid #333", padding: "10px" }}>User ID</th>
              <th style={{ borderBottom: "2px solid #333", padding: "10px" }}>Username</th>
              <th style={{ borderBottom: "2px solid #333", padding: "10px" }}>Email</th>
              <th style={{ borderBottom: "2px solid #333", padding: "10px" }}>Marks</th>
              <th style={{ borderBottom: "2px solid #333", padding: "10px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td style={{ padding: "10px" }}>{user.user_id}</td>
                <td style={{ padding: "10px" }}>{user.username}</td>
                <td style={{ padding: "10px" }}>{user.email}</td>
                <td style={{ padding: "10px" }}>
                  {user.total_score} / {user.total_marks}
                </td>
                <td style={{ padding: "10px" }}>
                  <Link
                    to={`/reviewanswer/${user.user_id}/${quizId}`}
                    style={{
                      textDecoration: "none",
                      color: "#fff",
                      background: "#00796b",
                      padding: "6px 12px",
                      borderRadius: "6px",
                    }}
                  >
                    Review Answers
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: "20px" }}>
        <Link to={`/dashboard2/${adminid}`}>
          <button
            style={{
              background: "#004d40",
              color: "#fff",
              padding: "8px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Go to Dashboard2
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ReviewUser;
