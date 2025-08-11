// src/components/LevelSelector.js - Enhanced for Subjects
'use client';

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
          padding: 'clamp(10px, 2.5vw, 16px)',
          borderRadius: 'clamp(6px, 1.5vw, 12px)',
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
          fontSize: 'clamp(12px, 2.5vw, 16px)',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          minWidth: 'clamp(70px, 15vw, 120px)',
          minHeight: 'clamp(80px, 18vw, 120px)',
          position: 'relative',
          opacity: isUnlocked ? 1 : 0.6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(2px, 0.5vw, 4px)',
        }}
      >
        <div style={{ fontSize: 'clamp(16px, 3.5vw, 24px)' }}>
          {isCompleted ? '✅' : isUnlocked ? (isCurrent ? '🎯' : '🔓') : '🔒'}
        </div>
        <div style={{ fontSize: 'clamp(11px, 2.2vw, 14px)', fontWeight: '700' }}>
          Level {level}
        </div>
        {isCompleted && (
          <div style={{ 
            fontSize: 'clamp(8px, 1.6vw, 10px)', 
            color: '#059669', 
            fontWeight: '600',
            lineHeight: '1'
          }}>
            Completed
          </div>
        )}
        {!isUnlocked && (
          <div style={{ 
            fontSize: 'clamp(8px, 1.6vw, 10px)', 
            color: '#64748b',
            fontWeight: '600',
            lineHeight: '1'
          }}>
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
        gap: 'clamp(8px, 2vw, 20px)',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: 'clamp(6px, 1.5vw, 16px)',
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 'clamp(8px, 2vw, 16px)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(37, 99, 235, 0.2)',
        maxWidth: '100%',
        width: '100%',
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

        @media (max-width: 768px) {
          .level-selector {
            gap: clamp(6px, 1.5vw, 12px);
            padding: clamp(4px, 1vw, 12px);
          }
        }

        @media (max-width: 480px) {
          .level-selector {
            flex-direction: column;
            align-items: center;
            max-width: clamp(150px, 40vw, 200px);
            margin: 0 auto;
            gap: clamp(4px, 1vw, 8px);
          }

          .level-button {
            width: 100%;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}