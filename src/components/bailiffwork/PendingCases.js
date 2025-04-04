// src/components/PendingCases.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PendingCases = ({ config }) => {
  const [pendingCases, setPendingCases] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingCases = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3000/user/bailiffs/case`, {
        headers: { Authorization: token }
      });
      
     
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
            
            <li key={caseItem.title}>{caseItem.title} - {caseItem.status}  [{caseItem._id}]</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingCases;