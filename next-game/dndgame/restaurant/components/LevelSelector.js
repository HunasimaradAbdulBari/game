import { useState, useEffect } from 'react';
import { getCurrentLevel, getMaxUnlockedLevel, setCurrentLevel } from '../utils/storage';
import Button from './Button';

export default function LevelSelector({ onLevelSelect }) {
  const [currentLevel, setCurrentLevelState] = useState(1);
  const [maxUnlocked, setMaxUnlocked] = useState(1);

  useEffect(() => {
    setCurrentLevelState(getCurrentLevel());
    setMaxUnlocked(getMaxUnlockedLevel());
  }, []);

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
      <div
        key={level}
        className={`level-button ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '8px',
          cursor: isUnlocked ? 'pointer' : 'not-allowed',
          background: isUnlocked 
            ? (isCompleted ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' 
               : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)')
            : 'linear-gradient(135deg, #9ca3af 0%, #d1d5db 100%)',
          color: '#ffffff',
          boxShadow: isUnlocked 
            ? '0 4px 12px rgba(99, 102, 241, 0.4)' 
            : '0 4px 12px rgba(156, 163, 175, 0.4)',
          border: isCurrent ? '3px solid #fbbf24' : '2px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: 'scale(1)'
        }}
        onClick={() => isUnlocked && handleLevelSelect(level)}
        onMouseEnter={(e) => {
          if (isUnlocked) {
            e.currentTarget.style.transform = 'scale(1.05)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <div style={{ fontSize: '32px', fontWeight: '900', marginBottom: '4px' }}>
          {level}
        </div>
        <div style={{ fontSize: '16px' }}>
          {isCompleted ? '✓' : isUnlocked ? '▶' : '🔒'}
        </div>
      </div>
    );
  };

  return (
    <div className="level-selector">
      <h3 style={{ 
        textAlign: 'center', 
        marginBottom: '24px', 
        color: '#6366f1',
        fontSize: '20px',
        fontWeight: '700'
      }}>
        Choose Your Challenge:
      </h3>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        gap: '16px'
      }}>
        {[1, 2, 3].map(renderLevelButton)}
      </div>
    </div>
  );
}
