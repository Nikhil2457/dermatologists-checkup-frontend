import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminClarifyIssuesModal = ({ onClose }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clarifying, setClarifying] = useState('');

  useEffect(() => {
    fetchIssues();
    // eslint-disable-next-line
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/support-issue/all`, { withCredentials: true });
      setIssues(res.data.issues || []);
    } catch (err) {
      setError('Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  };

  const handleClarify = async (tokenId) => {
    setClarifying(tokenId);
    setError(null);
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/support-issue/${tokenId}/clarify`, {}, { withCredentials: true });
      await fetchIssues();
    } catch (err) {
      setError('Failed to clarify issue');
    } finally {
      setClarifying('');
    }
  };

  return (
    <div style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#fff', borderRadius:16, padding:32, minWidth:380, maxWidth:520, boxShadow:'0 8px 32px rgba(0,0,0,0.2)', position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:12, right:16, background:'none', border:'none', fontSize:20, cursor:'pointer' }}>×</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <span style={{ fontSize: 28 }} role="img" aria-label="Support">🛎️</span>
          <span style={{ fontSize: 22, fontWeight: 600, color: '#a86b00', letterSpacing: 0.5 }}>Clarify Support Issues</span>
        </div>
        {loading ? <p>Loading...</p> : (
          <>
            {issues.length === 0 && <div style={{ color:'#888' }}>No issues raised yet.</div>}
            {issues.length > 0 && (
              <ul style={{ background: '#f4f6fb', borderRadius: 8, padding: '10px 14px', marginBottom: 12, color: '#222', fontSize: 15, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', maxHeight: 320, overflowY: 'auto', listStyle: 'none' }}>
                {issues.map(issue => (
                  <li key={issue.tokenId} style={{ marginBottom: 13, color: '#333', fontSize: 15, lineHeight: 1.4, wordBreak: 'break-word', borderBottom: '1px solid #e0e0e0', paddingBottom: 7 }}>
                    <div><span style={{ fontWeight: 'bold', color: '#1976d2' }}>#{issue.tokenId}</span> <span style={{ color:'#888', fontSize:13 }}>({issue.role})</span>  <span style={{ fontWeight: 'bold', color: '#1976d2' }}>(+91){issue.phone}</span></div>
                    <div style={{ margin: '2px 0 4px 0' }}>{issue.issue}</div>
                    <div>
                      <span style={{ fontWeight: 'bold', color: issue.status === 'pending' ? '#e67e22' : '#27ae60', marginRight: 8 }}>{issue.status}</span>
                      {issue.status === 'pending' && (
                        <button
                          style={{ padding: '4px 12px', borderRadius: 6, background: '#27ae60', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 14, marginLeft: 8, opacity: clarifying === issue.tokenId ? 0.7 : 1 }}
                          disabled={clarifying === issue.tokenId}
                          onClick={() => handleClarify(issue.tokenId)}
                        >
                          {clarifying === issue.tokenId ? 'Clarifying...' : 'Mark as Clarified'}
                        </button>
                      )}
                      {issue.status === 'clarified' && issue.clarifiedAt && (
                        <span style={{ color:'#888', fontSize:12, marginLeft:8 }}> (clarified {new Date(issue.clarifiedAt).toLocaleString()})</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {error && <div style={{ color:'red', marginBottom:10 }}>{error}</div>}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminClarifyIssuesModal; 