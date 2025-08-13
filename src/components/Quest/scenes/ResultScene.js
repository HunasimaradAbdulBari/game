// src/app/result/page.js - Enhanced Results with Next Level Button
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Layout from '../Layout';
import Button from '../Button';
import { getCurrentLevel, setCurrentLevel, getBasket, clearBasket, getCurrentSubject, setMaxUnlockedLevel } from '../utils/storage';
import { getLevelData, checkWin, updateProgress } from '../utils/gameLogic';

export default function ResultPage() {
  const router = useRouter();
  const [currentLevel, setCurrentLevelState] = useState(1);
  const [currentSubject, setCurrentSubject] = useState('physics');
  const [levelData, setLevelData] = useState(null);
  const [basket, setBasket] = useState([]);
  const [isWin, setIsWin] = useState(false);

  const playSound = (soundType) => {
    if (typeof window !== 'undefined') {
      try {
        const audio = new Audio(`/sounds/${soundType}.mp3`);
        audio.volume = 0.6;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log(`${soundType} sound played successfully`);
            })
            .catch((error) => {
              console.log(`Audio autoplay prevented: ${error.message}`);
              const playOnInteraction = () => {
                audio.play().catch(e => console.log('Audio play failed:', e));
                document.removeEventListener('click', playOnInteraction);
                document.removeEventListener('touchstart', playOnInteraction);
              };
              document.addEventListener('click', playOnInteraction);
              document.addEventListener('touchstart', playOnInteraction);
            });
        }
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }
  };

  useEffect(() => {
    const level = getCurrentLevel();
    const subject = getCurrentSubject();
    const data = getLevelData(level, subject);
    const currentBasket = getBasket();
    const won = checkWin(currentBasket, data);

    setCurrentLevelState(level);
    setCurrentSubject(subject);
    setLevelData(data);
    setBasket(currentBasket);
    setIsWin(won);

    if (won) {
      updateProgress(level, subject);
    }

    setTimeout(() => {
      if (won) {
        playSound('win');
      } else {
        playSound('lose');
      }
    }, 800);
  }, []);

  const handleNextLevel = () => {
    const nextLevel = currentLevel + 1;
    if (nextLevel <= 3) {
      setCurrentLevel(nextLevel);
      clearBasket();
      router.push('/restaurant');
    }
  };

  const handleTryAgain = () => {
    clearBasket();
    router.push('/restaurant');
  };

  const handleReplayLevel = () => {
    clearBasket();
    router.push('/restaurant');
  };

  const handlePlayFromStart = () => {
    setCurrentLevel(1);
    clearBasket();
    router.push('/restaurant');
  };

  const handleGoToMenu = () => {
    clearBasket();
    router.push('/');
  };

  if (!levelData) return null;

  return (
    <Layout scene="result" subject={currentSubject}>
      <div
        className="result-scene"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width:'100%',
          padding: 'clamp(12px, 3vw, 20px)',
          textAlign: 'center',
          position: 'relative',
          borderRadius: 'clamp(8px, 2vw, 10px)',
          background: isWin 
            ? 'linear-gradient(135deg, rgba(110, 231, 183, 0.9) 0%, rgba(16, 185, 129, 0.9) 100%)'
            : 'linear-gradient(145deg, rgba(248, 180, 180, 0.9) 0%, rgba(239, 68, 68, 0.9) 100%)',
        }}
      >
        {/* Celebration Particles */}
        {isWin && (
          <div
            className="celebration-particles"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={i}
                className="celebration-particle"
                style={{
                  position: 'absolute',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 8 + 4}px`,
                  height: `${Math.random() * 8 + 4}px`,
                  backgroundColor: ['#fbbf24', '#34d399', '#60a5fa', '#a78bfa'][
                    Math.floor(Math.random() * 4)
                  ],
                  borderRadius: '50%',
                  animation: `celebrate ${Math.random() * 3 + 2}s ease-out forwards`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Title */}
        <div
          className="result-title"
          style={{
            marginBottom: 'clamp(16px, 4vw, 32px)',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(24px, 6vw, 42px)',
              fontWeight: '900',
              color: '#1e293b',
              textShadow: '0 2px 4px rgba(226, 232, 240, 0.8)',
              marginBottom: 'clamp(4px, 1vw, 8px)',
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {isWin ? 'EXPERIMENT COMPLETE! 🎉' : 'TRY AGAIN! 💪'}
          </h1>
          <h2
            style={{
              fontSize: 'clamp(14px, 3vw, 24px)',
              fontWeight: '700',
              color: '#475569',
            }}
          >
            {currentSubject.charAt(0).toUpperCase() + currentSubject.slice(1)} - Level {currentLevel}
          </h2>
        </div>

        {/* Comparison Section */}
        <div
          className="comparison-section"
          style={{
            display: 'flex',
            gap: 'clamp(12px, 3vw, 24px)',
            alignItems: 'center',
            marginBottom: 'clamp(16px, 4vw, 32px)',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {/* Required Items */}
          <div
            className="comparison-card required-card"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 'clamp(8px, 2vw, 15px)',
              padding: 'clamp(12px, 3vw, 20px)',
              minWidth: '180px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '3px solid #2563eb',
            }}
          >
            <h3
              style={{
                fontSize: 'clamp(12px, 2.5vw, 16px)',
                fontWeight: '800',
                color: '#1e293b',
                marginBottom: 'clamp(6px, 1.5vw, 12px)',
              }}
            >
              Required Equipment:
            </h3>
            <div
              style={{
                fontSize: 'clamp(10px, 2vw, 14px)',
                fontWeight: '600',
                color: '#475569',
                lineHeight: '1.5',
              }}
            >
              {levelData.correctAnswer.map((item, index) => (
                <div key={index} style={{ padding: '1px 0' }}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Result Icon */}
          <div
            className={`result-icon ${isWin ? 'win' : ''}`}
            style={{
              fontSize: 'clamp(24px, 6vw, 32px)',
            }}
          >
            {isWin ? '✅' : '❌'}
          </div>

          {/* Your Basket */}
          <div
            className={`comparison-card basket-card ${isWin ? 'win' : 'lose'}`}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 'clamp(8px, 2vw, 15px)',
              padding: 'clamp(12px, 3vw, 20px)',
              minWidth: '180px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: `3px solid ${isWin ? '#10b981' : '#f87171'}`,
            }}
          >
            <h3
              style={{
                fontSize: 'clamp(12px, 2.5vw, 16px)',
                fontWeight: '800',
                color: '#1e293b',
                marginBottom: 'clamp(6px, 1.5vw, 12px)',
              }}
            >
              Your Equipment:
            </h3>
            <div
              style={{
                fontSize: 'clamp(10px, 2vw, 14px)',
                fontWeight: '600',
                color: '#475569',
                lineHeight: '1.5',
              }}
            >
              {basket.length > 0 ? basket.map((item, index) => (
                <div key={index} style={{ padding: '1px 0' }}>
                  {item}
                </div>
              )) : 'Empty'}
            </div>
          </div>
        </div>

        {/* Progress Message */}
        {isWin && currentLevel < 3 && (
          <p
            style={{
              fontSize: 'clamp(14px, 3vw, 20px)',
              fontWeight: '700',
              color: '#fbbf24',
              marginBottom: 'clamp(12px, 3vw, 24px)',
            }}
          >
            Next level unlocked! 🌟
          </p>
        )}

        {isWin && currentLevel === 3 && (
          <p
            style={{
              fontSize: 'clamp(16px, 3.5vw, 22px)',
              fontWeight: '800',
              color: '#fbbf24',
              marginBottom: 'clamp(12px, 3vw, 24px)',
            }}
          >
            You mastered {currentSubject.charAt(0).toUpperCase() + currentSubject.slice(1)}! 👑
          </p>
        )}

        {/* Action Buttons */}
        <div
          className="action-buttons"
          style={{
            display: 'flex',
            gap: 'clamp(8px, 2vw, 16px)',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: 'clamp(8px, 2vw, 16px)',
          }}
        >
          {isWin ? (
            <>
              {currentLevel < 3 ? (
                <div className="btn-conteiner">
                  <div 
                    className="btn-content"
                    onClick={handleNextLevel}
                    style={{
                      '--color-text': '#ffffff',
                      '--color-background': '#2563eb',
                      '--color-outline': '#2563eb80',
                      '--color-shadow': '#00000080',
                      cursor: 'pointer',
                    }}
                  >
                    NEXT LEVEL
                    <div className="icon-arrow">▶</div>
                  </div>
                </div>
              ) : (
                <Button variant="primary" onClick={handlePlayFromStart}>
                  PLAY AGAIN
                </Button>
              )}
              <Button variant="secondary" onClick={handleReplayLevel}>
                REPLAY LEVEL
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" onClick={handleTryAgain}>
                TRY AGAIN
              </Button>
              <Button variant="secondary" onClick={handleGoToMenu}>
                CHANGE LEVEL
              </Button>
            </>
          )}
        </div>

        {/* Main Menu Button */}
        <Button variant="secondary" onClick={handleGoToMenu}>
          MAIN MENU
        </Button>
      </div>

      <style jsx>{`
        .btn-conteiner {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .btn-content {
          display: flex;
          align-items: center;
          padding: 8px 24px;
          text-decoration: none;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: clamp(14px, 3vw, 18px);
          color: var(--color-text);
          background: var(--color-background);
          transition: 1s;
          border-radius: 50px;
          box-shadow: 0 0 0.2em 0 var(--color-background);
          border: none;
        }

        .btn-content:hover, .btn-content:focus {
          transition: 0.5s;
          animation: btn-content 1s;
          outline: 0.1em solid transparent;
          outline-offset: 0.2em;
          box-shadow: 0 0 0.4em 0 var(--color-background);
        }

        .btn-content .icon-arrow {
          transition: 0.5s;
          margin-right: 0px;
          transform: scale(0.6);
          margin-left: 8px;
        }

        .btn-content:hover .icon-arrow {
          transition: 0.5s;
          margin-right: 15px;
        }

        @keyframes btn-content {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        @keyframes celebrate {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(var(--random-x, 0px)) scale(0);
            opacity: 0;
          }
        }

        .result-icon {
          animation: pulse 1.5s ease-in-out infinite;
        }

        .result-icon.win {
          animation: bounce 1s ease-in-out, pulse 1.5s ease-in-out 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translate3d(0, 0, 0); }
          40%, 43% { transform: translate3d(0, -15px, 0); }
          70% { transform: translate3d(0, -8px, 0); }
          90% { transform: translate3d(0, -3px, 0); }
        }

        @media (max-width: 768px) {
          .comparison-section {
            flex-direction: column;
            gap: 12px;
          }

          .action-buttons {
            flex-direction: column;
            width: 100%;
            max-width: 300px;
          }

          .comparison-card {
            min-width: 150px;
            padding: 12px;
          }
        }
      `}</style>
    </Layout>
  );
}