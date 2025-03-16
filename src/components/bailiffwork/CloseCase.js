// src/components/CloseCase.js
import React, { useState } from 'react';
import axios from 'axios';

const CloseCase = ({ config }) => {
  const [caseId, setCaseId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/bailiff/closeCase', { caseId }, config);
      setMessage(res.data.msg);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error closing case');
    }
  };

  return (
    <div className="section">
      <h2>Close Case</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Case ID"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
        />
        <button type="submit">Close Case</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CloseCase;