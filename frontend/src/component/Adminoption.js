import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Adminoption = () => {
  const [options, setOptions] = useState([]);
  const { id } = useParams(); // question_id
  const [message, setMessage] = useState("");
  const [newOption, setNewOption] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const url = process.env.REACT_APP_API_URL || "http://localhost:8000";
  useEffect(() => {
  const fetchOptions = async () => {
    try {
      const res = await axios.get(`${url}/adminoptions/${id}`);
      setOptions(res.data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  fetchOptions();
}, [id]);
    

  // ✅ Add new option
  const handleAdd = async () => {
    if (!newOption.trim()) return;
    try {
      const res = await axios.post(`${url}/adminoptions`, {
        question_id: id,
        option_text: newOption,
      });
      setOptions([...options, res.data]); // append new option
      setNewOption("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  // ✅ Delete option
  const handleDelete = async (optionId) => {
    if (!window.confirm("Delete this option?")) return;
    try {
      await axios.delete(`${url}/adminoptions/${optionId}`);
      setOptions(options.filter((opt) => opt.id !== optionId));
    } catch (error) {
      setMessage(error.message);
    }
  };

  // ✅ Save edited option
  const handleSave = async (optionId) => {
    try {
      await axios.put(`${url}/adminoptions/${optionId}`, {
        option_text: editText,
      });
      setOptions(
        options.map((opt) =>
          opt.id === optionId ? { ...opt, option_text: editText } : opt
        )
      );
      setEditId(null);
      setEditText("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Options for Question ID: {id}</h2>

      {/* Add Option Input */}
      <div style={{ marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Enter new option"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          style={{ padding: "6px", marginRight: "10px" }}
        />
        <button
          onClick={handleAdd}
          style={{
            padding: "6px 12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          + Add Option
        </button>
      </div>

      {message ? (
        <p style={{ color: "red" }}>{message}</p>
      ) : options.length > 0 ? (
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "70%" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th>ID</th>
              <th>Option Text</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {options.map((opt) => (
              <tr key={opt.id}>
                <td>{opt.id}</td>
                <td>
                  {editId === opt.id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                  ) : (
                    opt.option_text
                  )}
                </td>
                <td>
                  {editId === opt.id ? (
                    <>
                      <button
                        onClick={() => handleSave(opt.id)}
                        style={{
                          marginRight: "6px",
                          padding: "4px 8px",
                          backgroundColor: "green",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "gray",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditId(opt.id);
                          setEditText(opt.option_text);
                        }}
                        style={{
                          marginRight: "6px",
                          padding: "4px 8px",
                          backgroundColor: "orange",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(opt.id)}
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "red",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No options found for this question.</p>
      )}
    </div>
  );
};

export default Adminoption;
