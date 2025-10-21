import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [state, setState] = useState({ Name: "", email: "", password: "", role: "user" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/signup`, state);
      setMessage(res.data.message);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setMessage("Signup failed, please try again!");
    }
  };

  return (
    <div className="nexus-signup-container">
      <div className="nexus-signup-card">
        <div className="nexus-brand-section">
          <h3>wait 1min after submit </h3>
          <h1 className="nexus-brand-title">NexusAuth</h1>
          <p className="nexus-brand-subtitle">Join our community today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="nexus-signup-form">
          <div className="nexus-form-group">
            <input 
              type="text" 
              name="Name" 
              placeholder="Enter Your Full Name" 
              value={state.Name} 
              onChange={handleChange}
              className="nexus-input"
              required
            />
          </div>
          
          <div className="nexus-form-group">
            <input 
              type="email" 
              name="email" 
              placeholder="Enter Your Email" 
              value={state.email} 
              onChange={handleChange}
              className="nexus-input"
              required
            />
          </div>
          
          <div className="nexus-form-group">
            <input 
              type="password" 
              name="password" 
              placeholder="Create Strong Password" 
              value={state.password} 
              onChange={handleChange}
              className="nexus-input"
              required
            />
          </div>
          
          <button type="submit" className="nexus-submit-btn">
            Create Account
          </button>
        </form>
        
        {message && (
          <div className={`nexus-message ${message.includes('failed') ? 'nexus-error' : 'nexus-success'}`}>
            {message}
          </div>
        )}
        
        <div className="nexus-login-link">
          <p>Already have an account? 
            <a href="/login" className="nexus-link"> Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
