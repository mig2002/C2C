// src/components/RoleUpdate.js
import React, { useState } from 'react';
import axios from 'axios';

const RoleUpdate = ({ config }) => {
  const [formData, setFormData] = useState({
    userId: '',
    status: ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:3000/user/bailiffs/role', formData, config);
      setMessage(res.data.msg);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error updating role');
    }
  };

  return (
    <div className="section">
      <h2>Update User Role</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User ID"
          value={formData.userId}
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="">Select Status</option>
          <option value="Verified">Verified</option>
          <option value="Pending">Pending</option>
        </select>
        <button type="submit">Update Role</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RoleUpdate;