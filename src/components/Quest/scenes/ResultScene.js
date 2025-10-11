'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../Layout';
import Button from '../Button';
import { BarChart3 } from "lucide-react"
import { 
  getCurrentLevel, 
  setCurrentLevel, 
  getBasket, 
  clearBasket 
} from '../utils/storage';
import { getCurrentExperiment, checkWin, updateProgress, clearCurrentExperiment } from '../utils/gameLogic';
import { 
  saveToLeaderboard, 
  generateUserId,
  formatDate 
} from '../../../services/labGameStorageService';

export default function ResultPage() {
  const router = useRouter();
  const [currentLevel, setCurrentLevelState] = useState(1);
  const [levelData, setLevelData] = useState(null);
  const [basket, setBasket] = useState([]);
  const [isWin, setIsWin] = useState(false);
  const [userId, setUserId] = useState('');

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
            });
        }
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }
  };

  useEffect(() => {
    const level = getCurrentLevel();
    const data = getCurrentExperiment();
    if (!data) {
      router.push('/restaurant');
      return;
    }
    const currentBasket = getBasket();
    const won = checkWin(currentBasket, data);

    let currentUserId = localStorage.getItem('lab_quest_user_id');
    if (!currentUserId) {
      currentUserId = generateUserId();
      localStorage.setItem('lab_quest_user_id', currentUserId);
    }
    setUserId(currentUserId);

    setCurrentLevelState(level);
    setLevelData(data);
    setBasket(currentBasket);
    setIsWin(won);

    const score = won ? (level * 100) : 0;
    const totalQuestions = data.correctAnswer.length;
    const correctAnswers = won ? totalQuestions : currentBasket.filter(item => 
      data.correctAnswer.includes(item)
    ).length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    if (won) {
      updateProgress(level);

      const gameData = {
        userId: currentUserId,
        gameId: `game_${level}`,
        score: score,
        level: level,
        playerName: `Player ${currentUserId.slice(-4)}`,
        correctAnswers: correctAnswers,
        totalQuestions: totalQuestions,
        percentage: percentage,
        passed: true
      };

      saveToLeaderboard(gameData);

      setTimeout(() => {
        clearCurrentExperiment();
      }, 1000);
    }

    setTimeout(() => {
      clearBasket();
    }, 100);

    setTimeout(() => {
      if (won) {
        playSound('win');
      } else {
        playSound('lose');
      }
    }, 800);
  }, [router]);

  const handleNextLevel = () => {
    const nextLevel = currentLevel + 1;
    if (nextLevel <= 10) {
      setCurrentLevel(nextLevel);
      clearCurrentExperiment();
      router.push('/restaurant');
    }
  };

  const handleTryAgain = () => {
    router.push('/restaurant');
  };

  const handleReplayLevel = () => {
    router.push('/restaurant');
  };

  const handlePlayFromStart = () => {
    setCurrentLevel(1);
    clearCurrentExperiment();
    router.push('/restaurant');
  };

  const handleGoToMenu = () => {
    clearCurrentExperiment();
    router.push('/');
  };

  const handleGoToLeaderboard = () => {
    router.push('/leaderboard');
  };

  if (!levelData) return null;

  // Success Icon SVG
  const SuccessIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#22C55E" stroke="#16A34A" strokeWidth="2"/>
      <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Failure Icon SVG
  const FailureIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#F87171" stroke="#EF4444" strokeWidth="2"/>
      <path d="m15 9-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="m9 9 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Custom Banner Component
  const CustomBanner = ({ title }) => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      height: '100%',
      position: 'relative'
    }}>
      <svg 
        viewBox="0 0 317.113 100" 
        style={{ 
          width: '100%', 
          height: 'auto',
          minWidth: '180px',
          maxWidth: '280px'
        }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={`bannerGradient-${isWin ? 'win' : 'lose'}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: isWin ? '#22C55E' : '#F87171', stopOpacity: 0.95 }} />
            <stop offset="50%" style={{ stopColor: isWin ? '#16A34A' : '#EF4444', stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: isWin ? '#15803D' : '#DC2626', stopOpacity: 0.85 }} />
          </linearGradient>
          <linearGradient id={`highlightGradient-${isWin ? 'win' : 'lose'}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: '#FFFFFF', stopOpacity: 0.4 }} />
          </linearGradient>
        </defs>
        
        <g fill={`url(#bannerGradient-${isWin ? 'win' : 'lose'})`}>
          <polygon points="291.927,30 291.927,70 317.113,70 306.509,50 317.113,30" />
          <polygon points="262.484,75 286.624,75 286.624,70 286.624,30 286.624,25 262.484,25" />
          <polygon points="25.187,70 25.187,30 0,30 10.604,50 0,70" />
          <polygon points="30.489,70 30.489,75 54.629,75 54.629,25 30.489,25 30.489,30" />
          <polygon points="59.932,20 59.932,22 59.932,25 59.932,75 59.932,77 59.932,80 59.932,85 257.182,85 257.182,80 257.182,77 257.182,75 257.182,25 257.182,22 257.182,20 257.182,15 59.932,15" />
        </g>
        
        <g fill={`url(#highlightGradient-${isWin ? 'win' : 'lose'})`} opacity="0.4">
          <polygon points="59.932,20 59.932,35 257.182,35 257.182,20 257.182,15 59.932,15" />
        </g>
        
        <text 
          x="158.5" 
          y="50"
          textAnchor="middle" 
          dominantBaseline="central"
          style={{
            fontSize: 'clamp(14px, 3.5vw, 18px)',
            fontWeight: 'bold',
            fill: '#FFFFFF',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            letterSpacing: '1px'
          }}
        >
          {title}
        </text>
      </svg>
    </div>
  );

  // Status Display
  const renderOverallStatusOnly = () => {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(18px, 4vw, 24px)',
        borderRadius: 'clamp(14px, 3vw, 18px)',
        background: isWin ? '#E6FFFA' : '#FEF2F2',
        border: `2px solid ${isWin ? '#22C55E' : '#F87171'}`,
        color: isWin ? '#065F46' : '#7F1D1D',
        fontWeight: 700,
        fontSize: 'clamp(18px, 4vw, 22px)',
        gap: '16px',
        textTransform: 'uppercase',
        letterSpacing: '1.2px',
        boxShadow: `0 6px 24px ${isWin ? 'rgba(34, 197, 94, 0.15)' : 'rgba(248, 113, 113, 0.15)'}`,
      }}>
        {isWin ? <SuccessIcon /> : <FailureIcon />}
        <span>{isWin ? 'Success' : 'Failed'}</span>
      </div>
    );
  };

  return (
    <Layout scene="result">
      <style jsx global>{`
        .perfect-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.6) transparent;
        }
        
        .perfect-scroll::-webkit-scrollbar {
          width: 8px;
        }
        
        .perfect-scroll::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 4px;
        }
        
        .perfect-scroll::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.6);
          border-radius: 4px;
        }
        
        .perfect-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.8);
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Blurred Background Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backdropFilter: 'blur(8px)',
        background: 'rgba(255, 255, 255, 0.1)',
        zIndex: 0
      }} />

      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'clamp(16px, 4vw, 24px)',
        color: '#111827',
        overflow: 'auto',
        zIndex: 1
      }}>

        {/* Main Result Card - Refined Design */}
        <div style={{
          background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5be 50%, #d4c4a8 100%)',
          borderRadius: 'clamp(12px, 3vw, 16px)',
          width: 'clamp(320px, 85vw, 480px)',
          height: 'clamp(420px, 78vh, 500px)',
          maxWidth: '90vw',
          maxHeight: '85vh',
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
          animation: 'slideIn 1s ease-out',
          border: '3px solid #8b6f47',
          boxShadow: '0 20px 60px rgba(139, 111, 71, 0.3), 0 10px 30px rgba(139, 111, 71, 0.2), inset 0 1px 3px rgba(255, 255, 255, 0.3)'
        }}>
          <div style={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: 'clamp(20px, 4vw, 26px)'
          }}>
            {/* Banner */}
            <div style={{ height: 'clamp(70px, 16vw, 85px)', flexShrink: 0 }}>
              <CustomBanner title={isWin ? 'SUCCESS' : 'TRY AGAIN'} />
            </div>

            {/* Challenge Info */}
            <div style={{
              textAlign: 'center',
              marginBottom: 'clamp(14px, 3vh, 18px)',
              flexShrink: 0
            }}>
              <h2 style={{
                fontSize: 'clamp(15px, 3.2vw, 18px)',
                fontWeight: '700',
                color: '#3e2723',
                margin: 0,
                letterSpacing: '0.5px',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
              }}>
                Challenge {currentLevel} - {levelData.title}
              </h2>
            </div>

            {/* Status Display */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 'clamp(14px, 3vh, 18px)',
              flexShrink: 0
            }}>
              {renderOverallStatusOnly()}
            </div>

            {/* Progress Messages */}
            {isWin && currentLevel < 10 && (
              <p style={{
                fontSize: 'clamp(13px, 2.8vw, 16px)',
                fontWeight: '600',
                color: '#059669',
                textAlign: 'center',
                marginBottom: 'clamp(10px, 2.5vh, 14px)',
                margin: '0 0 clamp(10px, 2.5vh, 14px) 0',
                flexShrink: 0,
                letterSpacing: '0.5px',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
              }}>
                Next challenge unlocked!
              </p>
            )}

            {isWin && currentLevel === 10 && (
              <p style={{
                fontSize: 'clamp(14px, 3.2vw, 18px)',
                fontWeight: '700',
                color: '#059669',
                textAlign: 'center',
                marginBottom: 'clamp(10px, 2.5vh, 14px)',
                margin: '0 0 clamp(10px, 2.5vh, 14px) 0',
                flexShrink: 0,
                letterSpacing: '0.5px',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
              }}>
                All challenges completed!
              </p>
            )}

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: 'clamp(8px, 2vw, 12px)',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginTop: 'auto',
              flexShrink: 0
            }}>
              {isWin ? (
                <>
                  {currentLevel < 10 ? (
                    <button
                      onClick={handleNextLevel}
                      style={{
                        padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 22px)',
                        fontSize: 'clamp(10px, 2vw, 13px)',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                        color: '#FFFFFF',
                        border: '2px solid #1e40af',
                        borderRadius: 'clamp(8px, 2vw, 12px)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        minWidth: 'clamp(100px, 25vw, 140px)',
                        height: 'clamp(36px, 8vh, 42px)',
                        letterSpacing: '0.5px',
                        boxShadow: '0 3px 12px rgba(59, 130, 246, 0.3), 0 1px 6px rgba(0, 0, 0, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #2563EB 0%, #1e40af 100%)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 3px 12px rgba(59, 130, 246, 0.3), 0 1px 6px rgba(0, 0, 0, 0.2)';
                      }}
                    >
                      NEXT CHALLENGE
                    </button>
                  ) : (
                    <button
                      onClick={handlePlayFromStart}
                      style={{
                        padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 22px)',
                        fontSize: 'clamp(10px, 2vw, 13px)',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                        color: '#FFFFFF',
                        border: '2px solid #1e40af',
                        borderRadius: 'clamp(8px, 2vw, 12px)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        minWidth: 'clamp(100px, 25vw, 140px)',
                        height: 'clamp(36px, 8vh, 42px)',
                        letterSpacing: '0.5px',
                        boxShadow: '0 3px 12px rgba(59, 130, 246, 0.3), 0 1px 6px rgba(0, 0, 0, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #2563EB 0%, #1e40af 100%)';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 3px 12px rgba(59, 130, 246, 0.3), 0 1px 6px rgba(0, 0, 0, 0.2)';
                      }}
                    >
                      PLAY AGAIN
                    </button>
                  )}
                  <button
                    onClick={handleReplayLevel}
                    style={{
                      padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 22px)',
                      fontSize: 'clamp(10px, 2vw, 13px)',
                      fontWeight: '700',
                      background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
                      color: '#FFFFFF',
                      border: '2px solid #374151',
                      borderRadius: 'clamp(8px, 2vw, 12px)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      minWidth: 'clamp(100px, 25vw, 140px)',
                      height: 'clamp(36px, 8vh, 42px)',
                      letterSpacing: '0.5px',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #4B5563 0%, #374151 100%)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
                    }}
                  >
                    REPLAY
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleTryAgain}
                    style={{
                      padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 22px)',
                      fontSize: 'clamp(10px, 2vw, 13px)',
                      fontWeight: '700',
                      background: 'linear-gradient(135deg, #F87171 0%, #EF4444 100%)',
                      color: '#FFFFFF',
                      border: '2px solid #DC2626',
                      borderRadius: 'clamp(8px, 2vw, 12px)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      minWidth: 'clamp(100px, 25vw, 140px)',
                      height: 'clamp(36px, 8vh, 42px)',
                      letterSpacing: '0.5px',
                      boxShadow: '0 3px 12px rgba(248, 113, 113, 0.3), 0 1px 6px rgba(0, 0, 0, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 16px rgba(248, 113, 113, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #F87171 0%, #EF4444 100%)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 3px 12px rgba(248, 113, 113, 0.3), 0 1px 6px rgba(0, 0, 0, 0.2)';
                    }}
                  >
                    TRY AGAIN
                  </button>
                  <button
                    onClick={handleGoToMenu}
                    style={{
                      padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 22px)',
                      fontSize: 'clamp(10px, 2vw, 13px)',
                      fontWeight: '700',
                      background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
                      color: '#FFFFFF',
                      border: '2px solid #374151',
                      borderRadius: 'clamp(8px, 2vw, 12px)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      minWidth: 'clamp(100px, 25vw, 140px)',
                      height: 'clamp(36px, 8vh, 42px)',
                      letterSpacing: '0.5px',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #4B5563 0%, #374151 100%)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
                    }}
                  >
                    MENU
                  </button>
                </>
              )}
              <button
                onClick={() => router.push('/leaderboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 22px)',
                  fontSize: 'clamp(10px, 2vw, 13px)',
                  background: '#a0522d',
                  color: '#f5e6ca',
                  border: 'none',
                  fontWeight: 'bold',
                  borderRadius: 'clamp(8px, 2vw, 12px)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                  minWidth: 'clamp(100px, 25vw, 140px)',
                  height: 'clamp(36px, 8vh, 42px)',
                  letterSpacing: '0.5px',
                  gap: '4px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#8b4513';
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#a0522d';
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
                }}
              >
                <BarChart3 style={{ width: 'clamp(16px, 3vw, 20px)', height: 'clamp(16px, 3vw, 20px)' }} />
                <span>Leaderboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
