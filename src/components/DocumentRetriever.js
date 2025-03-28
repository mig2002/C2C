import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DocumentRetriever = ({ userRole, caseId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Check if user has permission to retrieve documents
  const canRetrieve = userRole === 'judge';

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
      const response = await axios.get('/api/documents', {
        params: { caseId },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setDocuments(response.data.files || []);
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

  // Fetch documents when caseId changes
  useEffect(() => {
    if (canRetrieve && caseId) {
      fetchDocuments();
    }
  }, [caseId]);

  const viewDocument = (cid) => {
    // Open IPFS gateway URL in new tab
    window.open(`https://gateway.pinata.cloud/ipfs/${cid}`, '_blank');
  };

  if (!canRetrieve) {
    return (
      <div className="section">
        <h2>Case Documents</h2>
        <p>Only judges can view the complete document history.</p>
      </div>
    );
  }

  return (
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
            readOnly
            style={{ flex: 1 }}
          />
          <button 
            onClick={fetchDocuments}
            disabled={loading || !caseId}
            className="secondary"
            style={{ width: 'auto' }}
          >
            Refresh
          </button>
        </div>
      </div>
      
      {loading ? (
        <p>Loading documents...</p>
      ) : documents.length > 0 ? (
        <div>
          <p>Total documents: {documents.length}</p>
          <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ccc' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ccc' }}>Timestamp</th>
                  <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ccc' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, index) => (
                  <tr key={doc.cid || index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '8px' }}>{doc.name || 'Unnamed Document'}</td>
                    <td style={{ padding: '8px' }}>{doc.timestamp ? new Date(doc.timestamp).toLocaleString() : 'Unknown'}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>
                      <button 
                        onClick={() => viewDocument(doc.cid)}
                        className="secondary"
                        style={{ 
                          width: 'auto', 
                          padding: '5px 10px', 
                          fontSize: '0.875rem' 
                        }}
                      >
                        View
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
  );
};

export default DocumentRetriever;