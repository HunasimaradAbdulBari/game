// src/components/Quest/scenes/LeaderboardScene.tsx - COMPLETE
"use client";
import '../../../styles/leaderboard.css';
import React, { useEffect, useRef, useState } from "react";
import { Home, BarChart3 } from "lucide-react";
import confetti from "canvas-confetti";
import { useRouter } from 'next/navigation';
import { getLeaderboard } from '../../../services/labGameStorageService';
import { LeaderboardEntry } from '../../../types';

interface Player {
  id: number;
  username: string;
  score: number;
}

const LeaderboardScene: React.FC = () => {
  const router = useRouter();
  const confettiIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const basketItemsContainerRef = useRef<HTMLDivElement | null>(null);

  const getIconSize = (): string => {
    if (isMobile) return 'w-4 h-4';
    if (isLandscape) return 'w-5 h-5';
    return 'w-6 h-6';
  };

  const getScoreFontSize = (score: number, isMobile: boolean): string => {
    const scoreLength = score.toString().length;
    if (isMobile) {
      if (scoreLength > 5) return 'text-xs';
      if (scoreLength > 2) return 'text-xs';
      return 'text-sm';
    } else {
      if (scoreLength > 5) return 'text-sm';
      if (scoreLength > 2) return 'text-sm';
      return 'text-base';
    }
  };

  const getScorePadding = (score: number, isMobile: boolean): string => {
    const scoreLength = score.toString().length;
    if (isMobile) {
      if (scoreLength > 5) return 'px-2 py-1';
      if (scoreLength > 2) return 'px-2 py-1';
      return 'px-3 py-1';
    } else {
      if (scoreLength > 5) return 'px-2 py-1';
      if (scoreLength > 2) return 'px-3 py-1';
      return 'px-4 py-1';
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      const landscape = window.innerHeight < window.innerWidth;
      setIsMobile(mobile);
      setIsLandscape(landscape);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    startConfettiFireworks();

    const leaderboardData = getLeaderboard();
    const transformedData = leaderboardData.map(entry => ({
      userId: entry.userId,
      playerName: entry.playerName,
      score: entry.score || 0,
      timestamp: entry.timestamp,
      percentage: entry.percentage,
      correctAnswers: entry.correctAnswers,
      totalQuestions: entry.totalQuestions,
      gameId: entry.gameId,
      subject: entry.subject,
      level: entry.level
    }));
    setLeaderboard(transformedData.sort((a, b) => b.score - a.score));

    return () => {
      window.removeEventListener('resize', handleResize);
      if (confettiIntervalRef.current !== null) {
        clearInterval(confettiIntervalRef.current);
        confettiIntervalRef.current = null;
      }
    };
  }, []);

  const startConfettiFireworks = (): void => {
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

    const randomInRange = (min: number, max: number): number =>
      Math.random() * (max - min) + min;

    if (confettiIntervalRef.current !== null) {
      clearInterval(confettiIntervalRef.current);
    }

    confettiIntervalRef.current = setInterval(() => {
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

  const goHome = (): void => {
    router.push('/');
  };

  const players: Player[] = leaderboard.map((entry, index) => ({
    id: index + 1,
    username: entry.playerName,
    score: entry.score,
  }));

  const getAvatarSrc = (): string => {
    return "/assets/games/snakegame/male-avatar.png";
  };

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement>, player: Player): void => {
    const target = e.currentTarget;
    if (target.src.includes("/assets/games/snakegame/male-avatar.png")) {
      return;
    }
    target.src = "/assets/games/snakegame/female-avatar.png";
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
    ...(isMobile && isLandscape && {
      backgroundColor: "#FFDCB8",
      borderRadius: "20px",
      border: "8px solid #a0522d",
    })
  };

  const svgViewBox = isMobile ? (isLandscape ? "0 0 700 900" : "0 0 700 1000") : "0 0 900 1200";
  const leaderboardHeight = isMobile ? (isLandscape ? "calc(62vh - 122px)" : "318px") : "510px";

  return (
    <div 
      className="fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center z-[2000] backdrop-blur-md p-2 md:p-4 leaderboard-container"
      style={containerStyle}
    >
      <div className="score-display absolute" style={{ 
        right: '10px',
        left: 'auto',
      }}>
        <div className="score-item flex items-center">
        </div>
      </div>

      <div className="relative main-container" style={mainContainerStyle}>
        {!isMobile || !isLandscape ? (
          <svg
            viewBox={svgViewBox}
            className="w-full h-full svg-background"
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

        <div className={`absolute inset-0 content-overlay ${isMobile ? 'p-8' : 'p-16'}`}>
          <div className={`flex justify-center banner-container ${isMobile ? 'mobile-hidden' : ''}`}>
            <img
              src="/assets/games/snakegame/leaderboard.png"
              alt="Leaderboard Banner"
              className="w-full h-auto drop-shadow-2xl banner-image"
              style={{
                maxHeight: isMobile ? (isLandscape ? "120px" : "270px") : "630px",
                objectFit: "contain",
                marginTop: isMobile ? (isLandscape ? "50px" : "-55px") : "-75px",
                marginBottom: "0px",
              }}
            />
          </div>

          <div
            className="rounded-2xl p-2 opacity-90 leaderboard-list-container"
            style={{
              background: "linear-gradient(180deg, #D17836 0%, #B86A30 50%, #A0592A 100%)",
              boxShadow: `inset 0 -4px 0px rgba(125, 60, 10, 0.2)`,
              height: leaderboardHeight,
              width:"370px",
              marginTop:"10px",
              marginLeft: isMobile && isLandscape ? "10px" : "1.65px",
              marginRight: isMobile && isLandscape ? "38px" : "79px",
            }}
          >
            <div
              className="h-full overflow-y-auto px-0 space-y-2 scrollbar-custom leaderboard-items"
              style={{
                scrollbarWidth: "none",
                scrollbarColor: "none",
              }}
            >
              {players.length > 0 ? (
                players.map((player, index) => {
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
                      key={player.id}
                      className="rounded-xl px-2 py-2 flex items-center shadow-md opacity-85 hover:opacity-100 transition-opacity duration-200 flex-shrink-0 leaderboard-item"
                      style={{
                        ...rowStyle,
                        minHeight: isMobile ? "15px" : "17px",
                      }}
                    >
                      <div className="flex-shrink-0 mr-1 rank-container" style={{ marginTop: rank <= 3 ? '-8px' : '-8px', marginBottom: rank <= 3 ? '-4px' : '-5px' }}>
                        {rank === 1 && (
                          <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} flex items-center justify-center trophy-container`}>
                            <img
                              src="/assets/games/snakegame/gold-trophy.png"
                              alt="Gold Trophy"
                              className={`${isMobile ? 'w-14 h-16' : 'w-16 h-18'} object-contain drop-shadow-lg trophy-image`}
                              style={{
                                filter: "drop-shadow(2px 3px 6px rgba(0, 0, 0, 0.4))",
                              }}
                            />
                          </div>
                        )}
                        {rank === 2 && (
                          <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} flex items-center justify-center trophy-container`}>
                            <img
                              src="/assets/games/snakegame/silver-trophy.png"
                              alt="Silver Trophy"
                              className={`${isMobile ? 'w-14 h-16' : 'w-16 h-18'} object-contain drop-shadow-lg trophy-image`}
                              style={{
                                filter: "drop-shadow(2px 3px 6px rgba(0, 0, 0, 0.4))",
                              }}
                            />
                          </div>
                        )}
                        {rank === 3 && (
                          <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} flex items-center justify-center trophy-container`}>
                            <img
                              src="/assets/games/snakegame/bronze-trophy.png"
                              alt="Bronze Trophy"
                              className={`${isMobile ? 'w-14 h-16' : 'w-16 h-18'} object-contain drop-shadow-lg trophy-image`}
                              style={{
                                filter: "drop-shadow(2px 3px 6px rgba(0, 0, 0, 0.4))",
                              }}
                            />
                          </div>
                        )}
                        {rank > 3 && (
                          <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full flex items-center justify-center font-black ${isMobile ? 'text-xl' : 'text-2xl'} text-amber-800 rank-number`}>
                            {rank}
                          </div>
                        )}
                      </div>

                      <div className="flex-shrink-0 mr-2 avatar-container" style={{ marginTop: '-8px', marginBottom: '-8px' }}>
                        <div
                          className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full flex items-center justify-center shadow-md border-2 border-white overflow-hidden avatar-circle`}
                          style={{ backgroundColor: "#2C5282" }}
                        >
                          <img
                            src={getAvatarSrc()}
                            alt="Avatar"
                            className="w-full h-full object-cover avatar-image"
                            onError={(e) => handleAvatarError(e, player)}
                          />
                        </div>
                      </div>

                      <div className="flex-grow min-w-0 mr-2 username-container">
                        <p className={`text-white font ${isMobile ? 'text-base' : 'text-lg'} tracking-wide drop-shadow-sm break-words username-text`}>
                          {player.username}
                        </p>
                      </div>

                      <div className="flex-shrink-0 relative score-container">
                        <div 
                          className={`flex items-center justify-center bg-black bg-opacity-30 rounded-2xl shadow-md ${isMobile ? 'pl-7' : 'pl-8'} ${getScorePadding(player.score, isMobile)} score-badge`}
                          style={{
                            height: isMobile ? '22px' : '23px',
                            width: isMobile ? '60px' : '63px',
                          }}
                        >
                          <img
                            src="/assets/games/snakegame/coin1.png"
                            alt="Coin"
                            className={`absolute ${isMobile ? '-left-1.5 w-4 h-4' : '-left-2 w-7 h-7'} top-1/2 transform -translate-y-1/2 rounded-full shadow-sm coin-image`}
                          />
                          <span className={`text-white font-black text-center drop-shadow-sm whitespace-nowrap ${getScoreFontSize(player.score, isMobile)} score-text`}>
                            {player.score?.toLocaleString() || "0"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-data-message" style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#FFFFFF',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  No leaderboard data available yet!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-2 flex justify-center ${isMobile ? 'space-x-2' : 'space-x-4'} button-container`}>
        <button
          onClick={goHome}
          className={`flex items-center justify-center ${isMobile ? 'py-2 px-4 text-sm' : 'py-3 px-8 text-lg'} bg-[#a0522d] hover:bg-[#8b4513] text-[#f5e6ca] border-none font-bold rounded-md cursor-pointer transition-all duration-300 shadow-lg hover:scale-105 action-button home-button`}
        >
          <Home className={`${isMobile ? 'w-1.7 h-1.7' : 'w-4 h-4'} mr-1`} /> Go Home
        </button>
        
        <button
          onClick={() => setShowStats(true)}
          className={`flex items-center justify-center ${isMobile ? 'py-2 px-4 text-sm' : 'py-3 px-8 text-lg'} bg-[#a0522d] hover:bg-[#8b4513] text-[#f5e6ca] border-none font-bold rounded-md cursor-pointer transition-all duration-300 shadow-lg hover:scale-105 action-button stats-button`}
        >
          <BarChart3 className={`${isMobile ? 'w-1.7 h-1.7' : 'w-4 h-4'} mr-1`} /> View Stats
        </button>
      </div>
    </div>
  );
};

export default LeaderboardScene;