// components/LevelSelector.js
import { useState, useEffect } from 'react';
import { getCurrentLevel, getMaxUnlockedLevel, setCurrentLevel } from '../utils/storage';

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
      <button
        key={level}
        className={`level-button ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}
        onClick={() => isUnlocked && handleLevelSelect(level)}
        disabled={!isUnlocked}
      >
        <div className="level-number">{level}</div>
        <div className="level-status">
          {!isUnlocked && '🔒'}
          {isCompleted && '✅'}
          {isCurrent && isUnlocked && '🎯'}
          {isUnlocked && !isCompleted && !isCurrent && '⭐'}
        </div>
        <div className="level-label">
          {!isUnlocked ? 'Locked' : isCompleted ? 'Complete' : isCurrent ? 'Current' : 'Available'}
        </div>
        
        <style jsx>{`
          .level-button {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: clamp(100px, 15vw, 140px);
            height: clamp(100px, 15vw, 140px);
            border: none;
            border-radius: 20px;
            background: linear-gradient(135deg, #ffffff 0%, #f8fdff 100%);
            border: 2px solid rgba(33, 150, 243, 0.2);
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(33, 150, 243, 0.08);
          }

          .level-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent, rgba(33, 150, 243, 0.05), transparent);
            transform: translateX(-100%);
            transition: transform 0.6s;
          }

          .level-button:hover::before {
            transform: translateX(100%);
          }

          .level-button:hover {
            transform: translateY(-4px) scale(1.05);
            box-shadow: 0 16px 40px rgba(33, 150, 243, 0.15);
            border-color: rgba(33, 150, 243, 0.4);
          }

          .level-button.current {
            background: linear-gradient(135deg, #2196f3 0%, #21cbf3 100%);
            color: white;
            border-color: #1976d2;
            box-shadow: 0 12px 32px rgba(33, 150, 243, 0.2);
          }

          .level-button.completed {
            background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
            color: white;
            border-color: #388e3c;
          }

          .level-button.locked {
            background: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%);
            color: #9e9e9e;
            cursor: not-allowed;
            border-color: #e0e0e0;
          }

          .level-button.locked:hover {
            transform: none;
            box-shadow: 0 8px 24px rgba(33, 150, 243, 0.08);
          }

          .level-number {
            font-size: clamp(24px, 5vw, 36px);
            font-weight: 800;
            margin-bottom: 4px;
          }

          .level-status {
            font-size: clamp(16px, 3vw, 24px);
            margin-bottom: 4px;
          }

          .level-label {
            font-size: clamp(10px, 2vw, 14px);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            opacity: 0.9;
          }

          .level-button:active {
            transform: translateY(-2px) scale(1.02);
          }
        `}</style>
      </button>
    );
  };

  return (
    <div className="level-selector">
      <div className="levels-grid">
        {[1, 2, 3].map(level => renderLevelButton(level))}
      </div>
      
      <style jsx>{`
        .level-selector {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .levels-grid {
          display: flex;
          gap: clamp(16px, 4vw, 24px);
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 480px) {
          .levels-grid {
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
