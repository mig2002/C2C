import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { pinata } from "../utils/config"

const DocumentUploader = ({ userRole, userId, caseId }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState({ success: null, message: '', ipfsHash: '', txHash: '' });
  const [error, setError] = useState('');
  const [localCaseId, setLocalCaseId] = useState(caseId || '');

  // Check if user has permission to upload
  const canUpload = ['lawyer', 'forensic_expert'].includes(userRole);

  // Update local case ID if caseId prop changes
  useEffect(() => {
    setLocalCaseId(caseId || '');
  }, [caseId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit');
      setFile(null);
    } else {
      setError('');
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (!localCaseId) {
      setError('Case ID is required');
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caseId', localCaseId);

      const upload = await pinata.upload.public.file(file)
      console.log(upload);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Send request
      const response = await axios.post('/api/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUploadResult({
        success: true,
        message: response.data.message,
        ipfsHash: response.data.ipfsHash,
        txHash: response.data.txHash
      });
      
      // Reset file input
      setFile(null);
      
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadResult({
        success: false,
        message: err.response?.data?.message || 'Upload failed'
      });
      setError(err.response?.data?.msg || 'Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCaseIdChange = (e) => {
    setLocalCaseId(e.target.value);
  };

  if (!canUpload) {
    return (
      <div className="section">
        <h2>Document Upload</h2>
        <p>You don't have permission to upload documents.</p>
      </div>
    );
  }

  return (
    <div className="section">
      <h2>Upload Case Document</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {uploadResult.success === true && (
        <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
          <p>{uploadResult.message}</p>
          <p>IPFS Hash: {uploadResult.ipfsHash}</p>
          <p>Transaction Hash: {uploadResult.txHash}</p>
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
            value={localCaseId}
            onChange={handleCaseIdChange}
            placeholder={caseId ? '' : 'Enter Case ID'}
            disabled={!!caseId}
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
        
        <button 
          type="submit" 
          disabled={uploading || !file || !localCaseId}
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>
    </div>
  );
};

export default DocumentUploader;