// src/app/debug/page.js - Debug Page for Question History Management
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { getQuestionHistoryStats } from '../../utils/gameLogic';
import { clearQuestionHistory } from '../../services/groqService';

export default function DebugPage() {
  const router = useRouter();
  const [stats, setStats] = useState({});
  const [history, setHistory] = useState({});

  const loadStats = () => {
    const currentStats = getQuestionHistoryStats();
    setStats(currentStats);
    
    // Load full history
    const subjects = ['physics', 'chemistry', 'electronics'];
    const levels = [1, 2, 3];
    const fullHistory = {};
    
    subjects.forEach(subject => {
      fullHistory[subject] = {};
      levels.forEach(level => {
        try {
          const historyKey = `question_history_${subject}_${level}`;
          const levelHistory = JSON.parse(sessionStorage.getItem(historyKey) || '[]');
          fullHistory[subject][level] = levelHistory;
        } catch {
          fullHistory[subject][level] = [];
        }
      });
    });
    
    setHistory(fullHistory);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleClearHistory = (subject, level) => {
    clearQuestionHistory(subject, level);
    loadStats();
  };

  const handleClearAllHistory = () => {
    const subjects = ['physics', 'chemistry', 'electronics'];
    const levels = [1, 2, 3];
    
    subjects.forEach(subject => {
      levels.forEach(level => {
        clearQuestionHistory(subject, level);
      });
    });
    
    loadStats();
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Layout scene="menu">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: 'clamp(16px, 4vw, 32px)',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          margin: '16px',
          overflow: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1
            style={{
              fontSize: 'clamp(20px, 5vw, 28px)',
              fontWeight: '800',
              color: '#1e293b',
              marginBottom: '8px',
            }}
          >
            🐛 Debug Console
          </h1>
          <p
            style={{
              fontSize: 'clamp(12px, 3vw, 16px)',
              color: '#64748b',
              fontWeight: '500',
            }}
          >
            Question History Management
          </p>
        </div>

        {/* Controls */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '24px',
          }}
        >
          <Button variant="secondary" onClick={loadStats}>
            🔄 Refresh Stats
          </Button>
          <Button variant="danger" onClick={handleClearAllHistory}>
            🗑️ Clear All History
          </Button>
          <Button variant="secondary" onClick={() => router.push('/')}>
            ← Back to Menu
          </Button>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {Object.entries(stats).map(([subject, levels]) => (
            <div
              key={subject}
              style={{
                background: 'rgba(37, 99, 235, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                border: '2px solid rgba(37, 99, 235, 0.1)',
              }}
            >
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#2563eb',
                  marginBottom: '12px',
                  textTransform: 'capitalize',
                }}
              >
                {subject === 'physics' && '⚡'} 
                {subject === 'chemistry' && '🧪'} 
                {subject === 'electronics' && '💡'} 
                {subject}
              </h3>
              
              {Object.entries(levels).map(([level, data]) => (
                <div
                  key={level}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                    fontSize: '14px',
                  }}
                >
                  <span style={{ fontWeight: '600', color: '#475569' }}>
                    Level {level}:
                  </span>
                  <span style={{ color: '#64748b' }}>
                    {data.count} questions
                  </span>
                  <button
                    onClick={() => handleClearHistory(subject, parseInt(level))}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                    disabled={data.count === 0}
                  >
                    Clear
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Detailed History */}
        <div
          style={{
            background: 'rgba(100, 116, 139, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(100, 116, 139, 0.1)',
            overflow: 'auto',
            maxHeight: '400px',
          }}
        >
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '12px',
            }}
          >
            📋 Detailed Question History
          </h3>
          
          {Object.entries(history).map(([subject, levels]) => (
            <div key={subject} style={{ marginBottom: '16px' }}>
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#2563eb',
                  marginBottom: '8px',
                  textTransform: 'capitalize',
                }}
              >
                {subject}
              </h4>
              
              {Object.entries(levels).map(([level, questions]) => (
                <div key={level} style={{ marginLeft: '16px', marginBottom: '8px' }}>
                  <h5
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#475569',
                      marginBottom: '4px',
                    }}
                  >
                    Level {level} ({questions.length} questions):
                  </h5>
                  
                  {questions.length === 0 ? (
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginLeft: '12px' }}>
                      No questions generated yet
                    </p>
                  ) : (
                    questions.map((q, idx) => (
                      <div
                        key={idx}
                        style={{
                          marginLeft: '12px',
                          marginBottom: '4px',
                          fontSize: '10px',
                          color: '#64748b',
                          borderLeft: '2px solid #e5e7eb',
                          paddingLeft: '8px',
                        }}
                      >
                        <div style={{ fontWeight: '500' }}>"{q.request}"</div>
                        <div>Required: {q.required?.join(', ')}</div>
                        <div>Generated: {formatTimestamp(q.timestamp)}</div>
                        <div>Source: {q.source || 'unknown'}</div>
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div
          style={{
            background: 'rgba(34, 197, 94, 0.05)',
            borderRadius: '8px',
            padding: '12px',
            marginTop: '16px',
            border: '1px solid rgba(34, 197, 94, 0.2)',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: '#059669',
              margin: 0,
              fontWeight: '500',
            }}
          >
            💡 <strong>How it works:</strong> The app tracks generated questions in browser 
            session storage to ensure each refresh/replay gives you completely unique questions. 
            Clear history to reset and start fresh!
          </p>
        </div>
      </div>
    </Layout>
  );
}