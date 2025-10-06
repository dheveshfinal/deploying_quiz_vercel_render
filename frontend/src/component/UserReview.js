import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const Reviewresult = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [message, setMessage] = useState("");
  const { id } = useParams(); // ✅ correct usage
  const url = process.env.REACT_APP_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get(`${url}/reviewquiz`); // API to fetch all quizzes
        setQuizzes(res.data);
      } catch (error) {
        setMessage(error.response?.data?.message || error.message);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto", padding: "20px" }}>
      <h2>Admin ID: {id}</h2>

      {message ? (
        <p style={{ color: "red" }}>{message}</p>
      ) : quizzes.length === 0 ? (
        <p>No quizzes found.</p>
      ) : (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr>
                <th style={{ borderBottom: "2px solid #333", padding: "10px" }}>Quiz ID</th>
                <th style={{ borderBottom: "2px solid #333", padding: "10px" }}>Title</th>
                <th style={{ borderBottom: "2px solid #333", padding: "10px" }}>Description</th>
                <th style={{ borderBottom: "2px solid #333", padding: "10px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id}>
                  <td style={{ padding: "10px" }}>{quiz.id}</td>
                  <td style={{ padding: "10px" }}>{quiz.title}</td>
                  <td style={{ padding: "10px" }}>{quiz.description}</td>
                  <td style={{ padding: "10px" }}>
                    <Link
                      to={`/reviewuser/${quiz.id}/${id}`}
                      style={{
                        textDecoration: "none",
                        color: "#fff",
                        background: "#00796b",
                        padding: "6px 12px",
                        borderRadius: "6px",
                      }}
                    >
                      Review Users
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Dashboard button at the bottom */}
          <div style={{ marginTop: "20px" }}>
            <Link to={`/dashboard2/${id}`}>
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
        </>
      )}
    </div>
  );
};

export default Reviewresult;
