import React, { useState, useEffect } from 'react';

function PinataPersistentRetriever() {
  const [jwt, setJwt] = useState('');
  const [cid, setCid] = useState('');
  const [retrievedFiles, setRetrievedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('retrieve'); // 'retrieve' or 'files'
  
  // Load saved data on component mount
  useEffect(() => {
    const savedJwt = localStorage.getItem('pinataJwt');
    if (savedJwt) {
      setJwt(savedJwt);
    }
    
    const savedFiles = localStorage.getItem('retrievedPinataFiles');
    if (savedFiles) {
      try {
        setRetrievedFiles(JSON.parse(savedFiles));
      } catch (err) {
        console.error('Error parsing saved files:', err);
      }
    }
  }, []);
  
  // Save JWT to localStorage when it changes
  useEffect(() => {
    if (jwt) {
      localStorage.setItem('pinataJwt', jwt);
    }
  }, [jwt]);
  
  // Save retrieved files list when it changes
  useEffect(() => {
    localStorage.setItem('retrievedPinataFiles', JSON.stringify(retrievedFiles));
  }, [retrievedFiles]);

  const retrieveFile = async (e) => {
    e.preventDefault();
    
    if (!jwt || !cid) {
      setError('Please provide both JWT and CID');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Format the URL with the CID
      const gatewayUrl = `https://moccasin-absolute-eagle-393.mypinata.cloud/files/${cid}`;
      
      const payload = JSON.stringify({
        url: gatewayUrl,
        expires: 864000, // Set expiration time to 10 days (in seconds)
        date: Math.floor(Date.now() / 1000), // Current timestamp in seconds
        method: "GET"
      });
      
      const request = await fetch(
        `https://api.pinata.cloud/v3/files/private/download_link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: payload
        }
      );
      
      if (!request.ok) {
        throw new Error(`Failed to get download link: ${request.status} ${request.statusText}`);
      }
      
      const response = await request.json();
      console.log('Pinata response:', response);
      
      if (!response.data) {
        throw new Error('No download link received from Pinata');
      }
      
      // Get file metadata if possible
      let fileName = `file-${cid.substring(0, 10)}`;
      let fileType = 'unknown';
      
      try {
        const headRequest = await fetch(response.data, { method: 'HEAD' });
        
        // Try to get content type
        const contentType = headRequest.headers.get('content-type');
        if (contentType) {
          fileType = contentType;
        }
        
        // Try to get filename from content-disposition header
        const disposition = headRequest.headers.get('content-disposition');
        if (disposition && disposition.includes('filename=')) {
          const filenameMatch = disposition.match(/filename=["']?([^"']+)/);
          if (filenameMatch && filenameMatch[1]) {
            fileName = filenameMatch[1];
          }
        }
      } catch (err) {
        console.warn('Could not fetch file metadata:', err);
      }
      
      // Add to retrieved files list
      const newFile = {
        cid,
        downloadUrl: response.data,
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 864000 * 1000).toISOString(), // 10 days from now
        fileName,
        fileType
      };
      
      // Check if this CID already exists in our list
      const existingIndex = retrievedFiles.findIndex(file => file.cid === cid);
      
      if (existingIndex >= 0) {
        // Update existing entry
        const updatedFiles = [...retrievedFiles];
        updatedFiles[existingIndex] = newFile;
        setRetrievedFiles(updatedFiles);
      } else {
        // Add new entry
        setRetrievedFiles([newFile, ...retrievedFiles]);
      }
      
      // Switch to files tab to show the result
      setActiveTab('files');
      
    } catch (err) {
      console.error('Error retrieving file:', err);
      setError(err.message || 'Failed to retrieve file');
    } finally {
      setLoading(false);
    }
  };
  
  const regenerateLink = async (fileIndex) => {
    const file = retrievedFiles[fileIndex];
    if (!file || !jwt) return;
    
    setLoading(true);
    
    try {
      // Format the URL with the CID
      const gatewayUrl = `https://moccasin-absolute-eagle-393.mypinata.cloud/files/${file.cid}`;
      
      const payload = JSON.stringify({
        url: gatewayUrl,
        expires: 864000, // Set expiration time to 10 days (in seconds)
        date: Math.floor(Date.now() / 1000), // Current timestamp in seconds
        method: "GET"
      });
      
      const request = await fetch(
        `https://api.pinata.cloud/v3/files/private/download_link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: payload
        }
      );
      
      if (!request.ok) {
        throw new Error(`Failed to get download link: ${request.status} ${request.statusText}`);
      }
      
      const response = await request.json();
      
      if (!response.data) {
        throw new Error('No download link received from Pinata');
      }
      
      // Update the file entry
      const updatedFiles = [...retrievedFiles];
      updatedFiles[fileIndex] = {
        ...file,
        downloadUrl: response.data,
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 864000 * 1000).toISOString(), // 10 days from now
      };
      
      setRetrievedFiles(updatedFiles);
      
    } catch (err) {
      console.error('Error regenerating link:', err);
      setError(`Failed to regenerate link: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const downloadFile = async (url, fileName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error('Error downloading file:', err);
      setError(`Download failed: ${err.message}`);
    }
  };
  
  const removeFile = (index) => {
    const updatedFiles = [...retrievedFiles];
    updatedFiles.splice(index, 1);
    setRetrievedFiles(updatedFiles);
  };
  
  const formatDate = (isoString) => {
    try {
      return new Date(isoString).toLocaleString();
    } catch (e) {
      return 'Unknown date';
    }
  };
  
  const isExpired = (expiresAt) => {
    try {
      return new Date(expiresAt) < new Date();
    } catch {
      return true;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Pinata Private IPFS File Access</h2>
      
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab('retrieve')}
          className={`px-4 py-2 ${activeTab === 'retrieve' ? 
            'border-b-2 border-blue-500 text-blue-600' : 
            'text-gray-500 hover:text-gray-700'}`}
        >
          Retrieve File
        </button>
        <button
          onClick={() => setActiveTab('files')}
          className={`px-4 py-2 ${activeTab === 'files' ? 
            'border-b-2 border-blue-500 text-blue-600' : 
            'text-gray-500 hover:text-gray-700'}`}
        >
          My Files {retrievedFiles.length > 0 && `(${retrievedFiles.length})`}
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {activeTab === 'retrieve' && (
        <div>
          <form onSubmit={retrieveFile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pinata JWT Token:
              </label>
              <input
                type="password"
                value={jwt}
                onChange={(e) => setJwt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Pinata JWT"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Saved in your browser for convenience
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IPFS CID:
              </label>
              <input
                type="text"
                value={cid}
                onChange={(e) => setCid(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter CID (e.g., bafybeif...)"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded font-medium text-white ${
                loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Processing...' : 'Retrieve File'}
            </button>
          </form>
          
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-4">
            <h3 className="font-medium text-blue-800 mb-2">How This Works</h3>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>Enter your Pinata JWT token and the CID of the file you want to access</li>
              <li>The app will generate a temporary access link that lasts for 10 days</li>
              <li>All your access links are saved in the "My Files" tab</li>
              <li>You can view, download, or generate new links if they expire</li>
              <li>All links are saved in your browser for easy future access</li>
            </ul>
          </div>
        </div>
      )}
      
      {activeTab === 'files' && (
        <div>
          {retrievedFiles.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No files retrieved yet.</p>
              <button 
                onClick={() => setActiveTab('retrieve')}
                className="mt-2 text-blue-600 hover:underline"
              >
                Retrieve your first file
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h3 className="font-medium">Your Retrieved Files</h3>
                <button 
                  onClick={() => setRetrievedFiles([])}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Clear All
                </button>
              </div>
              
              <div className="space-y-4">
                {retrievedFiles.map((file, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-3 flex justify-between items-center border-b">
                      <div className="font-medium truncate">
                        {file.fileName}
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">CID:</span> 
                          <span className="ml-1 font-mono bg-gray-100 px-1 rounded">{file.cid.substring(0, 16)}...</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Type:</span> 
                          <span className="ml-1">{file.fileType.split('/')[1] || file.fileType}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Retrieved:</span> 
                          <span className="ml-1">{formatDate(file.timestamp)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Expires:</span> 
                          <span className={`ml-1 ${isExpired(file.expiresAt) ? 'text-red-600 font-medium' : ''}`}>
                            {isExpired(file.expiresAt) ? 'EXPIRED' : formatDate(file.expiresAt)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={file.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 py-1.5 rounded text-white bg-blue-600 hover:bg-blue-700 text-sm flex-grow text-center
                            ${isExpired(file.expiresAt) ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                          onClick={(e) => {
                            if (isExpired(file.expiresAt)) {
                              e.preventDefault();
                              setError('This link has expired. Please regenerate the link.');
                            }
                          }}
                        >
                          View File
                        </a>
                        
                        <button
                          onClick={() => downloadFile(file.downloadUrl, file.fileName)}
                          disabled={isExpired(file.expiresAt)}
                          className={`px-3 py-1.5 rounded text-white bg-green-600 hover:bg-green-700 text-sm flex-grow
                            ${isExpired(file.expiresAt) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Download
                        </button>
                        
                        <button
                          onClick={() => regenerateLink(index)}
                          disabled={loading}
                          className={`px-3 py-1.5 rounded text-white text-sm flex-grow
                            ${isExpired(file.expiresAt) ? 
                              'bg-red-600 hover:bg-red-700' : 
                              'bg-gray-600 hover:bg-gray-700'}`}
                        >
                          {loading ? 'Processing...' : isExpired(file.expiresAt) ? 'Regenerate Link' : 'Refresh Link'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PinataPersistentRetriever;