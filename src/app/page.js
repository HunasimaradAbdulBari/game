// src/app/page.js - Science Lab Quest Menu - Enhanced UI with Same Content
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../components/Quest/Layout';
import Button from '../components/Quest/Button';
import { resetProgress } from '../components/Quest/utils/storage';

export default function MenuPage() {
  const router = useRouter();
  const [showInstructions, setShowInstructions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection function
  const detectMobileDevice = () => {
    if (typeof window === 'undefined') return false;
    
    // Check using matchMedia for screen width
    const mobileBreakpoint = window.matchMedia('(max-width: 768px)');
    
    // Check using user agent for mobile devices
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    
    // Return true if either condition is met
    return mobileBreakpoint.matches || mobileRegex.test(userAgent);
  };

  // Cross-browser fullscreen function
  const requestFullscreen = () => {
    if (typeof document === 'undefined') return;
    
    const elem = document.documentElement;
    
    try {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen().catch(() => {});
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen().catch(() => {});
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen().catch(() => {});
      }
      
      // For mobile browsers - hide address bar
      if (window.screen && window.screen.orientation) {
        setTimeout(() => {
          window.scrollTo(0, 1);
        }, 500);
      }
    } catch (error) {
      console.log('Fullscreen request failed:', error);
    }
  };

  // Force fullscreen only on mobile devices
  useEffect(() => {
    const checkDevice = () => {
      const mobile = detectMobileDevice();
      setIsMobile(mobile);
      
      // Only enter fullscreen on mobile devices
      if (mobile) {
        const enterFullscreen = () => {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen().catch(() => {});
          } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen().catch(() => {});
          } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen().catch(() => {});
          }
          
          // For mobile browsers - hide address bar
          if (window.screen && window.screen.orientation) {
            setTimeout(() => {
              window.scrollTo(0, 1);
            }, 500);
          }
        };

        // Attempt fullscreen after a short delay only on mobile
        const timer = setTimeout(enterFullscreen, 100);
        return () => clearTimeout(timer);
      }
    };

    checkDevice();

    // Listen for resize events to update mobile detection
    const handleResize = () => {
      const mobile = detectMobileDevice();
      setIsMobile(mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStartGame = () => {
    // Request fullscreen first, then navigate
    requestFullscreen();
    
    // Navigate to the game after a short delay to ensure fullscreen is activated
    setTimeout(() => {
      router.push('/restaurant');
    }, 200);
  };

  const handleResetProgress = () => {
    if (typeof window !== 'undefined' && window.confirm) {
      const confirmReset = window.confirm('Are you sure you want to reset all progress? This cannot be undone.');
      if (confirmReset) {
        resetProgress();
        window.location.reload();
      }
    }
  };

  const handleShowInstructions = () => {
    setShowInstructions(true);
  };

  return (
    <Layout scene="menu">
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(8px, 2vw, 24px)',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        
        {/* Enhanced Title Section - Perfect Center */}
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '52%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          animation: 'fadeIn 0.8s ease-out',
          width: '100%',
          maxWidth: '600px',
          marginTop: 'clamp(-80px, -10vh, -60px)' // Slight upward adjustment for perfect center
        }}>
          
          {/* Title Background Glow - Responsive */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(250px, 60vw, 450px)',
            height: 'clamp(120px, 30vw, 220px)',
            background: 'radial-gradient(ellipse at center, rgba(78, 66, 1, 0.12) 0%, rgba(184, 132, 1, 0.08) 40%, transparent 80%)',
            borderRadius: '50%',
            animation: 'pulse 4s ease-in-out infinite',
            zIndex: -1
          }} />

          <h1 style={{
            fontSize: 'clamp(32px, 8vw, 54px)',
            fontWeight: '800',
            color: '#1e293b',
            background: 'linear-gradient(135deg, #4e4201ff 0%, #523b00ff 50%, #5b4501ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            fontFamily: 'poppins, -apple-system, BlinkMacSystemFont, sans-serif',
            lineHeight: '1.1',
            // textShadow: '  rgba(5, 109, 255, 1)',
            // filter: 'drop-shadow(0 3px 8px rgba(92, 77, 1, 1))',
            position: 'relative',
            zIndex: 2,
            letterSpacing: 'clamp(-1px, -0.025em, 0px)'
          }}>
           Draggy
          </h1>
          
          {/* Decorative underline - Enhanced */}
          <div style={{
            width: 'clamp(70px, 18vw, 100px)',
            height: 'clamp(3px, 0.4vh, 4px)',
            background: 'linear-gradient(90deg, transparent 0%, #b88401ff 50%, transparent 100%)',
            margin: 'clamp(8px, 2vh, 16px) auto 0 auto',
            borderRadius: '3px',
            animation: 'shimmer 2s ease-in-out infinite'
          }} />
        </div>

        {/* Enhanced Main Game Button Container - Repositioned for PC */}
        <div style={{
          position: 'absolute',
          bottom: 'clamp(60px, 15vh, 120px)', // Positioned from bottom for better PC experience
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(12px, 2.5vh, 20px)',
          alignItems: 'center',
          width: '100%',
          maxWidth: 'clamp(280px, 85vw, 450px)'
        }}>
          
          {/* Start Button with Enhanced Effects - Mobile First */}
          <div style={{ 
            position: 'relative',
            width: '100%',
            filter: 'drop-shadow(0 6px 20px rgba(37, 99, 235, 0.2))'
          }}>
            <Button
              variant="primary"
              onClick={handleStartGame}
              style={{
                fontSize: 'clamp(14px, 3vw, 18px)',
                fontWeight: '700',
                padding: 'clamp(10-px, 3vh, 14px) clamp(20px, 6vw, 36px)',
                width: '100%',
                minHeight: 'clamp(50px, 10vh, 70px)',
                maxHeight: '80px',
                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 25%, #7c3aed 75%, #8b5cf6 100%)',
                border: '2px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 'clamp(10px, 2.5vw, 14px)',
                boxShadow: `
                  0 6px 24px rgba(37, 99, 235, 0.25), 
                  inset 0 1px 0 rgba(255, 255, 255, 0.25),
                  0 0 0 1px rgba(255, 255, 255, 0.08)
                `,
                transform: 'translateY(0)',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.2)',
                color: '#ffffff',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
                letterSpacing: '0.015em',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(6px, 1.5vw, 8px)',
                cursor: 'pointer',
                marginLeft:'27px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.02)';
                e.target.style.boxShadow = `
                  0 12px 35px rgba(37, 99, 235, 0.35), 
                  inset 0 1px 0 rgba(255, 255, 255, 0.35),
                  0 0 0 1px rgba(255, 255, 255, 0.15)
                `;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = `
                  0 6px 24px rgba(37, 99, 235, 0.25), 
                  inset 0 1px 0 rgba(255, 255, 255, 0.25),
                  0 0 0 1px rgba(255, 255, 255, 0.08)
                `;
              }}
            >
              {/* Button shine effect */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                zIndex: 1
              }} />
              
              <span style={{ 
                position: 'relative', 
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(4px, 1vw, 6px)'
              }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  style={{
                    width: 'clamp(14px, 3vw, 18px)',
                    height: 'clamp(14px, 3vw, 18px)',
                    flexShrink: 0
                  }}
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path
                    d="M8 13V9m-2 2h4m5-2v.001M18 12v.001m4-.334v5.243a3.09 3.09 0 0 1-5.854 1.382L16 18a3.618 3.618 0 0 0-3.236-2h-1.528c-1.37 0-2.623.774-3.236 2l-.146.292A3.09 3.09 0 0 1 2 16.91v-5.243A6.667 6.667 0 0 1 8.667 5h6.666A6.667 6.667 0 0 1 22 11.667Z"
                  ></path>
                </svg>
                START GAME
              </span>
            </Button>
          </div>

          {/* Enhanced Secondary Buttons - Landscape Layout */}
          <div style={{
            display: 'flex',
            gap: 'clamp(8px, 2vw, 10px)',
            width: '100%',
            justifyContent: 'center',
            flexWrap: 'wrap',
            maxWidth: '100%'
          }}>
            <Button
              variant="secondary"
              onClick={handleShowInstructions}
              style={{
                fontSize: 'clamp(11px, 2.2vw, 14px)',
                fontWeight: '600',
                padding: 'clamp(8px, 2vh, 12px) clamp(12px, 3vw, 20px)',
                flex: '1',
                minWidth: 'clamp(100px, 20vw, 140px)',
                maxWidth: '200px',
                minHeight: 'clamp(40px, 8vh, 50px)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
                border: '1.5px solid rgba(203, 213, 225, 0.5)',
                borderRadius: 'clamp(8px, 2vw, 10px)',
                color: '#475569',
                boxShadow: `
                  0 3px 12px rgba(0, 0, 0, 0.06), 
                  inset 0 1px 0 rgba(255, 255, 255, 0.7)
                `,
                transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.2)',
                backdropFilter: 'blur(8px)',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.7)',
                cursor: 'pointer',
                marginLeft:'38px '
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = `
                  0 6px 20px rgba(0, 0, 0, 0.1), 
                  inset 0 1px 0 rgba(255, 255, 255, 0.8)
                `;
                e.target.style.background = 'linear-gradient(135deg, rgba(241, 245, 249, 0.95) 0%, rgba(226, 232, 240, 0.95) 100%)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = `
                  0 3px 12px rgba(0, 0, 0, 0.06), 
                  inset 0 1px 0 rgba(255, 255, 255, 0.7)
                `;
                e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)';
              }}
            >
              How to Play
            </Button>
            
            <Button
              variant="danger"
              onClick={handleResetProgress}
              style={{
                fontSize: 'clamp(11px, 2.2vw, 14px)',
                fontWeight: '600',
                padding: 'clamp(8px, 2vh, 12px) clamp(12px, 3vw, 20px)',
                flex: '1',
                minWidth: 'clamp(100px, 20vw, 140px)',
                maxWidth: '200px',
                minHeight: 'clamp(40px, 8vh, 50px)',
                background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.9) 0%, rgba(254, 226, 226, 0.9) 100%)',
                border: '1.5px solid rgba(252, 165, 165, 0.5)',
                borderRadius: 'clamp(8px, 2vw, 10px)',
                color: '#dc2626',
                boxShadow: `
                  0 3px 12px rgba(220, 38, 38, 0.12), 
                  inset 0 1px 0 rgba(255, 255, 255, 0.7)
                `,
                transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.2)',
                backdropFilter: 'blur(8px)',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                marginRight:'-20px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = `
                  0 6px 20px rgba(220, 38, 38, 0.18), 
                  inset 0 1px 0 rgba(255, 255, 255, 0.8)
                `;
                e.target.style.background = 'linear-gradient(135deg, rgba(254, 226, 226, 0.95) 0%, rgba(252, 165, 165, 0.25) 100%)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = `
                  0 3px 12px rgba(220, 38, 38, 0.12), 
                  inset 0 1px 0 rgba(255, 255, 255, 0.7)
                `;
                e.target.style.background = 'linear-gradient(135deg, rgba(254, 242, 242, 0.9) 0%, rgba(254, 226, 226, 0.9) 100%)';
              }}
            >
              Reset Game
            </Button>
          </div>
        </div>

        {/* Enhanced Instructions Modal - Fully Responsive */}
        {showInstructions && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 'clamp(12px, 3vw, 24px)',
            animation: 'fadeIn 0.3s ease-out'
          }} onClick={() => setShowInstructions(false)}>
            
            <div style={{
              backgroundColor: '#fff',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: 'clamp(12px, 3vw, 20px)',
              padding: 'clamp(20px, 5vw, 28px)',
              maxWidth: 'min(90vw, 420px)',
              maxHeight: '85vh',
              overflow: 'auto',
              boxShadow: `
                0 20px 60px rgba(0,0,0,0.25), 
                inset 0 1px 0 rgba(255, 255, 255, 0.9),
                0 0 0 1px rgba(255, 255, 255, 0.15)
              `,
              border: '1px solid rgba(255, 255, 255, 0.25)',
              animation: 'modalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.2)',
              scrollbarWidth: 'thin'
            }} onClick={(e) => e.stopPropagation()}>
              
              {/* Modal Header with Enhanced Styling - Responsive */}
              <div style={{
                textAlign: 'center',
                marginBottom: 'clamp(16px, 4vh, 24px)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'clamp(80px, 20vw, 100px)',
                  height: 'clamp(80px, 20vw, 100px)',
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
                  borderRadius: '50%',
                  zIndex: -1
                }} />
                
                <h3 style={{
                  fontSize: 'clamp(16px, 3.5vw, 20px)',
                  fontWeight: '800',
                  color: '#1e293b',
                  textAlign: 'center',
                  marginBottom: 'clamp(6px, 1.5vh, 10px)',
                  background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
                }}>
                   HOW TO PLAY
                </h3>
                
                <div style={{
                  width: 'clamp(40px, 10vw, 50px)',
                  height: 'clamp(2px, 0.3vh, 3px)',
                  background: 'linear-gradient(90deg, transparent 0%, #3b82f6 50%, transparent 100%)',
                  margin: '0 auto',
                  borderRadius: '2px'
                }} />
              </div>
              
              {/* Enhanced Instructions Content - Mobile Optimized */}
              <div style={{
                fontSize: 'clamp(12px, 2.8vw, 14px)',
                color: '#475569',
                lineHeight: '1.6',
                marginBottom: 'clamp(20px, 5vh, 28px)',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
              }}>
                {[
                  'Visit the Science Teacher to get your equipment request',
                  'Go to the lab equipment store',
                  'Drag items to your basket or tap to add them',
                  'Collect the correct equipment for the experiment',
                  'Submit your equipment list to complete!',
                  'Get all items correct to succeed!'
                ].map((text, index) => (
                  <p key={index} style={{
                    margin: '0 0 clamp(8px, 2vh, 10px) 0',
                    padding: 'clamp(6px, 1.5vh, 8px) 0',
                    borderLeft: 'clamp(2px, 0.5vw, 3px) solid rgba(59, 130, 246, 0.25)',
                    paddingLeft: 'clamp(12px, 3vw, 14px)',
                    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.04) 0%, transparent 100%)',
                    borderRadius: '0 clamp(6px, 1.5vw, 8px) clamp(6px, 1.5vw, 8px) 0'
                  }}>
                    <strong style={{ 
                      color: '#1e293b',
                      marginRight: 'clamp(6px, 1.5vw, 8px)',
                      display: 'inline-block',
                      minWidth: 'clamp(16px, 4vw, 18px)',
                      fontSize: 'clamp(12px, 2.8vw, 14px)'
                    }}>
                      {index + 1}.
                    </strong>
                    {text}
                  </p>
                ))}
              </div>
              
              {/* Enhanced Close Button - Responsive */}
              <Button
                variant="primary"
                onClick={() => setShowInstructions(false)}
                style={{
                  width: '100%',
                  fontSize: 'clamp(12px, 2.8vw, 14px)',
                  fontWeight: '700',
                  padding: 'clamp(10px, 2.5vh, 14px)',
                  minHeight: 'clamp(40px, 8vh, 48px)',
                  background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 25%, #6366f1 75%, #8b5cf6 100%)',
                  border: '1.5px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'clamp(8px, 2vw, 10px)',
                  color: '#ffffff',
                  boxShadow: `
                    0 6px 20px rgba(59, 130, 246, 0.25), 
                    inset 0 1px 0 rgba(255, 255, 255, 0.25)
                  `,
                  transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.2)',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1.02)';
                  e.target.style.boxShadow = `
                    0 10px 30px rgba(59, 130, 246, 0.35), 
                    inset 0 1px 0 rgba(255, 255, 255, 0.35)
                  `;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = `
                    0 6px 20px rgba(59, 130, 246, 0.25), 
                    inset 0 1px 0 rgba(255, 255, 255, 0.25)
                  `;
                }}
              >
                GOT IT!
              </Button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        /* Conditional fullscreen styles - only for mobile */
        ${isMobile ? `
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            position: fixed;
          }
        ` : `
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
          }
        `}

        /* Enhanced Responsive Animations */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(clamp(20px, 4vh, 30px)); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.05); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes modalSlideIn {
          from { 
            opacity: 0; 
            transform: translateY(clamp(-15px, -3vh, -20px)) scale(0.96); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }

        /* Enhanced Scrollbar for Modal */
        div::-webkit-scrollbar {
          width: clamp(4px, 1vw, 6px);
        }
        
        div::-webkit-scrollbar-track {
          background: rgba(241, 245, 249, 0.5);
          border-radius: 10px;
        }
        
        div::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.6);
          border-radius: 10px;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.8);
        }

        /* Mobile-specific fullscreen optimizations */
        ${isMobile ? `
          @media screen and (max-height: 600px) {
            body {
              -webkit-overflow-scrolling: touch;
              overflow: hidden;
            }
          }

          /* Hide address bar on mobile */
          @media screen and (orientation: landscape) and (max-height: 500px) {
            body {
              height: 100vh;
              height: -webkit-fill-available;
            }
          }
        ` : ''}

        /* Ultra-wide Screen Support */
        @media screen and (min-width: 1400px) {
          .max-content-width {
            max-width: 600px;
          }
        }

        /* Touch Device Optimizations */
        @media (hover: none) and (pointer: coarse) {
          button {
            min-height: clamp(44px, 9vh, 56px) !important;
            font-size: clamp(14px, 3.2vw, 16px) !important;
          }
        }
      `}</style>
    </Layout>
  );
}
