'use client';
import { useState, useEffect } from 'react';
import { LevelSelectorProps } from '../../types';
import { getCurrentLevel, getMaxUnlockedLevel, setCurrentLevel } from './utils/storage';

const LevelSelector: React.FC<LevelSelectorProps> = ({ onLevelSelect, subject }) => {
  const [currentLevel, setCurrentLevelState] = useState<number>(1);
  const [maxUnlocked, setMaxUnlocked] = useState<number>(1);

  useEffect(() => {
    setCurrentLevelState(getCurrentLevel());
    setMaxUnlocked(getMaxUnlockedLevel());
  }, [subject]);

  const handleLevelSelect = (level: number): void => {
    setCurrentLevel(level);
    setCurrentLevelState(level);
    if (onLevelSelect) {
      onLevelSelect(level);
    }
  };

  const renderLevelButton = (level: number): JSX.Element => {
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
        {/* Button content */}
      </button>
    );
  };

  return (
    <div className="level-selector">
      {[1, 2, 3].map(renderLevelButton)}
    </div>
  );
};

export default LevelSelector;