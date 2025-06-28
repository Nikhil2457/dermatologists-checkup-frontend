import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ContactUsModal = ({ userRole, onClose }) => {
  const [user, setUser] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issueText, setIssueText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        let userRes, dermRes;
        
        try {
          userRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/patient/me`, { 
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (err) {
          try {
            dermRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/dermatologist/me`, { 
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (dermErr) {
            console.log('No user logged in');
            return;
          }
        }
        if (userRole === 'patient') {
          setUser(userRes.data);
        } else {
          const userObj = dermRes.data.user;
          const profile = dermRes.data.profile;
          setUser({
            username: profile.name,
            phoneNumber: profile.phoneNumber,
            role: userObj.role
          });
        }
        await fetchIssues();
      } catch (err) {
        setError('Failed to load user or issues');
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [userRole]);

  const pendingIssue = issues.find(i => i.status === 'pending');

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem('token');
      const issuesRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/support-issue/mine`, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      setIssues(issuesRes.data.issues || []);
    } catch (err) {
      console.error('Error fetching issues:', err);
    }
  };

  const submitIssue = async (e) => {
    e.preventDefault();
    if (!issueText.trim()) {
      toast.error('Please enter an issue description');
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/support-issue`, { issue: issueText }, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Issue submitted successfully!');
      setIssueText('');
      await fetchIssues();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit issue');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#fff', borderRadius:16, padding:32, minWidth:340, maxWidth:400, boxShadow:'0 8px 32px rgba(0,0,0,0.2)', position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:12, right:16, background:'none', border:'none', fontSize:20, cursor:'pointer' }}>×</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 28 }} role="img" aria-label="Contact">🛎️</span>
          <span style={{ fontSize: 22, fontWeight: 600, color: '#a86b00', letterSpacing: 0.5 }}>Contact Support</span>
        </div>
        {loading ? <p>Loading...</p> : user && (
          <>
            <div style={{ marginBottom:16, background: '#f8f9fa', borderRadius: 8, padding: '12px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', fontSize: 15, color: '#333', marginTop: 18 }}>
              <div><b>Name:</b> {user.username}</div>
              <div><b>Phone:</b> {user.phoneNumber}</div>
              <div><b>Role:</b> {user.role}</div>
            </div>
            <div style={{ marginBottom:16 }}>
              <b>Previous Issues:</b>
              {issues.length === 0 && <div style={{ color:'#888' }}>No issues raised yet.</div>}
              {issues.length > 0 && (
                <ul style={{ background: '#f4f6fb', borderRadius: 8, padding: '10px 14px', marginBottom: 12, color: '#222', fontSize: 15, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', maxHeight: 120, overflowY: 'auto', listStyle: 'none' }}>
                  {issues.map(issue => (
                    <li key={issue.tokenId} style={{ marginBottom: 7, color: '#333', fontSize: 15, lineHeight: 1.4, wordBreak: 'break-word' }}>
                      <span style={{ fontWeight: 'bold', color: '#1976d2' }}>#{issue.tokenId}</span> - {issue.issue}
                      <br />
                      <span style={{ fontWeight: 'bold', color: issue.status === 'pending' ? '#e67e22' : '#27ae60', marginLeft: 6 }}>{issue.status}</span>
                      {issue.status === 'clarified' && issue.clarifiedAt && (
                        <span style={{ color:'#888', fontSize:12 }}> (clarified {new Date(issue.clarifiedAt).toLocaleString()})</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {pendingIssue ? (
              <div style={{ color:'orange', marginBottom:16 }}>
                <b>Pending Issue:</b> <br/>
                <span>Token: #{pendingIssue.tokenId}</span><br/>
                <span>{pendingIssue.issue}</span><br/>
                <span>Status: <b>pending</b></span><br/>
                <span style={{ fontSize:13, color:'#888' }}>You can raise a new issue after this is clarified.</span>
              </div>
            ) : (
              <form onSubmit={submitIssue} style={{ marginBottom:16 }}>
                <label htmlFor="contact-issue">Describe your problem:</label>
                <textarea
                  id="contact-issue"
                  value={issueText}
                  onChange={e => setIssueText(e.target.value)}
                  rows={3}
                  style={{ width:'100%', marginTop:6, marginBottom:10, borderRadius:6, border:'1px solid #ccc', padding:8 }}
                  required
                  disabled={submitting}
                />
                <button type="submit" style={{ width:'100%', padding:10, borderRadius:8, background:'#4fa94d', color:'#fff', fontWeight:'bold', border:'none', cursor:'pointer', fontSize:16 }} disabled={submitting || !issueText.trim()}>
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </form>
            )}
            {success && (
              <div style={{ color:'green', marginBottom:10 }}>
                <b>Issue raised!</b> Your token ID: <b>#{success.tokenId}</b><br/>
                Our team will solve this within 12 hours and reach you with a call.
              </div>
            )}
            {error && <div style={{ color:'red', marginBottom:10 }}>{error}</div>}
          </>
        )}
      </div>
    </div>
  );
};

export default ContactUsModal; 