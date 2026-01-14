import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [log, setLog] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const handleChange = (e) => {
    setLog({ ...log, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${url}/login`, log);
      setMessage(res.data.message);
      // Check if user exists first
      if (res.data.user?.role === "user") {
        navigate(`/dashboard1/${res.data.user.id}`);
      } else if (res.data.user?.role) {
        navigate(`/dashboard2/${res.data.user.id}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
      setLoading(false);
    }
  };
  return (
    <div className="nexus-login-container">
      <div className="nexus-login-card">
        <div className="nexus-brand-section">
          <h1 className="nexus-brand-title">NexusAuth</h1>
          <p className="nexus-brand-subtitle">Welcome back to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="nexus-login-form">
          <div className="nexus-form-group">
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email"
              value={log.email}
              onChange={handleChange}
              className="nexus-input"
              required
              disabled={loading}
            />
          </div>
          
          <div className="nexus-form-group">
            <input
              type="password"
              name="password"
              placeholder="Enter Your Password"
              value={log.password}
              onChange={handleChange}
              className="nexus-input"
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="nexus-submit-btn" disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span className="spinner"></span>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        
        {message && (
          <div className={`nexus-message ${message.includes('wrong') ? 'nexus-error' : 'nexus-success'}`}>
            {message}
          </div>
        )}
        
        <div className="nexus-signup-link">
          <p>Don't have an account? 
            <a href="/" className="nexus-link"> Create one here</a>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;
