import React, { useState } from 'react';
import axios from 'axios';
import './index.css'; // optional CSS if you want styles

const AIAssistant = ({ role, userName }) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!input.trim()) {
      alert('Please enter a symptom or description');
      return;
    }

    setLoading(true);
    setResponse('');

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/ai/analyze`, {
        symptom: input,
        role,
        name: userName,
      });

      // Auto formatting for bullet points if needed
      const formatted = res.data.result
        .replace(/\*\*(.*?)\*\*/g, (_, bold) => `\n🔹 ${bold}`)
        .replace(/(\d+)\.\s/g, '\n$1️⃣ ')
        .replace(/\n{2,}/g, '\n\n');

      setResponse(formatted);
    } catch (err) {
      setResponse('❌ Error getting AI response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-assistant">
      <h3>🧠 AI Dermatologist Assistant ({role})</h3>

      <textarea
        rows={1}
        className="ai-textarea"
        placeholder="Enter symptoms or description..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button className="ai-analyze-btn" onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Analyzing...' : 'Get Suggestion'}
      </button>

      {response && (
        <div className="ai-response-box">
          <strong>🗒️ AI Response:</strong>
          <pre className="ai-response-text">{response}</pre>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
