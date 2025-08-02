import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { getCurrentLevel, setCurrentLevel, getBasket, clearBasket } from '../utils/storage';
import { getLevelData, checkWin, updateProgress } from '../utils/gameLogic';

export default function ResultPage() {
  const router = useRouter();
  const [currentLevel, setCurrentLevelState] = useState(1);
  const [levelData, setLevelData] = useState(null);
  const [basket, setBasket] = useState([]);
  const [isWin, setIsWin] = useState(false);

  // ADDED: Sound effect function
  const playSound = (soundType) => {
    if (typeof window !== 'undefined') {
      try {
        const audio = new Audio(`/sounds/${soundType}.mp3`);
        audio.volume = 0.6; // Set volume to 60%
        
        // Handle autoplay restrictions
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log(`${soundType} sound played successfully`);
            })
            .catch((error) => {
              console.log(`Audio autoplay prevented: ${error.message}`);
              // Fallback: try to play on next user interaction
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
    const data = getLevelData(level);
    const currentBasket = getBasket();
    const won = checkWin(currentBasket, data);

    setCurrentLevelState(level);
    setLevelData(data);
    setBasket(currentBasket);
    setIsWin(won);

    // Update progress if won
    if (won) {
      updateProgress(level);
    }

    // ADDED: Play sound effect based on result with delay for better UX
    setTimeout(() => {
      if (won) {
        playSound('win');
      } else {
        playSound('lose');
      }
    }, 800); // Play sound after title animation completes

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
    <Layout scene="result">
      {/* ADDED: Gradient border container wrapper */}
      <div 
        className="result-container-wrapper"
        style={{
          width: '100%',
          height: '100%',
          padding: '3px', // Space for gradient border
          borderRadius: 'clamp(12px, 2vw, 20px)',
          // ADDED: Conditional gradient border based on win/lose
          background: isWin 
            ? 'linear-gradient(135deg, #10b981, #34d399, #6ee7b7, #a7f3d0, #d1fae5)'
            : 'linear-gradient(135deg, #f87171, #fca5a5, #fecaca, #fed7d7, #fee2e2)'
        }}
      >
        <div className={`result-scene ${isWin ? 'win' : 'lose'}`} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '20px',
          textAlign: 'center',
          position: 'relative',
          borderRadius: 'calc(clamp(12px, 2vw, 20px) - 3px)', // Match outer radius minus padding
          background: isWin 
            ? 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #f8fafc 100%)'
            : 'linear-gradient(135deg, #f87171 0%, #fca5a5 50%, #f8fafc 100%)'
        }}>
          {/* Celebration Particles */}
          {isWin && (
            <div className="celebration-particles">
              {Array.from({ length: 30 }, (_, i) => (
                <div
                  key={i}
                  className="celebration-particle"
                  style={{
                    position: 'absolute',
                    width: `${Math.random() * 8 + 3}px`,
                    height: `${Math.random() * 8 + 3}px`,
                    backgroundColor: '#fbbf24',
                    borderRadius: '50%',
                    opacity: 0.8,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `celebrate ${Math.random() * 4 + 2}s ease-out ${Math.random() * 2}s both`
                  }}
                />
              ))}
            </div>
          )}

          {/* Title */}
          <div className="result-title bounce" style={{ marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '42px',
              fontWeight: '900',
              color: '#1e293b',
              textShadow: '0 2px 4px rgba(226, 232, 240, 0.8)',
              marginBottom: '8px'
            }}>
              {isWin ? 'LEVEL COMPLETE! 🎉' : 'TRY AGAIN! 💪'}
            </h1>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#475569'
            }}>
              Level {currentLevel}
            </h2>
          </div>

          {/* Comparison Section */}
          <div className="comparison-section fade-in" style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
            marginBottom: '32px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {/* Required Items */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '15px',
              padding: '20px',
              border: '3px solid #6366f1',
              minWidth: '180px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '800',
                color: '#1e293b',
                marginBottom: '12px'
              }}>
                Required:
              </h3>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#475569',
                lineHeight: '1.5'
              }}>
                {levelData.required.map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
              </div>
            </div>

            {/* Result Icon */}
            <div style={{
              fontSize: '32px',
              animation: isWin ? 'bounce 1s ease-in-out' : 'none'
            }}>
              {isWin ? '✅' : '❌'}
            </div>

            {/* Your Basket */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '15px',
              padding: '20px',
              border: `3px solid ${isWin ? '#10b981' : '#f87171'}`,
              minWidth: '180px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '800',
                color: '#1e293b',
                marginBottom: '12px'
              }}>
                Your Basket:
              </h3>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#475569',
                lineHeight: '1.5'
              }}>
                {basket.length > 0 ? basket.map((item, index) => (
                  <div key={index}>{item}</div>
                )) : 'Empty'}
              </div>
            </div>
          </div>

          {/* Progress Message */}
          {isWin && currentLevel < 3 && (
            <div className="progress-message slide-in" style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#fbbf24',
              marginBottom: '24px'
            }}>
              Next level unlocked! 🌟
            </div>
          )}

          {isWin && currentLevel === 3 && (
            <div className="progress-message slide-in" style={{
              fontSize: '22px',
              fontWeight: '800',
              color: '#fbbf24',
              marginBottom: '24px'
            }}>
              You are a Restaurant Master! 👑
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons" style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            {isWin ? (
              <>
                {currentLevel < 3 ? (
                  <Button variant="primary" size="large" onClick={handleNextLevel}>
                    NEXT LEVEL
                  </Button>
                ) : (
                  <Button variant="primary" size="large" onClick={handlePlayFromStart}>
                    PLAY AGAIN
                  </Button>
                )}
                <Button variant="success" onClick={handleReplayLevel}>
                  REPLAY LEVEL
                </Button>
              </>
            ) : (
              <>
                <Button variant="primary" size="large" onClick={handleTryAgain}>
                  TRY AGAIN
                </Button>
                <Button variant="secondary" onClick={handleGoToMenu}>
                  CHANGE LEVEL
                </Button>
              </>
            )}
          </div>

          {/* Main Menu Button */}
          <div className="main-menu-button">
            <Button variant="secondary" onClick={handleGoToMenu}>
              MAIN MENU
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes celebrate {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px) scale(0);
            opacity: 0;
          }
        }

        @media (max-width: 768px) {
          .comparison-section {
            flex-direction: column;
            gap: 16px;
          }
          
          .result-title h1 {
            font-size: 28px;
          }
          
          .result-title h2 {
            font-size: 18px;
          }
          
          .action-buttons {
            flex-direction: column;
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>
    </Layout>
  );
}
