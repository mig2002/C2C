import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"; // Import useNavigate

const DocumentRetriever = () => {
  const [contentIds, setContentIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [caseId, setCaseId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate hook
  
  // Check if user has permission to retrieve documents
  const userRole = 'judge';
  const canRetrieve = userRole === 'judge';

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    // Use navigate instead of window.location.href
    navigate("/");
  };

  const fetchDocuments = async () => {
    if (!caseId) {
      setError('Case ID is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Send request
      const response = await axios.get(`http://localhost:3000/user/judges/docAdder/ret?caseId=${caseId}`, {
        headers: { Authorization: token }
      });
      
      if (response.data.success) {
        // Store the content IDs returned from the API
        setContentIds(response.data.cids || []);
      } else {
        setError(response.data.message || 'Failed to retrieve documents');
      }
      
    } catch (err) {
      console.error('Document retrieval failed:', err);
      setError(err.response?.data?.msg || 'Failed to retrieve documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle case ID input change
  const handleCaseIdChange = (e) => {
    setCaseId(e.target.value);
  };

  const viewDocument = (cid) => {
    // Open IPFS gateway URL in new tab
    window.open(`https://gateway.pinata.cloud/ipfs/${cid}`, '_blank');
  };

  if (!isAuthenticated) {
    return <div>Please log in to access the dashboard</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Header Section from PoliceDashboard */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 20px",
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "20px",
          borderRadius: "8px",
        }}
      >
        <h1
          style={{
            color: "#e88d7d",
            fontSize: "1.5rem",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          Judge Dashboard
        </h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#e88d7d",
            color: "white",
            border: "none",
            padding: "8px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "500",
            transition: "background-color 0.3s",
          }}
        >
          Logout
        </button>
      </nav>

      {/* Original DocumentRetriever content */}
      {!canRetrieve ? (
        <div className="section">
          <h2>Case Documents</h2>
          <p>Only judges can view the complete document history.</p>
        </div>
      ) : (
        <div className="section">
          <h2>Case Documents</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="caseIdRetrieval">Case ID</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                id="caseIdRetrieval"
                value={caseId || ''}
                onChange={handleCaseIdChange}
                style={{ flex: 1 }}
              />
              <button 
                onClick={fetchDocuments}
                disabled={loading || !caseId}
                className="secondary"
                style={{ width: 'auto' }}
              >
                Retrieve
              </button>
            </div>
          </div>
          
          {loading ? (
            <p>Loading documents...</p>
          ) : contentIds.length > 0 ? (
            <div>
              <p>Total documents: {contentIds.length}</p>
              <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ccc' }}>Document No</th>
                      <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ccc' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentIds.map((cid, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '8px' }}>{`Document No ${index+1}`}</td>
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <button 
                            onClick={() => viewDocument(cid)}
                            className="secondary"
                            style={{ 
                              width: 'auto', 
                              padding: '5px 10px', 
                              fontSize: '0.875rem' 
                            }}
                          >
                            View Document
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p>No documents found for this case.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentRetriever;