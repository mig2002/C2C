import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { pinata } from "../utils/config";
import axios from 'axios';

const ForensicDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch user data on component mount


  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  };



  // Document Uploader component
  const DocumentUploader = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState({ success: null, message: '', ipfsHash: '', txHash: '' });
    const [uploaderError, setUploaderError] = useState('');
    const [caseId, setCaseId] = useState('');

    const userRole = userData?.role || '';
    const canUpload = ['lawyer', 'forensic_expert'].includes(userRole);

    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
        setUploaderError('File size exceeds 10MB limit');
        setFile(null);
      } else {
        setUploaderError('');
        setFile(selectedFile);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!file) {
        setUploaderError('Please select a file to upload');
        return;
      }

      if (!caseId) {
        setUploaderError('Case ID is required');
        return;
      }

      try {
        setUploading(true);
        setUploaderError('');

        // Upload to Pinata
        const upload = await pinata.upload.public.file(file);
        
        // Send to backend with CID
        const res = await axios.post("http://localhost:3000/user/lawyer/transfer/docAdder", 
          { 
            caseId: caseId,
            cid: upload.cid  // Changed from ipfsHash to cid to match backend
          }, 
          { 
            headers: { Authorization: token }
          }
        );

        setUploadResult({
          success: true,
          message: 'Document added successfully',
          ipfsHash: upload.cid,
          txHash: res.data.txHash // Get transaction hash from response
        });
        
        setFile(null);
      } catch (err) {
        console.error('Upload failed:', err);
        setUploadResult({
          success: false,
          message: err.response?.data?.message || err.message || 'Upload failed',
        });
        setUploaderError(err.response?.data?.msg || err.message || 'Failed to upload document. Please try again.');
      } finally {
        setUploading(false);
      }
    };

  

    return (
      <div className="section">
        <h2>Upload Case Document</h2>

        {uploaderError && <div className="error-message">{uploaderError}</div>}

        {uploadResult.success === true && (
          <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
            <p>{uploadResult.message}</p>
            <p>IPFS Hash: {uploadResult.ipfsHash}</p>
            {uploadResult.txHash && <p>Transaction Hash: {uploadResult.txHash}</p>}
          </div>
        )}

        {uploadResult.success === false && (
          <div className="error-message">{uploadResult.message}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="caseId">Case ID</label>
            <input
              type="text"
              id="caseId"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              placeholder="Enter Case ID"
              required
            />
          </div>

          <div>
            <label htmlFor="documentFile">Select Document</label>
            <input
              type="file"
              id="documentFile"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <small style={{ color: '#666', fontSize: '0.75rem' }}>
              Maximum file size: 10MB
            </small>
          </div>

          <button type="submit" disabled={uploading || !file || !caseId}>
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
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
          Forensic Dashboard
        </h1>
        <div style={{ display: "flex", alignItems: "center" }}>
          {userData && (
            <span style={{ marginRight: "15px", color: "#555" }}>
              Welcome, {userData.name || userData.email}
            </span>
          )}
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
        </div>
      </nav>

      {error && (
        <div 
          className="error-message" 
          style={{ 
            background: "#ffebee",
            color: "#c62828",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "15px",
            fontSize: "0.875rem"
          }}
        >
          {error}
        </div>
      )}

      {/* Document uploader component */}
      <DocumentUploader />

      {/* Guidelines section */}
      <div 
        className="section" 
        style={{
          background: "white",
          border: "1px solid #ccc",
          padding: "15px",
          borderRadius: "5px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          marginTop: "20px"
        }}
      >
        <h2 style={{ marginTop: 0, color: "#e88d7d", fontSize: "1.2rem", fontWeight: "bold" }}>Document Guidelines</h2>
        <ul style={{ paddingLeft: "20px" }}>
          <li style={{ marginBottom: "8px" }}>All documents must be in PDF format</li>
          <li style={{ marginBottom: "8px" }}>Maximum file size is 10MB</li>
          <li style={{ marginBottom: "8px" }}>Include proper document metadata and references</li>
          <li style={{ marginBottom: "8px" }}>All uploaded documents are securely stored on IPFS</li>
          <li style={{ marginBottom: "8px" }}>Each upload is recorded on the blockchain for traceability</li>
        </ul>
      </div>
    </div>
  );
};

export default ForensicDashboard;