// components/LevelSelector.js - Enhanced for Subjects
import { useState, useEffect } from 'react';
import { getCurrentLevel, getMaxUnlockedLevel, setCurrentLevel, getCurrentSubject } from '../utils/storage';

export default function LevelSelector({ onLevelSelect, subject }) {
  const [currentLevel, setCurrentLevelState] = useState(1);
  const [maxUnlocked, setMaxUnlocked] = useState(1);

  useEffect(() => {
    setCurrentLevelState(getCurrentLevel());
    setMaxUnlocked(getMaxUnlockedLevel());
  }, [subject]);

  const handleLevelSelect = (level) => {
    setCurrentLevel(level);
    setCurrentLevelState(level);
    if (onLevelSelect) {
      onLevelSelect(level);
    }
  };

  const renderLevelButton = (level) => {
    const isUnlocked = level <= maxUnlocked;
    const isCompleted = level < maxUnlocked;
    const isCurrent = level === currentLevel;

    return (
      <button
        key={level}
        className={`level-button ${isUnlocked ? 'unlocked' : 'locked'} ${
          isCurrent ? 'current' : ''
        } ${isCompleted ? 'completed' : ''}`}
        onClick={() => isUnlocked && handleLevelSelect(level)}
        disabled={!isUnlocked}
        style={{
          padding: 'clamp(12px, 3vw, 16px)',
          borderRadius: 'clamp(8px, 2vw, 12px)',
          border: '2px solid',
          borderColor: isUnlocked ? '#2563eb' : '#94a3b8',
          backgroundColor: isCompleted
            ? '#dcfce7'
            : isCurrent
            ? '#dbeafe'
            : isUnlocked
            ? '#f8fafc'
            : '#f1f5f9',
          color: isUnlocked ? '#1e293b' : '#94a3b8',
          cursor: isUnlocked ? 'pointer' : 'not-allowed',
          fontSize: 'clamp(14px, 3vw, 16px)',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          minWidth: 'clamp(80px, 15vw, 120px)',
          position: 'relative',
          opacity: isUnlocked ? 1 : 0.6,
        }}
      >
        <div style={{ marginBottom: '4px' }}>
          {isCompleted ? '✅' : isUnlocked ? (isCurrent ? '🎯' : '🔓') : '🔒'}
        </div>
        <div>Level {level}</div>
        {isCompleted && (
          <div style={{ fontSize: '10px', color: '#059669', marginTop: '2px' }}>
            Completed
          </div>
        )}
        {!isUnlocked && (
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
            Locked
          </div>
        )}
      </button>
    );
  };

  return (
    <div
      className="level-selector"
      style={{
        display: 'flex',
        gap: 'clamp(12px, 3vw, 20px)',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: 'clamp(8px, 2vw, 16px)',
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 'clamp(12px, 3vw, 16px)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(37, 99, 235, 0.2)',
      }}
    >
      {[1, 2, 3].map(renderLevelButton)}
      
      <style jsx>{`
        .level-button:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);
        }

        .level-button.current {
          border-color: #1d4ed8;
          background: #dbeafe;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .level-button.completed {
          border-color: #059669;
          background: #dcfce7;
        }

        @media (max-width: 480px) {
          .level-selector {
            flex-direction: column;
            align-items: center;
            max-width: 200px;
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
}
