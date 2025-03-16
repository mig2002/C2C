// src/components/ChangeLawyer.js
import React, { useState } from 'react';
import axios from 'axios';

const ChangeLawyer = ({ config }) => {
  const [formData, setFormData] = useState({
    oldUserId: '',
    newUserId: '',
    caseId: ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/bailiff/changeLawyer', formData, config);
      setMessage(res.data.msg);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error changing lawyer');
    }
  };

  return (
    <div className="section">
      <h2>Change Lawyer</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Old Lawyer User ID"
          value={formData.oldUserId}
          onChange={(e) => setFormData({ ...formData, oldUserId: e.target.value })}
        />
        <input
          type="text"
          placeholder="New Lawyer User ID"
          value={formData.newUserId}
          onChange={(e) => setFormData({ ...formData, newUserId: e.target.value })}
        />
        <input
          type="text"
          placeholder="Case ID"
          value={formData.caseId}
          onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
        />
        <button type="submit">Change Lawyer</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ChangeLawyer;