import { useState } from 'react';
import FileUpload from './FileUpload';
import ResultsView from './ResultsView';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [fileContent, setFileContent] = useState(null);
  const [analysisState, setAnalysisState] = useState('idle'); // idle, processing, complete
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = async (text) => {
    setFileContent(text);
    setAnalysisState('processing');
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });
      
      if (!res.ok) throw new Error('Analysis request failed');
      
      const data = await res.json();
      
      if (data.status === 'complete') {
        setResultData(data);
        setAnalysisState('complete');
      } else {
        throw new Error('Analysis failed or returned invalid status.');
      }
      
    } catch (err) {
      setError(err.message);
      setAnalysisState('idle');
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>AI Sentiment Analyzer</div>
        <button 
          className={styles.logoutBtn}
          onClick={() => {
            localStorage.clear();
            window.location.href = '/';
          }}
        >
          Logout
        </button>
      </header>
      
      <div className={styles.content}>
        {analysisState === 'idle' && (
          <FileUpload onUpload={handleFileUpload} />
        )}
        
        {analysisState === 'processing' && (
          <div className={styles.statusBox}>
            <div className={styles.spinner}></div>
            <h2>Processing Analysis...</h2>
            <p>Our agentic workflow is analyzing sentiment, redacting PII, and extracting KPIs.</p>
          </div>
        )}
        
        {analysisState === 'complete' && resultData && (
          <ResultsView data={resultData} />
        )}
        
        {error && (
          <div className={styles.errorBox}>{error}</div>
        )}
      </div>
    </div>
  );
}
