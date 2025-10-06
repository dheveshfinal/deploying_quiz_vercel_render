import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const AdminDash = () => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(true);
  const url = process.env.REACT_APP_API_URL || "http://localhost:8000";
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/userdetails`);
      setUsers(res.data);
    } catch (e) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user.id);
    setEditedUser({ ...user });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`${url}/userdetails/${id}`, editedUser);
      setEditUserId(null);
      fetchUsers();
      setMessage("User updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (e) {
      setMessage(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${url}/userdetails/${id}`);
        fetchUsers();
        setMessage("User deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
      } catch (e) {
        setMessage(e.message);
      }
    }
  };

  const handleCancel = () => {
    setEditUserId(null);
    setEditedUser({});
  };

  const getRoleBadgeClass = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'adminDashRoleBadgeAdmin';
      case 'user':
        return 'adminDashRoleBadgeUser';
      case 'moderator':
        return 'adminDashRoleBadgeModerator';
      default:
        return 'adminDashRoleBadgeDefault';
    }
  };

  return (
    <div className="adminDashContainer">
      {/* Navigation Header */}
      <div className="adminDashHeader">
        <h1 className="adminDashTitle">Admin Dashboard</h1>
        <div className="adminDashNavigation">
          <a
            href={`/quiz-management/${id}`}
            className="adminDashNavLink"
          >
            <span className="adminDashNavIcon">📋</span>
            Quiz Management
          </a>
          <a
            href={`/review-quiz/${id}`}
            className="adminDashNavLink"
          >
            <span className="adminDashNavIcon">📊</span>
            Review Quiz
          </a>
          <a
            href={`/Userreview/${id}`}
            className="adminDashNavLink"
          >
            <span className="adminDashNavIcon">👥</span>
            User Review
          </a>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`adminDashAlert ${message.includes('successfully') ? 'adminDashAlertSuccess' : 'adminDashAlertError'}`}>
          <span className="adminDashAlertIcon">
            {message.includes('successfully') ? '✅' : '⚠️'}
          </span>
          {message}
          <button 
            className="adminDashAlertClose"
            onClick={() => setMessage("")}
          >
            ×
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="adminDashContent">
        <div className="adminDashSectionHeader">
          <h2 className="adminDashSectionTitle">User Management</h2>
          <div className="adminDashUserCount">
            Total Users: <span className="adminDashCount">{users.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="adminDashLoading">
            <div className="adminDashSpinner"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <div className="adminDashTableContainer">
            <table className="adminDashTable">
              <thead className="adminDashTableHead">
                <tr>
                  <th className="adminDashTableHeader">Username</th>
                  <th className="adminDashTableHeader">Email</th>
                  <th className="adminDashTableHeader">Role</th>
                  <th className="adminDashTableHeader">Actions</th>
                </tr>
              </thead>
              <tbody className="adminDashTableBody">
                {users.map((user) => (
                  <tr key={user.id} className="adminDashTableRow">
                    <td className="adminDashTableCell">
                      {editUserId === user.id ? (
                        <input
                          name="username"
                          value={editedUser.username || ''}
                          onChange={handleChange}
                          className="adminDashInput"
                          placeholder="Enter username"
                        />
                      ) : (
                        <div className="adminDashUserInfo">
                          <span className="adminDashUsername">{user.username}</span>
                        </div>
                      )}
                    </td>
                    <td className="adminDashTableCell">
                      {editUserId === user.id ? (
                        <input
                          name="email"
                          type="email"
                          value={editedUser.email || ''}
                          onChange={handleChange}
                          className="adminDashInput"
                          placeholder="Enter email"
                        />
                      ) : (
                        <span className="adminDashEmail">{user.email}</span>
                      )}
                    </td>
                    <td className="adminDashTableCell">
                      {editUserId === user.id ? (
                        <select
                          name="role"
                          value={editedUser.role || ''}
                          onChange={handleChange}
                          className="adminDashSelect"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="moderator">Moderator</option>
                        </select>
                      ) : (
                        <span className={`adminDashRoleBadge ${getRoleBadgeClass(user.role)}`}>
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="adminDashTableCell">
                      {editUserId === user.id ? (
                        <div className="adminDashActionButtons">
                          <button 
                            onClick={() => handleSave(user.id)}
                            className="adminDashButton adminDashButtonSave"
                          >
                            💾 Save
                          </button>
                          <button 
                            onClick={handleCancel}
                            className="adminDashButton adminDashButtonCancel"
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="adminDashActionButtons">
                          <button 
                            onClick={() => handleEdit(user)}
                            className="adminDashButton adminDashButtonEdit"
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="adminDashButton adminDashButtonDelete"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDash;