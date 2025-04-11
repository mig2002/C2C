import React, { useState } from 'react';
import "./styles/PinataUploader.css"

const PinataUploader = () => {
  // State variables
  const [jwtToken, setJwtToken] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [customFileName, setCustomFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAddingToGroup, setIsAddingToGroup] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [uploadResult, setUploadResult] = useState(null);
  const [groupAddResult, setGroupAddResult] = useState(null);
  
  // Hardcoded group IDs
  const forensicDocsGroupId = "01962321-2290-76c3-940e-d5b3b5236c22";
  
  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError('');
    }
  };

  // Format file size for display
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Add file to group
  const addFileToGroup = async (fileId) => {
    if (!jwtToken.trim() || !fileId) {
      setError('JWT token and file ID are required to add to group');
      return null;
    }

    try {
      setIsAddingToGroup(true);
      
      const request = await fetch(
        `https://api.pinata.cloud/v3/groups/private/${forensicDocsGroupId}/ids/${fileId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          }
        }
      );
      
      if (!request.ok) {
        const errorData = await request.json();
        throw new Error(errorData.error?.reason || 'Failed to add file to group');
      }
      
      const response = await request.json();
      console.log("Added to ForensicDocs group:", response);
      setGroupAddResult(response);
      return response;
    } catch (error) {
      console.error("Error adding to group:", error);
      setError(`File uploaded but couldn't add to group: ${error.message}`);
      return null;
    } finally {
      setIsAddingToGroup(false);
    }
  };

  // Upload file to private IPFS
  const uploadToPrivateIpfs = async () => {
    // Validation
    if (!jwtToken.trim()) {
      setError('Please enter your Pinata JWT token');
      return;
    }
    
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }
    
    try {
      // Reset state
      setError('');
      setUploadResult(null);
      setGroupAddResult(null);
      setIsUploading(true);
      setUploadProgress(10); // Start progress at 10%
      
      // Prepare form data
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Set to private network
      formData.append('network', 'private');
      
      // Add custom name if provided
      if (customFileName.trim()) {
        formData.append('name', customFileName.trim());
      }
      
      // Set endpoint for direct file upload
      const endpoint = 'https://uploads.pinata.cloud/v3/files';
      
      // Create a cleanup function for the interval
      let progressInterval;
      
      try {
        // Simulate progress (since fetch doesn't provide upload progress)
        progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const newProgress = prev + 5;
            return newProgress < 90 ? newProgress : prev;
          });
        }, 300);
        
        // Upload to Pinata
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${jwtToken}`
          },
          body: formData
        });
        
        // Process response
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.reason || 'Upload failed');
        }
        
        const result = await response.json();
        console.log("Uploaded to  ipfs files:", result);
        console.log("File id:", result.data.id)
        setUploadResult(result);
        
        // Now add to group if upload was successful
        if (result.data && result.data.id) {
          await addFileToGroup(result.data.id);
        }
        
        setSelectedFile(null);
        setCustomFileName('');
      } finally {
        // Ensure interval is always cleared, even if there's an error
        if (progressInterval) {
          clearInterval(progressInterval);
        }
        setUploadProgress(100);
      }
      
    } catch (error) {
      setError(error.message || 'An error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="pinata-uploader">
      <h2>Pinata Private IPFS Uploader</h2>
      
      <div className="info-box">
        <p><strong>Note:</strong> This tool uploads files to your private IPFS using Pinata's API. 
        Files uploaded to private IPFS will not be accessible to the public and require authentication to retrieve.</p>
        <p><strong>Important:</strong> Files are first uploaded to private IPFS, then added to the ForensicDocs group.</p>
      </div>
      
      <div className="upload-container">
        <div className="form-group">
          <label htmlFor="jwt-token">Pinata JWT Token:</label>
          <input 
            type="text" 
            id="jwt-token" 
            value={jwtToken}
            onChange={(e) => setJwtToken(e.target.value)}
            placeholder="Enter your Pinata JWT token" 
          />
        </div>
        
        <h3>Upload New File</h3>
        <div className="form-group">
          <label htmlFor="file-input">Select File:</label>
          <input 
            type="file" 
            id="file-input" 
            onChange={handleFileChange}
          />
          {selectedFile && (
            <div className="file-info">
              <p>Selected: {selectedFile.name} ({formatBytes(selectedFile.size)})</p>
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="file-name">Custom File Name (optional):</label>
          <input 
            type="text" 
            id="file-name" 
            value={customFileName}
            onChange={(e) => setCustomFileName(e.target.value)}
            placeholder="Leave blank to use original filename" 
          />
        </div>
        
        <button 
          onClick={uploadToPrivateIpfs} 
          disabled={isUploading || isAddingToGroup}
          className="upload-button"
        >
          {isUploading ? 'Uploading...' : isAddingToGroup ? 'Adding to Group...' : 'Upload to Private IPFS'}
        </button>
        
        {isUploading && (
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
      
      {uploadResult && (
        <div className="result-container">
          <h3>Upload Result</h3>
          <div className="result-content">
            <p><strong>Upload Successful!</strong></p>
            <p><strong>CID:</strong> {uploadResult.data?.cid || uploadResult.cid || uploadResult.IpfsHash}</p>
            {(uploadResult.data?.id || uploadResult.id) && <p><strong>File ID:</strong> {uploadResult.data?.id || uploadResult.id}</p>}
            {(uploadResult.data?.name || uploadResult.name) && <p><strong>Name:</strong> {uploadResult.data?.name || uploadResult.name}</p>}
            {(uploadResult.data?.size || uploadResult.size) && <p><strong>Size:</strong> {formatBytes(uploadResult.data?.size || uploadResult.size)}</p>}
            <p><strong>Status:</strong> <span className="status-private">Private</span></p>
            <p><strong>Gateway URL:</strong> <code>https://gateway.pinata.cloud/ipfs/{uploadResult.data?.cid || uploadResult.cid || uploadResult.IpfsHash}</code></p>
          </div>
        </div>
      )}
      
      {groupAddResult && (
        <div className="result-container">
          <h3>Group Addition Result</h3>
          <div className="result-content">
            <p><strong>Successfully added to ForensicDocs group!</strong></p>
            {groupAddResult.id && <p><strong>Group Operation ID:</strong> {groupAddResult.id}</p>}
            {groupAddResult.status && <p><strong>Status:</strong> {groupAddResult.status}</p>}
          </div>
          
          <div className="info-box">
            <p><strong>Retrieving your file:</strong> To retrieve this file later, use Pinata's dedicated gateway with your JWT token in the header:</p>
            <code>https://gateway.pinata.cloud/ipfs/[CID]</code>
          </div>
        </div>
      )}
    </div>
  );
};

export default PinataUploader;