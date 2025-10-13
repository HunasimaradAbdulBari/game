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

  // Success Icon SVG - Mobile Optimized
  const SuccessIcon = () => (
    <svg 
      width="48" 
      height="48" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: 'clamp(30px, 6vw, 48px)',
        height: 'clamp(30px, 6vw, 48px)'
      }}
    >
      <circle cx="12" cy="12" r="10" fill="#22C55E" stroke="#16A34A" strokeWidth="2"/>
      <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Failure Icon SVG - Mobile Optimized
  const FailureIcon = () => (
    <svg 
      width="48" 
      height="48" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: 'clamp(30px, 6vw, 48px)',
        height: 'clamp(30px, 6vw, 48px)'
      }}
    >
      <circle cx="12" cy="12" r="10" fill="#F87171" stroke="#EF4444" strokeWidth="2"/>
      <path d="m15 9-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="m9 9 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // Custom Banner Component - Mobile Optimized
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
          width: 'clamp(160px, 35vw, 300px)',
          height: 'auto',
          maxWidth: '95%'
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
            fontSize: 'clamp(10px, 2.2vw, 18px)',
            fontWeight: 'bold',
            fill: '#FFFFFF',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            letterSpacing: 'clamp(0.3px, 0.1vw, 1px)'
          }}
        >
          {title}
        </text>
      </svg>
    </div>
  );

  // Status Display - Mobile Optimized
  const renderOverallStatusOnly = () => {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(8px, 2vw, 24px)',
        borderRadius: 'clamp(8px, 2vw, 18px)',
        background: isWin ? '#E6FFFA' : '#FEF2F2',
        border: `clamp(1px, 0.2vw, 2px) solid ${isWin ? '#22C55E' : '#F87171'}`,
        color: isWin ? '#065F46' : '#7F1D1D',
        fontWeight: 700,
        fontSize: 'clamp(12px, 2.8vw, 22px)',
        gap: 'clamp(6px, 1.5vw, 16px)',
        textTransform: 'uppercase',
        letterSpacing: 'clamp(0.3px, 0.1vw, 1.2px)',
        boxShadow: `0 clamp(2px, 0.5vw, 6px) clamp(8px, 2vw, 24px) ${isWin ? 'rgba(34, 197, 94, 0.15)' : 'rgba(248, 113, 113, 0.15)'}`,
        minHeight: 'clamp(40px, 8vw, 70px)'
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
          width: clamp(4px, 1vw, 8px);
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
          from { opacity: 0; transform: translateY(clamp(15px, 3vw, 30px)) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Mobile-specific component size reductions */
        @media screen and (max-width: 480px) {
          .result-card {
            width: 92vw !important;
            height: 78vh !important;
            padding: 12px !important;
          }
          
          .mobile-banner {
            height: 45px !important;
            margin-bottom: 6px !important;
          }
          
          .mobile-title {
            font-size: 11px !important;
            margin-bottom: 6px !important;
          }
          
          .mobile-status {
            padding: 6px 8px !important;
            font-size: 10px !important;
            gap: 4px !important;
            min-height: 32px !important;
            margin-bottom: 6px !important;
          }
          
          .mobile-message {
            font-size: 9px !important;
            margin-bottom: 6px !important;
          }
          
          .mobile-buttons {
            gap: 4px !important;
            padding: 6px 0 !important;
          }
          
          .mobile-button {
            padding: 6px 8px !important;
            font-size: 8px !important;
            min-width: 70px !important;
            height: 28px !important;
            border-radius: 4px !important;
            letter-spacing: 0.2px !important;
          }
          
          .mobile-icon {
            width: 12px !important;
            height: 12px !important;
          }
        }

        @media screen and (min-width: 481px) and (max-width: 768px) {
          .result-card {
            width: 85vw !important;
            height: 75vh !important;
          }
          
          .mobile-banner {
            height: 55px !important;
            margin-bottom: 8px !important;
          }
          
          .mobile-title {
            font-size: 13px !important;
            margin-bottom: 8px !important;
          }
          
          .mobile-status {
            padding: 8px 12px !important;
            font-size: 12px !important;
            gap: 6px !important;
            min-height: 38px !important;
            margin-bottom: 8px !important;
          }
          
          .mobile-message {
            font-size: 11px !important;
            margin-bottom: 8px !important;
          }
          
          .mobile-buttons {
            gap: 6px !important;
            padding: 8px 0 !important;
          }
          
          .mobile-button {
            padding: 7px 10px !important;
            font-size: 9px !important;
            min-width: 80px !important;
            height: 32px !important;
            border-radius: 6px !important;
            letter-spacing: 0.3px !important;
          }
          
          .mobile-icon {
            width: 14px !important;
            height: 14px !important;
          }
        }

        /* Laptop and Desktop - Keep Original Sizes */
        @media screen and (min-width: 1025px) {
          .result-card {
            width: 480px !important;
            height: 500px !important;
          }
        }

        @media screen and (min-width: 1441px) {
          .result-card {
            width: 520px !important;
            height: 540px !important;
          }
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .mobile-button {
            min-height: 36px !important;
          }
        }

        /* Landscape mobile optimizations */
        @media screen and (max-height: 500px) and (orientation: landscape) and (max-width: 800px) {
          .result-card {
            height: 92vh !important;
            width: 80vw !important;
            max-width: 500px !important;
          }
          
          .mobile-banner {
            height: 40px !important;
            margin-bottom: 4px !important;
          }
          
          .mobile-title {
            font-size: 10px !important;
            margin-bottom: 4px !important;
          }
          
          .mobile-status {
            padding: 4px 6px !important;
            font-size: 9px !important;
            min-height: 28px !important;
            margin-bottom: 4px !important;
          }
          
          .mobile-message {
            font-size: 8px !important;
            margin-bottom: 4px !important;
          }
          
          .mobile-buttons {
            gap: 3px !important;
            padding: 4px 0 !important;
          }
          
          .mobile-button {
            padding: 4px 6px !important;
            font-size: 7px !important;
            min-width: 60px !important;
            height: 24px !important;
          }
        }
      `}</style>

      {/* Blurred Background Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backdropFilter: 'blur(clamp(4px, 1vw, 8px))',
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
        padding: 'clamp(8px, 2vw, 24px)',
        color: '#111827',
        overflow: 'auto',
        zIndex: 1
      }}>

        {/* Main Result Card - Mobile Optimized Sizes */}
        <div 
          className="result-card"
          style={{
            background: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5be 50%, #d4c4a8 100%)',
            borderRadius: 'clamp(8px, 2vw, 16px)',
            width: 'clamp(280px, 85vw, 480px)',
            height: 'clamp(350px, 75vh, 500px)',
            maxWidth: '95vw',
            maxHeight: '90vh',
            position: 'relative',
            zIndex: 1,
            overflow: 'hidden',
            animation: 'slideIn 1s ease-out',
            border: 'clamp(1px, 0.3vw, 3px) solid #8b6f47',
            boxShadow: `
              0 clamp(6px, 1.5vw, 20px) clamp(20px, 5vw, 60px) rgba(139, 111, 71, 0.3), 
              0 clamp(3px, 0.75vw, 10px) clamp(10px, 2.5vw, 30px) rgba(139, 111, 71, 0.2), 
              inset 0 1px clamp(1px, 0.3vw, 3px) rgba(255, 255, 255, 0.3)
            `
          }}
        >
          <div style={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: 'clamp(12px, 3vw, 26px)'
          }}>
            
            {/* Banner - Mobile Optimized */}
            <div 
              className="mobile-banner"
              style={{ 
                height: 'clamp(50px, 10vw, 85px)', 
                flexShrink: 0,
                marginBottom: 'clamp(6px, 1.5vw, 12px)'
              }}
            >
              <CustomBanner title={isWin ? 'SUCCESS' : 'TRY AGAIN'} />
            </div>

            {/* Challenge Info - Mobile Optimized */}
            <div style={{
              textAlign: 'center',
              marginBottom: 'clamp(6px, 1.5vw, 18px)',
              flexShrink: 0
            }}>
              <h2 
                className="mobile-title"
                style={{
                  fontSize: 'clamp(11px, 2.5vw, 18px)',
                  fontWeight: '700',
                  color: '#3e2723',
                  marginTop: "20px",
                  letterSpacing: 'clamp(0.2px, 0.05vw, 0.5px)',
                  textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
                  lineHeight: 1.2
                }}
              >
                Challenge {currentLevel} - {levelData.title}
              </h2>
            </div>

            {/* Status Display - Mobile Optimized */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 'clamp(6px, 1.5vw, 18px)',
              flexShrink: 0
            }}>
              <div 
                className="mobile-status"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'clamp(6px, 1.5vw, 24px)',
                  borderRadius: 'clamp(6px, 1.5vw, 18px)',
                  background: isWin ? '#E6FFFA' : '#FEF2F2',
                  border: `clamp(1px, 0.2vw, 2px) solid ${isWin ? '#22C55E' : '#F87171'}`,
                  color: isWin ? '#065F46' : '#7F1D1D',
                  fontWeight: 700,
                  fontSize: 'clamp(10px, 2.2vw, 22px)',
                  gap: 'clamp(4px, 1vw, 16px)',
                  textTransform: 'uppercase',
                  letterSpacing: 'clamp(0.2px, 0.05vw, 1.2px)',
                  boxShadow: `0 clamp(1px, 0.3vw, 6px) clamp(6px, 1.5vw, 24px) ${isWin ? 'rgba(34, 197, 94, 0.15)' : 'rgba(248, 113, 113, 0.15)'}`,
                  minHeight: 'clamp(35px, 7vw, 70px)'
                }}
              >
                {isWin ? <SuccessIcon /> : <FailureIcon />}
                <span>{isWin ? 'Success' : 'Failed'}</span>
              </div>
            </div>

            {/* Progress Messages - Mobile Optimized */}
            {isWin && currentLevel < 10 && (
              <p 
                className="mobile-message"
                style={{
                  fontSize: 'clamp(9px, 2vw, 16px)',
                  fontWeight: '600',
                  color: '#059669',
                  textAlign: 'center',
                  marginBottom: 'clamp(6px, 1.5vw, 14px)',
                  margin: '0 0 clamp(6px, 1.5vw, 14px) 0',
                  flexShrink: 0,
                  letterSpacing: 'clamp(0.2px, 0.05vw, 0.5px)',
                  textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
                }}
              >
                Next challenge unlocked!
              </p>
            )}

            {isWin && currentLevel === 10 && (
              <p 
                className="mobile-message"
                style={{
                  fontSize: 'clamp(10px, 2.2vw, 18px)',
                  fontWeight: '700',
                  color: '#059669',
                  textAlign: 'center',
                  marginBottom: 'clamp(6px, 1.5vw, 14px)',
                  margin: '0 0 clamp(6px, 1.5vw, 14px) 0',
                  flexShrink: 0,
                  letterSpacing: 'clamp(0.2px, 0.05vw, 0.5px)',
                  textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
                }}
              >
                All challenges completed!
              </p>
            )}

            {/* Action Buttons - Mobile Optimized */}
            <div 
              className="mobile-buttons"
              style={{
                display: 'flex',
                gap: 'clamp(4px, 1vw, 12px)',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginTop: 'auto',
                flexShrink: 0,
                padding: 'clamp(6px, 1.5vw, 16px) 0'
              }}
            >
              {isWin ? (
                <>
                  {currentLevel < 10 ? (
                    <button
                      className="mobile-button"
                      onClick={handleNextLevel}
                      style={{
                        padding: 'clamp(6px, 1.5vw, 12px) clamp(8px, 2vw, 22px)',
                        fontSize: 'clamp(8px, 1.8vw, 13px)',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                        color: '#FFFFFF',
                        border: 'clamp(1px, 0.2vw, 2px) solid #1e40af',
                        borderRadius: 'clamp(4px, 1vw, 12px)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        minWidth: 'clamp(70px, 16vw, 140px)',
                        height: 'clamp(28px, 6vw, 42px)',
                        letterSpacing: 'clamp(0.2px, 0.05vw, 0.5px)',
                        boxShadow: '0 clamp(1px, 0.3vw, 3px) clamp(4px, 1vw, 12px) rgba(59, 130, 246, 0.3), 0 1px clamp(2px, 0.5vw, 6px) rgba(0, 0, 0, 0.2)',
                        flex: '1 1 auto',
                        maxWidth: 'clamp(100px, 22vw, 180px)'
                      }}
                    >
                      NEXT CHALLENGE
                    </button>
                  ) : (
                    <button
                      className="mobile-button"
                      onClick={handlePlayFromStart}
                      style={{
                        padding: 'clamp(6px, 1.5vw, 12px) clamp(8px, 2vw, 22px)',
                        fontSize: 'clamp(8px, 1.8vw, 13px)',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                        color: '#FFFFFF',
                        border: 'clamp(1px, 0.2vw, 2px) solid #1e40af',
                        borderRadius: 'clamp(4px, 1vw, 12px)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        minWidth: 'clamp(70px, 16vw, 140px)',
                        height: 'clamp(28px, 6vw, 42px)',
                        letterSpacing: 'clamp(0.2px, 0.05vw, 0.5px)',
                        boxShadow: '0 clamp(1px, 0.3vw, 3px) clamp(4px, 1vw, 12px) rgba(59, 130, 246, 0.3), 0 1px clamp(2px, 0.5vw, 6px) rgba(0, 0, 0, 0.2)',
                        flex: '1 1 auto',
                        maxWidth: 'clamp(100px, 22vw, 180px)'
                      }}
                    >
                      PLAY AGAIN
                    </button>
                  )}
                  <button
                    className="mobile-button"
                    onClick={handleReplayLevel}
                    style={{
                      padding: 'clamp(6px, 1.5vw, 12px) clamp(8px, 2vw, 22px)',
                      fontSize: 'clamp(8px, 1.8vw, 13px)',
                      fontWeight: '700',
                      background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
                      color: '#FFFFFF',
                      border: 'clamp(1px, 0.2vw, 2px) solid #374151',
                      borderRadius: 'clamp(4px, 1vw, 12px)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      minWidth: 'clamp(60px, 14vw, 120px)',
                      height: 'clamp(28px, 6vw, 42px)',
                      letterSpacing: 'clamp(0.2px, 0.05vw, 0.5px)',
                      boxShadow: '0 clamp(1px, 0.2vw, 2px) clamp(2px, 0.5vw, 6px) rgba(0, 0, 0, 0.3)',
                      flex: '1 1 auto',
                      maxWidth: 'clamp(80px, 18vw, 140px)'
                    }}
                  >
                    REPLAY
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="mobile-button"
                    onClick={handleTryAgain}
                    style={{
                      padding: 'clamp(3px, 1.5vw, 6px) clamp(8px, 2vw, 22px)',
                      fontSize: 'clamp(8px, 1.8vw, 13px)',
                      fontWeight: '700',
                      background: 'linear-gradient(135deg, #F87171 0%, #EF4444 100%)',
                      color: '#FFFFFF',
                      border: 'clamp(1px, 0.2vw, 2px) solid #DC2626',
                      borderRadius: 'clamp(4px, 1vw, 12px)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      minWidth: 'clamp(70px, 16vw, 140px)',
                      height: 'clamp(28px, 6vw, 42px)',
                      letterSpacing: 'clamp(0.2px, 0.05vw, 0.5px)',
                      boxShadow: '0 clamp(1px, 0.3vw, 3px) clamp(4px, 1vw, 12px) rgba(248, 113, 113, 0.3), 0 1px clamp(2px, 0.5vw, 6px) rgba(0, 0, 0, 0.2)',
                      flex: '1 1 auto',
                      maxWidth: 'clamp(100px, 22vw, 180px)'
                    }}
                  >
                    TRY AGAIN
                  </button>
                  <button
                    className="mobile-button"
                    onClick={handleGoToMenu}
                    style={{
                      padding: 'clamp(6px, 1.5vw, 12px) clamp(8px, 2vw, 22px)',
                      fontSize: 'clamp(8px, 1.8vw, 13px)',
                      fontWeight: '700',
                      background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
                      color: '#FFFFFF',
                      border: 'clamp(1px, 0.2vw, 2px) solid #374151',
                      borderRadius: 'clamp(4px, 1vw, 12px)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      minWidth: 'clamp(60px, 14vw, 120px)',
                      height: 'clamp(28px, 6vw, 42px)',
                      letterSpacing: 'clamp(0.2px, 0.05vw, 0.5px)',
                      boxShadow: '0 clamp(1px, 0.2vw, 2px) clamp(2px, 0.5vw, 6px) rgba(0, 0, 0, 0.3)',
                      flex: '1 1 auto',
                      maxWidth: 'clamp(80px, 18vw, 140px)'
                    }}
                  >
                    MENU
                  </button>
                </>
              )}
              <button
                className="mobile-button"
                onClick={() => router.push('/leaderboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'clamp(6px, 1.5vw, 12px) clamp(8px, 2vw, 22px)',
                  fontSize: 'clamp(8px, 1.8vw, 13px)',
                  background: '#a0522d',
                  color: '#f5e6ca',
                  border: 'none',
                  fontWeight: 'bold',
                  borderRadius: 'clamp(4px, 1vw, 12px)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 clamp(1px, 0.2vw, 2px) clamp(2px, 0.5vw, 6px) rgba(0, 0, 0, 0.3)',
                  minWidth: 'clamp(60px, 14vw, 120px)',
                  height: 'clamp(28px, 6vw, 42px)',
                  letterSpacing: 'clamp(0.2px, 0.05vw, 0.5px)',
                  gap: 'clamp(2px, 0.3vw, 4px)',
                  flex: '1 1 auto',
                  maxWidth: 'clamp(80px, 18vw, 140px)'
                }}
              >
                <BarChart3 
                  className="mobile-icon"
                  style={{ 
                    width: 'clamp(12px, 2.5vw, 20px)', 
                    height: 'clamp(12px, 2.5vw, 20px)',
                    flexShrink: 0
                  }} 
                />
                <span>Leaderboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
