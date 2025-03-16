// src/components/PendingCases.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PendingCases = ({ config }) => {
  const [pendingCases, setPendingCases] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingCases = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/bailiff/case', config);
      setPendingCases(res.data.pendingCases);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCases();
  }, []);

  return (
    <div className="section">
      <h2>Pending Cases</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {pendingCases.map(caseItem => (
            <li key={caseItem._id}>{caseItem._id} - {caseItem.status}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingCases;