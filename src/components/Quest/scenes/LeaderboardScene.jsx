"use client";
import '../../../styles/leaderboard.css';
import React, { useEffect, useRef, useState } from "react";
import { Home, BarChart3, Star } from "lucide-react";
import confetti from "canvas-confetti";
import { useRouter } from 'next/navigation';
import { getLeaderboard, formatDate } from '../../../services/labGameStorageService';

const LeaderboardScene = () => {
  const router = useRouter();
  const confettiIntervalRef = useRef(null);
  const [showStats, setShowStats] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const basketItemsContainerRef = useRef(null);

  const getIconSize = () => {
    if (isMobile) return 'w-4 h-4';
    if (isLandscape) return 'w-5 h-5';
    return 'w-6 h-6';
  };

  const getScoreFontSize = (score, isMobile) => {
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

  const getScorePadding = (score, isMobile) => {
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
      timestamp: entry.timestamp
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

    const randomInRange = (min, max) =>
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
    router.push('/');
  };

  const players = leaderboard.map((entry, index) => ({
    id: index + 1,
    username: entry.playerName,
    score: entry.score,
  }));

  const getAvatarSrc = () => {
    return "/assets/games/snakegame/male-avatar.png";
  };

  const handleAvatarError = (e, player) => {
    if (e.currentTarget.src.includes("/assets/games/snakegame/male-avatar.png")) {
      return;
    }
    e.currentTarget.src = "/assets/games/snakegame/female-avatar.png";
  };

  const containerStyle = {
    backgroundImage: "url(/assets/games/snakegame/backgroundimg.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const mainContainerStyle = {
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
      className={`fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center z-[2000] backdrop-blur-md p-2 md:p-4 leaderboard-container`}
      style={containerStyle}
    >
      {/* Score Display */}
      <div className="score-display absolute" style={{ 
        right: '10px',
        left: 'auto',
      }}>
        <div className="score-item flex items-center">
          {/* Optional leaderboard title */}
        </div>
      </div>

      {/* Main Container */}
      <div className="relative main-container" style={mainContainerStyle}>
        {/* SVG Background - Only render if not in landscape mode on mobile */}
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

        {/* Content Overlay */}
        <div className={`absolute inset-0 content-overlay ${isMobile ? 'p-8' : 'p-16'}`}>
          {/* PNG Banner Image - Only show on desktop/laptop */}
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

          {/* Leaderboard Container */}
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
            {/* Scrollable Content Area */}
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
                  let rowStyle = {};

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
                      className="rounded-xl px-2 py-2 flex items-center shadow-md opacity-85 hover:opacity-100 transition-opacity duration-200 flex-shrink-0 leaderboard-item"
                      style={{
                        ...rowStyle,
                        minHeight: isMobile ? "15px" : "17px",
                      }}
                    >
                      {/* Rank Medal - Touch top and bottom for top 3 */}
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

                      {/* Avatar */}
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

                      {/* Username */}
                      <div className="flex-grow min-w-0 mr-2 username-container">
                        <p className={`text-white font ${isMobile ? 'text-base' : 'text-lg'} tracking-wide drop-shadow-sm break-words username-text`}>
                          {player.username}
                        </p>
                      </div>

                      {/* Score with Coin - Fixed width with dynamic font size */}
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

      {/* Buttons */}
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

      {/* Enhanced Mobile-Only CSS - Desktop remains unchanged */}
      <style jsx global>{`
        /* Desktop styles remain completely unchanged - PERFECT PRESERVATION */
        @media screen and (min-width: 1024px) {
          /* All desktop styles preserved exactly as they are - NO CHANGES */
        }

        /* Mobile-only optimizations - Hide banner and optimize layout */
        @media screen and (max-width: 1023px) {
          /* Hide banner on mobile only */
          .mobile-hidden {
            display: none !important;
          }

          /* Mobile Portrait - Optimized without banner */
          @media (orientation: portrait) {
            .leaderboard-container {
              transform: scale(0.85);
              transform-origin: center center;
              padding: 12px !important;
            }

            .main-container {
              width: 85% !important;
              max-width: 420px !important;
              height: auto !important;
              max-height: none !important;
            }

            .content-overlay {
              padding: 20px !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: center !important;
              height: 100% !important;
            }

            .leaderboard-list-container {
              width: 100% !important;
              max-width: 380px !important;
              height: 70vh !important;
              margin: 0 auto !important;
              margin-top: 20px !important;
            }

            .leaderboard-items {
              padding: 6px !important;
            }

            .leaderboard-item {
              min-height: 50px !important;
              padding: 10px 8px !important;
              margin-bottom: 8px !important;
            }

            .trophy-container {
              width: 48px !important;
              height: 48px !important;
            }

            .trophy-image {
              width: 56px !important;
              height: 64px !important;
            }

            .rank-number {
              font-size: 1.25rem !important;
              width: 48px !important;
              height: 48px !important;
            }

            .avatar-container .avatar-circle {
              width: 32px !important;
              height: 32px !important;
            }

            .username-container .username-text {
              font-size: 1.125rem !important;
            }

            .score-container .score-badge {
              height: 26px !important;
              width: 70px !important;
              padding-left: 32px !important;
            }

            .score-container .coin-image {
              width: 24px !important;
              height: 24px !important;
              left: -8px !important;
            }

            .score-container .score-text {
              font-size: 0.875rem !important;
            }

            .button-container {
              margin-top: 20px !important;
              gap: 16px !important;
            }

            .action-button {
              padding: 12px 28px !important;
              font-size: 1rem !important;
            }

            .action-button svg {
              width: 18px !important;
              height: 18px !important;
            }
          }

          /* Mobile Landscape - Optimized without banner */
          @media (orientation: landscape) {
            .leaderboard-container {
              transform: scale(0.8) !important;
              transform-origin: center center !important;
              padding: 8px !important;
              height: 100vh !important;
              width: 100vw !important;
              overflow: hidden !important;
            }

            .main-container {
              width: 90% !important;
              max-width: 700px !important;
              height: 95vh !important;
              max-height: 95vh !important;
              background-color: #FFDCB8 !important;
              border-radius: 25px !important;
              border: 6px solid #a0522d !important;
              margin: 0 auto !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: center !important;
            }

            .content-overlay {
              padding: 16px !important;
              height: 100% !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: center !important;
            }

            .leaderboard-list-container {
              width: 100% !important;
              max-width: 620px !important;
              height: 75vh !important;
              margin: 0 auto !important;
              margin-top: 10px !important;
              flex: 1 !important;
            }

            .leaderboard-items {
              padding: 8px !important;
            }

            .leaderboard-item {
              min-height: 45px !important;
              padding: 8px 12px !important;
              margin-bottom: 6px !important;
            }

            .trophy-container {
              width: 44px !important;
              height: 44px !important;
            }

            .trophy-image {
              width: 52px !important;
              height: 60px !important;
            }

            .rank-number {
              font-size: 1.125rem !important;
              width: 44px !important;
              height: 44px !important;
            }

            .avatar-container .avatar-circle {
              width: 28px !important;
              height: 28px !important;
            }

            .username-container .username-text {
              font-size: 1rem !important;
            }

            .score-container .score-badge {
              height: 24px !important;
              width: 65px !important;
              padding-left: 28px !important;
            }

            .score-container .coin-image {
              width: 20px !important;
              height: 20px !important;
              left: -6px !important;
            }

            .score-container .score-text {
              font-size: 0.75rem !important;
            }

            .button-container {
              margin-top: 12px !important;
              gap: 12px !important;
              flex-shrink: 0 !important;
            }

            .action-button {
              padding: 8px 24px !important;
              font-size: 0.875rem !important;
            }

            .action-button svg {
              width: 16px !important;
              height: 16px !important;
            }
          }

          /* Small mobile landscape devices */
          @media (max-width: 667px) and (orientation: landscape) {
            .leaderboard-container {
              transform: scale(0.7) !important;
            }

            .main-container {
              max-width: 650px !important;
              height: 92vh !important;
            }

            .leaderboard-list-container {
              height: 72vh !important;
              max-width: 580px !important;
            }
          }

          /* Extra small mobile landscape */
          @media (max-width: 568px) and (orientation: landscape) {
            .leaderboard-container {
              transform: scale(0.65) !important;
              padding: 4px !important;
            }

            .main-container {
              max-width: 600px !important;
              height: 90vh !important;
            }

            .leaderboard-list-container {
              height: 70vh !important;
              max-width: 520px !important;
            }

            .leaderboard-item {
              min-height: 40px !important;
              padding: 6px 10px !important;
            }
          }
        }

        /* Preserve all existing scrollbar and trophy styles */
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

export default LeaderboardScene;
