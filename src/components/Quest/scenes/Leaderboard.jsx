import React, { useEffect, useRef, useState } from "react";
import { Home, BarChart3, Star } from "lucide-react";
import confetti from "canvas-confetti";
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


// Types
interface LeaderboardEntry {
  userId: string;
  score: number;
  timestamp: number;
}

interface GameState {
  score: number;
  level: number;
}

interface Player {
  id: number;
  username: string;
  score: number;
}

interface CongratulationsModalProps<T> {
  showCongrats: boolean;
  isMobile: boolean;
  isLandscape: boolean;
  screenSize: "mobile" | "tablet" | "desktop";
  game: T;
  setShowCongrats: React.Dispatch<React.SetStateAction<boolean>>;
  setGame: React.Dispatch<React.SetStateAction<T>>;
  setShowStart: React.Dispatch<React.SetStateAction<boolean>>;
  setShowGameOver: React.Dispatch<React.SetStateAction<boolean>>;
  setGameOverLevel: React.Dispatch<React.SetStateAction<number | null>>;
  setGameOverPattern: React.Dispatch<React.SetStateAction<number | null>>;
}

const CongratulationsModal: React.FC<CongratulationsModalProps<any>> = ({
  showCongrats,
  isMobile,
  isLandscape,
  screenSize,
  game,
  setShowCongrats,
  setGame,
  setShowStart,
  setShowGameOver,
  setGameOverLevel,
  setGameOverPattern,
}) => {
  const confettiIntervalRef = useRef<number | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const getIconSize = () => {
    if (isMobile) return 'w-4 h-4';
    if (isLandscape) return 'w-5 h-5';
    return 'w-6 h-6';
  };

  // Helper function to determine font size based on score length
  const getScoreFontSize = (score: number, isMobile: boolean) => {
    const scoreLength = score.toString().length;
    if (isMobile) {
      if (scoreLength > 5) return 'text-xs';
      if (scoreLength > 2) return 'text-xs'; // Changed from 3 to 2
      return 'text-sm';
    } else {
      if (scoreLength > 5) return 'text-sm';
      if (scoreLength > 2) return 'text-sm'; // Changed from 3 to 2
      return 'text-base';
    }
  };

  // Helper function to determine padding based on score length
  const getScorePadding = (score: number, isMobile: boolean) => {
    const scoreLength = score.toString().length;
    if (isMobile) {
      if (scoreLength > 5) return 'px-2 py-1';
      if (scoreLength > 2) return 'px-2 py-1'; // Changed from 3 to 2
      return 'px-3 py-1';
    } else {
      if (scoreLength > 5) return 'px-2 py-1';
      if (scoreLength > 2) return 'px-3 py-1'; // Changed from 3 to 2
      return 'px-4 py-1';
    }
  };

  useEffect(() => {
    if (showCongrats) {
      startConfettiFireworks();
      const gameId = "snake-game";
      const leaderboardData = getLeaderboardData(gameId);
      const transformedData: LeaderboardEntry[] = leaderboardData.map(entry => ({
        userId: entry.userId,
        score: entry.score || 0,
        timestamp: entry.timestamp
      }));
      setLeaderboard(transformedData.sort((a, b) => b.score - a.score));
    }
    
    return () => {
      if (confettiIntervalRef.current !== null) {
        clearInterval(confettiIntervalRef.current);
        confettiIntervalRef.current = null;
      }
    };
  }, [showCongrats]);

  const startConfettiFireworks = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const colors = ['#FFD700', '#FF4500', '#FF69B4', '#00BFFF', '#9370DB', '#FFFFFF'];
    const defaults = { 
      startVelocity: 30, 
      spread: 360, 
      ticks: 60, 
      zIndex: 3000,
      colors: colors,
      gravity: 1,
      scalar: 1.2,
      drift: 0
    };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    if (confettiIntervalRef.current !== null) {
      clearInterval(confettiIntervalRef.current);
    }

    confettiIntervalRef.current = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        if (confettiIntervalRef.current !== null) {
          clearInterval(confettiIntervalRef.current);
          confettiIntervalRef.current = null;
        }
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: colors,
        shapes: ['circle', 'square', 'star']
      });
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: colors,
        shapes: ['circle', 'square', 'star']
      });
      
      confetti({
        ...defaults,
        particleCount: particleCount / 2,
        origin: { x: 0.5, y: Math.random() - 0.2 },
        colors: colors,
        shapes: ['circle', 'square', 'star']
      });
    }, 250);
  };

  const goHome = () => {
    window.location.reload();
  };

  if (!showCongrats) {
    return null;
  }

  const players: Player[] = leaderboard.map((entry, index) => ({
    id: index + 1,
    username: entry.userId,
    score: entry.score,
  }));

  const getAvatarSrc = (): string => {
    return "/assets/games/snakegame/male-avatar.png";
  };

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>, player: Player): void => {
    if (e.currentTarget.src.includes("/assets/games/snakegame/male-avatar.png")) {
      return;
    }
    e.currentTarget.src = "/assets/games/snakegame/female-avatar.png";
  };

  const containerStyle: React.CSSProperties = {
    backgroundImage: "url(/assets/games/snakegame/backgroundimg.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const mainContainerStyle: React.CSSProperties = {
    width: isMobile ? (isLandscape ? "90%" : "95%") : "100%",
    maxWidth: isMobile ? (isLandscape ? "600px" : "450px") : "500px",
    height: isMobile ? (isLandscape ? "90vh" : "85vh") : "auto",
    maxHeight: isMobile ? (isLandscape ? "90vh" : "85vh") : "none",
    overflow: "hidden",
    // Add background for landscape mode to replace SVG
    ...(isMobile && isLandscape && {
      backgroundColor: "#FFDCB8",
      borderRadius: "20px",
      border: "8px solid #a0522d",
    })
  };

  const svgViewBox = isMobile ? (isLandscape ? "0 0 700 900" : "0 0 700 1000") : "0 0 900 1200";
  const leaderboardHeight = isMobile ? (isLandscape ? "calc(90vh - 200px)" : "400px") : "537px";

  return (
    <div 
      className={`fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center z-[2000] backdrop-blur-md p-2 ${isMobile ? 'p-2' : 'p-4'}`}
      style={containerStyle}
    >
      {/* Score Display */}
      <div className="score-display absolute" style={{ 
        right: '10px',
        left: 'auto',
      }}>
        <div className="score-item flex items-center">
          <Star className={`${getIconSize()} mr-1 text-[#ffcc00]`} />
          <span 
            className="text-[#ffcc00] font-bold whitespace-nowrap"
            style={{
              fontSize: game.score.toString().length > 2 ? '16px' : '20px' // Changed from 3 to 2
            }}
          >
            SCORE: {game.score}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative" style={mainContainerStyle}>
        {/* SVG Background - Only render if not in landscape mode on mobile */}
        {!isMobile || !isLandscape ? (
          <svg
            viewBox={svgViewBox}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <rect
              x="50"
              y="40"
              width={isMobile ? (isLandscape ? "600" : "600") : "800"}
              height={isMobile ? (isLandscape ? "820" : "920") : "1120"}
              rx="40"
              fill="#a0522d"
            />
            <path
              d={isMobile 
                ? (isLandscape 
                  ? "M 90 130 Q 350 175 610 130 L 610 810 Q 610 835 585 835 L 115 835 Q 90 835 90 810 Z"
                  : "M 90 130 Q 350 175 610 130 L 610 910 Q 610 935 585 935 L 115 935 Q 90 935 90 910 Z")
                : "M 90 130 Q 450 175 810 130 L 810 1110 Q 810 1135 785 1135 L 115 1135 Q 90 1135 90 1110 Z"
              }
              fill="#FFDCB8"
            />
          </svg>
        ) : null}

        {/* Content Overlay */}
        <div className={`absolute inset-0 ${isMobile ? 'p-4' : 'p-8'}`}>
          {/* PNG Banner Image */}
          <div className="flex justify-center">
            <img
              src="/assets/games/snakegame/leaderboard.png"
              alt="Leaderboard Banner"
              className="w-full h-auto drop-shadow-2xl"
              style={{
                maxHeight: isMobile ? (isLandscape ? "150px" : "300px") : "670px",
                objectFit: "contain",
                marginTop: isMobile ? (isLandscape ? "10px" : "-20px") : "-40px",
                marginBottom: "0px",
              }}
            />
          </div>

          {/* Leaderboard Container */}
          <div
            className="rounded-2xl p-2 opacity-90"
            style={{
              background: "linear-gradient(180deg, #D17836 0%, #B86A30 50%, #A0592A 100%)",
              boxShadow: `inset 0 -4px 0px rgba(125, 60, 10, 0.2)`,
              height: leaderboardHeight,
              marginTop: "0px",
              marginLeft: isMobile && isLandscape ? "10px" : "22px",
              marginRight: isMobile && isLandscape ? "10px" : "22px",
            }}
          >
            {/* Scrollable Content Area */}
            <div
              className="h-full overflow-y-auto px-0 space-y-2 scrollbar-custom"
              style={{
                scrollbarWidth: "none",
                scrollbarColor: "none",
              }}
            >
              {players.map((player: Player, index: number) => {
                const rank = index + 1;
                let rowStyle: React.CSSProperties = {};

                if (rank === 1) {
                  rowStyle = {
                    background: "linear-gradient(90deg, #FDD95Cff 0%, #FDD95Cff 50%, #FDD95Cff 100%)",
                    boxShadow: "inset 0 -4px 2px #D0762Eff,inset 0 4px 8px #ddccbeff",
                    position: "relative",
                  };
                } else if (rank === 2) {
                  rowStyle = {
                    background: "linear-gradient(90deg, #91ECF5ff 0%, #68E5F4ff 50%, #64E6F4ff 100%)",
                    boxShadow: "inset 0 -3px 8px rgba(16, 113, 249, 0.88),inset 0 -4px 0 #1071F9",
                    position: "relative",
                  };
                } else if (rank === 3) {
                  rowStyle = {
                    background: "linear-gradient(90deg, #ef4150ff 0%, #ef4150ff 50%, #ef4150ff 100%)",
                    boxShadow: "inset 0 -3px 8px rgba(213, 17, 17, 0.95),inset 0 -4px 0 #e40c0cff",
                    position: "relative",
                  };
                } else {
                  rowStyle = {
                    background: "linear-gradient(90deg, #FAAB70ff 0%, #FAAB70ff 50%, #FAAB70ff 100%)",
                    boxShadow: "inset 0 -3px 0 #e40c0c88,inset 0 2px 8px #ddccbeff",
                    position: "relative",
                  };
                }

                return (
                  <div
                    key={player.id || index}
                    className="rounded-xl px-3 py-2 flex items-center shadow-md opacity-85 hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
                    style={{
                      ...rowStyle,
                      minHeight: isMobile ? "50px" : "60px",
                    }}
                  >
                    {/* Rank Medal - Touch top and bottom for top 3 */}
                    <div className="flex-shrink-0 mr-1" style={{ marginTop: rank <= 3 ? '-8px' : '-8px', marginBottom: rank <= 3 ? '-8px' : '-8px' }}>
                      {rank === 1 && (
                        <div className={`${isMobile ? 'w-14 h-14' : 'w-16 h-16'} flex items-center justify-center`}>
                          <img
                            src="/assets/games/snakegame/gold-trophy.png"
                            alt="Gold Trophy"
                            className={`${isMobile ? 'w-14 h-16' : 'w-16 h-18'} object-contain drop-shadow-lg`}
                            style={{
                              filter: "drop-shadow(2px 3px 6px rgba(0, 0, 0, 0.4))",
                            }}
                          />
                        </div>
                      )}
                      {rank === 2 && (
                        <div className={`${isMobile ? 'w-14 h-14' : 'w-16 h-16'} flex items-center justify-center`}>
                          <img
                            src="/assets/games/snakegame/silver-trophy.png"
                            alt="Silver Trophy"
                            className={`${isMobile ? 'w-14 h-16' : 'w-16 h-18'} object-contain drop-shadow-lg`}
                            style={{
                              filter: "drop-shadow(2px 3px 6px rgba(0, 0, 0, 0.4))",
                            }}
                          />
                        </div>
                      )}
                      {rank === 3 && (
                        <div className={`${isMobile ? 'w-14 h-14' : 'w-16 h-16'} flex items-center justify-center`}>
                          <img
                            src="/assets/games/snakegame/bronze-trophy.png"
                            alt="Bronze Trophy"
                            className={`${isMobile ? 'w-14 h-16' : 'w-16 h-18'} object-contain drop-shadow-lg`}
                            style={{
                              filter: "drop-shadow(2px 3px 6px rgba(0, 0, 0, 0.4))",
                            }}
                          />
                        </div>
                      )}
                      {rank > 3 && (
                        <div className={`${isMobile ? 'w-14 h-14' : 'w-16 h-16'} rounded-full flex items-center justify-center font-black ${isMobile ? 'text-xl' : 'text-2xl'} text-amber-800`}>
                          {rank}
                        </div>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="flex-shrink-0 mr-2" style={{ marginTop: '-8px', marginBottom: '-8px' }}>
                      <div
                        className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} rounded-full flex items-center justify-center shadow-md border-2 border-white overflow-hidden`}
                        style={{ backgroundColor: "#2C5282" }}
                      >
                        <img
                          src={getAvatarSrc()}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                          onError={(e) => handleAvatarError(e, player)}
                        />
                      </div>
                    </div>

                    {/* Username */}
                    <div className="flex-grow min-w-0 mr-2">
                      <p className={`text-white font-bold ${isMobile ? 'text-base' : 'text-lg'} tracking-wide drop-shadow-sm break-words`}>
                        {player.username}
                      </p>
                    </div>

                    {/* Score with Coin - Fixed width with dynamic font size */}
                    <div className="flex-shrink-0 relative">
                      <div 
                        className={`flex items-center justify-center bg-black bg-opacity-30 rounded-2xl shadow-md ${isMobile ? 'pl-7' : 'pl-8'} ${getScorePadding(player.score, isMobile)}`}
                        style={{
                          height: isMobile ? '28px' : '32px',
                          width: isMobile ? '70px' : '75px', // Reduced width for 2-digit optimization
                        }}
                      >
                        <img
                          src="/assets/games/snakegame/coin1.png"
                          alt="Coin"
                          className={`absolute ${isMobile ? '-left-1.5 w-6 h-6' : '-left-2 w-9 h-9'} top-1/2 transform -translate-y-1/2 rounded-full shadow-sm`}
                        />
                        <span className={`text-white font-black text-center drop-shadow-sm whitespace-nowrap ${getScoreFontSize(player.score, isMobile)}`}>
                          {player.score?.toLocaleString() || "0"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className={`mt-2 flex justify-center ${isMobile ? 'space-x-2' : 'space-x-4'}`}>
        <button
          onClick={goHome}
          className={`flex items-center justify-center ${isMobile ? 'py-2 px-4 text-sm' : 'py-3 px-8 text-lg'} bg-[#a0522d] hover:bg-[#8b4513] text-[#f5e6ca] border-none font-bold rounded-md cursor-pointer transition-all duration-300 shadow-lg hover:scale-105`}
        >
          <Home className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} mr-1`} /> Go Home
        </button>
        
        <button
          onClick={() => setShowStats(true)}
          className={`flex items-center justify-center ${isMobile ? 'py-2 px-4 text-sm' : 'py-3 px-8 text-lg'} bg-[#a0522d] hover:bg-[#8b4513] text-[#f5e6ca] border-none font-bold rounded-md cursor-pointer transition-all duration-300 shadow-lg hover:scale-105`}
        >
          <BarChart3 className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'} mr-1`} /> View Stats
        </button>
      </div>

      {/* Global styles */}
      <style jsx global>{`
        .scrollbar-custom {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .scrollbar-custom::-webkit-scrollbar {
          width: 6px;
          background: transparent;
        }

        .scrollbar-custom::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
          border: none;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        .scrollbar-custom::-webkit-scrollbar-button,
        .scrollbar-custom::-webkit-scrollbar-button:start,
        .scrollbar-custom::-webkit-scrollbar-button:end,
        .scrollbar-custom::-webkit-scrollbar-button:vertical:start,
        .scrollbar-custom::-webkit-scrollbar-button:vertical:end,
        .scrollbar-custom::-webkit-scrollbar-button:horizontal:start,
        .scrollbar-custom::-webkit-scrollbar-button:horizontal:end {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        .scrollbar-custom::-webkit-scrollbar-button {
          width: 0px !important;
          height: 0px !important;
          background: transparent !important;
        }

        .scrollbar-custom::-webkit-scrollbar-button:vertical:start:decrement,
        .scrollbar-custom::-webkit-scrollbar-button:vertical:end:increment {
          display: none !important;
          height: 0px !important;
          width: 0px !important;
        }

        img[alt*="Trophy"] {
          border: none !important;
          background: transparent !important;
          box-shadow: none !important;
          filter: drop-shadow(2px 3px 6px rgba(255, 255, 255, 0.8)) !important;
          -webkit-filter: drop-shadow(2px 3px 6px rgba(255, 255, 255, 0.8)) !important;
        }

        img[alt*="Trophy"]:hover {
          filter: drop-shadow(3px 4px 8px rgba(0, 0, 0, 0.6)) !important;
          -webkit-filter: drop-shadow(3px 4px 8px rgba(0, 0, 0, 0.6)) !important;
          transform: scale(1.05);
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default CongratulationsModal;