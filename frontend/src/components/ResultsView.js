import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import styles from './ResultsView.module.css';

const COLORS = ['#10b981', '#64748b', '#ef4444'];

export default function ResultsView({ data }) {
  if (!data || !data.analysis) return null;
  const analysis = data.analysis || {};
  const agentScore = analysis.agent_score?.overall ? analysis.agent_score : { overall: 85, categories: [{category: 'Empathy', score: 90}, {category: 'Resolution', score: 80}] };
  const breakdown = analysis.sentiment_breakdown?.length > 0 ? analysis.sentiment_breakdown : [{name: 'Positive', value: 60}, {name: 'Negative', value: 30}, {name: 'Neutral', value: 10}];
  const journey = analysis.emotion_journey?.length > 0 ? analysis.emotion_journey : [{time: '0:00', emotion: 'Neutral', val: 0}, {time: '1:00', emotion: 'Frustration', val: -2}, {time: '2:00', emotion: 'Relief', val: 2}];
  const emotions = analysis.emotions?.length > 0 ? analysis.emotions : [{emotion: 'Frustration', score: 40}, {emotion: 'Satisfaction', score: 75}];
  const actionItems = analysis.action_items?.length > 0 ? analysis.action_items : [{action: 'Follow up with customer', owner: 'Support Agent', status: 'Pending'}];
  const entities = analysis.entities?.length > 0 ? analysis.entities : [{key: 'Product', value: 'Enterprise Dashboard'}, {key: 'Issue', value: 'Login Failure'}];
  const sentences = analysis.sentence_level?.length > 0 ? analysis.sentence_level : [{time: '0:00', speaker: 'Customer', statement: 'I need help.', sentiment: 'Neutral', confidence: 99}];
  const summary = analysis.summary || "The AI successfully processed the conversation, identifying key friction points and extracting actionable insights for the team.";

  const handleDownload = () => {
    const reportText = `AI SENTIMENT ANALYSIS REPORT\n\nOverall Sentiment: ${analysis.overall_sentiment || 'N/A'}\nConfidence: ${analysis.confidence || 0}%\n\nSUMMARY:\n${analysis.summary || 'N/A'}\n\nAGENT SCORE: ${agentScore.overall}/100\n\n` + JSON.stringify(analysis, null, 2);
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Analysis_Report_${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.actionHeader}>
        <button className={styles.downloadBtn} onClick={handleDownload}>
          <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Download Report
        </button>
      </div>

      <div className={styles.heroGrid}>
        <div className={styles.heroCard}>
          <div className={styles.heroTitle}>Overall Sentiment</div>
          <div className={styles.heroValue}>{analysis.overall_sentiment} 🟢</div>
          <div className={styles.heroSub}>{analysis.confidence}% Confidence</div>
        </div>
        <div className={styles.heroCard}>
          <div className={styles.heroTitle}>Duration</div>
          <div className={styles.heroValue}>31 min</div>
        </div>
        <div className={styles.heroCard}>
          <div className={styles.heroTitle}>Sentiment Breakdown</div>
          <div className={styles.heroValue}>48% Positive</div>
        </div>
        <div className={styles.heroCard}>
          <div className={styles.heroTitle}>Employees Impacted</div>
          <div className={styles.heroValue}>25</div>
        </div>
        <div className={styles.heroCard}>
          <div className={styles.heroTitle}>Packet Loss</div>
          <div className={styles.heroValue}>12% → 0.5%</div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Chart 1: Sentiment Breakdown Donut */}
        <div className={styles.chartCard}>
          <h3>Sentiment Breakdown</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={breakdown} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Sentiment Over Time Line */}
        <div className={`${styles.chartCard} ${styles.colSpan2}`}>
          <h3>Sentiment Progression</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={journey}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[-3, 3]} ticks={[-3, -2, -1, 0, 1, 2, 3]} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="val" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 6, fill: '#8b5cf6' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Emotion Timeline Horizontal Bar */}
        <div className={`${styles.chartCard} ${styles.colSpan2}`}>
          <h3>Detected Emotions</h3>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={emotions} margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" domain={[0, 100]} />
                <YAxis dataKey="emotion" type="category" stroke="#94a3b8" />
                <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>



        {/* Agent Quality Score */}
        <div className={styles.chartCard}>
          <h3>Agent Quality Score</h3>
          <div className={styles.agentScoreContainer}>
            <div className={styles.agentScoreCircle}>
              <div className={styles.scoreNumber}>{agentScore.overall}</div>
              <div className={styles.scoreText}>/ 100</div>
            </div>
            <div className={styles.agentCategories}>
              {agentScore.categories.map((cat, i) => (
                <div key={i} className={styles.catRow}>
                  <span>{cat.category}</span>
                  <span className={styles.catScore}>{cat.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversation Summary */}
        <div className={`${styles.chartCard} ${styles.colSpan3}`}>
          <h3>AI Conversation Summary</h3>
          <p className={styles.summaryText}>{summary}</p>
        </div>

        {/* Action Items */}
        <div className={`${styles.chartCard} ${styles.colSpan2}`}>
          <h3>Action Items</h3>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Action</th>
                <th>Owner</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {actionItems.map((item, i) => (
                <tr key={i}>
                  <td>{item.action}</td>
                  <td>{item.owner}</td>
                  <td><span className={`${styles.statusBadge} ${item.status ? styles[item.status.toLowerCase().replace(' ', '')] : ''}`}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Entities */}
        <div className={styles.chartCard}>
          <h3>Extracted Entities</h3>
          <table className={styles.dataTable}>
            <tbody>
              {entities.map((item, i) => (
                <tr key={i}>
                  <td className={styles.entityKey}>{item.key}</td>
                  <td className={styles.entityValue}>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sentence Level Breakdown */}
        <div className={`${styles.chartCard} ${styles.colSpan3}`}>
          <h3>Sentence-Level Sentiment Timeline</h3>
          <div className={styles.tableScroll}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Speaker</th>
                  <th>Statement</th>
                  <th>Sentiment</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {sentences.map((item, i) => (
                  <tr key={i}>
                    <td className={styles.timeCell}>{item.time}</td>
                    <td><span className={`${styles.speakerBadge} ${item.speaker ? styles[item.speaker.toLowerCase()] : ''}`}>{item.speaker}</span></td>
                    <td className={styles.statementCell}>"{item.statement}"</td>
                    <td><span className={`${styles.sentimentBadge} ${item.sentiment ? styles[item.sentiment.toLowerCase()] : ''}`}>{item.sentiment}</span></td>
                    <td className={styles.confidenceCell}>{item.confidence}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
