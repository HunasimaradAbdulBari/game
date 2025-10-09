// src/app/page.js - Science Lab Quest Menu - Enhanced UI with Same Content
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../components/Quest/Layout';
import Button from '../components/Quest/Button';
import { resetProgress } from '../components/Quest/utils/storage';


export default function MenuPage() {
  const router = useRouter();
  const [showInstructions, setShowInstructions] = useState(false);


  const handleStartGame = () => {
    router.push('/restaurant');
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
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(16px, 4vw, 32px)',
        zIndex: 1
      }}>
        
        {/* Enhanced Title Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'clamp(32px, 8vh, 64px)',
          animation: 'fadeIn 0.8s ease-out',
          position: 'relative'
        }}>
          
          {/* Title Background Glow */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120%',
            height: '120%',
            background: 'radial-gradient(ellipse at center, rgba(78, 66, 1, 0.1) 0%, rgba(184, 132, 1, 0.1) 30%, transparent 70%)',
            borderRadius: '50%',
            animation: 'pulse 3s ease-in-out infinite',
            zIndex: -1
          }} />


          <h1 style={{
           
            fontSize: 'clamp(28px, 8vw, 48px)',
            fontWeight: '800',
            color: '#1e293b',
            background: 'linear-gradient(135deg, #4e4201ff 0%, #b88401ff 50%, #d4a820ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            fontFamily: 'poppins, -apple-system, BlinkMacSystemFont, sans-serif',
            lineHeight: '1.1',
            textShadow: '0 4px 20px rgba(184, 132, 1, 0.3)',
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
            position: 'relative',
            zIndex: 2
          }}>
            Apparatus Quest
          </h1>
          
          {/* Decorative underline */}
          <div style={{
            width: 'clamp(60px, 15vw, 100px)',
            height: '3px',
            background: 'linear-gradient(90deg, transparent 0%, #b88401ff 50%, transparent 100%)',
            margin: 'clamp(8px, 2vh, 16px) auto 0 auto',
            borderRadius: '2px',
            animation: 'shimmer 2s ease-in-out infinite'
          }} />
        </div>


        {/* Enhanced Main Game Button Container */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(16px, 4vh, 24px)',
          alignItems: 'center',
          width: '100%',
          maxWidth: '400px',
          marginTop: '150px',
          position: 'relative',
          marginBottom:'-70px'
        }}>
          
          {/* Start Button with Enhanced Effects */}
          <div style={{ 
            
            position: 'relative',
            width: '100%',
            filter: 'drop-shadow(0 8px 25px rgba(37, 99, 235, 0.25))'
          }}>
            <Button
              variant="primary"
              onClick={handleStartGame}
              style={{
                fontSize: 'clamp(16px, 3.5vw, 20px)',
                fontWeight: '700',
                padding: 'clamp(16px, 4vh, 20px) clamp(32px, 8vw, 48px)',
                width: '100%',
                minHeight: 'clamp(60px, 12vh, 80px)',
                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 25%, #7c3aed 75%, #8b5cf6 100%)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 'clamp(12px, 3vw, 16px)',
                boxShadow: `
                  0 8px 32px rgba(37, 99, 235, 0.3), 
                  inset 0 1px 0 rgba(255, 255, 255, 0.3),
                  0 0 0 1px rgba(255, 255, 255, 0.1)
                `,
                transform: 'translateY(0)',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                color: '#ffffff',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                letterSpacing: '0.02em',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px) scale(1.02)';
                e.target.style.boxShadow = `
                  0 16px 48px rgba(37, 99, 235, 0.4), 
                  inset 0 1px 0 rgba(255, 255, 255, 0.4),
                  0 0 0 1px rgba(255, 255, 255, 0.2)
                `;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = `
                  0 8px 32px rgba(37, 99, 235, 0.3), 
                  inset 0 1px 0 rgba(255, 255, 255, 0.3),
                  0 0 0 1px rgba(255, 255, 255, 0.1)
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
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                // animation: 'shine 3s ease-in-out infinite',
                zIndex: 1
              }} />
              
              <span style={{ 
                position: 'relative', 
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  style={{
                    width: 'clamp(16px, 3.5vw, 20px)',
                    height: 'clamp(16px, 3.5vw, 20px)'
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


          {/* Enhanced Secondary Buttons */}
          <div style={{
            display: 'flex',
            gap: 'clamp(8px, 2vw, 12px)',
            width: '100%',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Button
              variant="secondary"
              onClick={handleShowInstructions}
              style={{
                fontSize: 'clamp(12px, 2.5vw, 16px)',
                fontWeight: '600',
                padding: 'clamp(10px, 2vh, 14px) clamp(16px, 4vw, 24px)',
                flex: '1',
                minWidth: 'clamp(120px, 25vw, 160px)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
                border: '2px solid rgba(203, 213, 225, 0.6)',
                borderRadius: 'clamp(8px, 2vw, 12px)',
                color: '#475569',
                boxShadow: `
                  0 4px 15px rgba(0, 0, 0, 0.08), 
                  inset 0 1px 0 rgba(255, 255, 255, 0.8)
                `,
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                backdropFilter: 'blur(10px)',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = `
                  0 8px 25px rgba(0, 0, 0, 0.12), 
                  inset 0 1px 0 rgba(255, 255, 255, 0.9)
                `;
                e.target.style.background = 'linear-gradient(135deg, rgba(241, 245, 249, 0.95) 0%, rgba(226, 232, 240, 0.95) 100%)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = `
                  0 4px 15px rgba(0, 0, 0, 0.08), 
                  inset 0 1px 0 rgba(255, 255, 255, 0.8)
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
                fontSize: 'clamp(12px, 2.5vw, 16px)',
                fontWeight: '600',
                padding: 'clamp(10px, 2vh, 14px) clamp(16px, 4vw, 24px)',
                flex: '1',
                minWidth: 'clamp(120px, 25vw, 160px)',
                background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.9) 0%, rgba(254, 226, 226, 0.9) 100%)',
                border: '2px solid rgba(252, 165, 165, 0.6)',
                borderRadius: 'clamp(8px, 2vw, 12px)',
                color: '#dc2626',
                boxShadow: `
                  0 4px 15px rgba(220, 38, 38, 0.15), 
                  inset 0 1px 0 rgba(255, 255, 255, 0.8)
                `,
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                backdropFilter: 'blur(10px)',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = `
                  0 8px 25px rgba(220, 38, 38, 0.2), 
                  inset 0 1px 0 rgba(255, 255, 255, 0.9)
                `;
                e.target.style.background = 'linear-gradient(135deg, rgba(254, 226, 226, 0.95) 0%, rgba(252, 165, 165, 0.3) 100%)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = `
                  0 4px 15px rgba(220, 38, 38, 0.15), 
                  inset 0 1px 0 rgba(255, 255, 255, 0.8)
                `;
                e.target.style.background = 'linear-gradient(135deg, rgba(254, 242, 242, 0.9) 0%, rgba(254, 226, 226, 0.9) 100%)';
              }}
            >
              Reset Game
            </Button>
          </div>
        </div>


        {/* Enhanced Instructions Modal */}
        {showInstructions && (
          <div style={{
            position: 'fixed',
            overlay:'none',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 'clamp(16px, 4vw, 32px)',
            animation: 'fadeIn 0.3s ease-out'
          }} onClick={() => setShowInstructions(false)}>
            
            <div style={{
              backgroundColor: '#fff',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: 'clamp(16px, 4vw, 24px)',
              padding: 'clamp(24px, 6vw, 32px)',
              maxWidth: 'min(90vw, 500px)',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: `
                0 25px 80px rgba(0,0,0,0.3), 
                inset 0 1px 0 rgba(255, 255, 255, 0.9),
                0 0 0 1px rgba(255, 255, 255, 0.2)
              `,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              animation: 'modalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }} onClick={(e) => e.stopPropagation()}>
              
              {/* Modal Header with Enhanced Styling */}
              <div style={{
                textAlign: 'center',
                marginBottom: 'clamp(20px, 5vh, 28px)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '120px',
                  height: '120px',
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                  borderRadius: '50%',
                  zIndex: -1,
                  overlay: 'none'
                }} />
                
                <h3 style={{
                  fontSize: 'clamp(18px, 4vw, 24px)',
                  fontWeight: '800',
                  color: '#1e293b',
                  textAlign: 'center',
                  marginBottom: 'clamp(8px, 2vh, 12px)',
                  background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  🧪 HOW TO PLAY
                </h3>
                
                <div style={{
                  width: '60px',
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent 0%, #3b82f6 50%, transparent 100%)',
                  margin: '0 auto',
                  borderRadius: '2px'
                }} />
              </div>
              
              {/* Enhanced Instructions Content */}
              <div style={{
                fontSize: 'clamp(14px, 3vw, 16px)',
                color: '#475569',
                lineHeight: '1.7',
                marginBottom: 'clamp(24px, 6vh, 32px)',
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
                    margin: '0 0 12px 0',
                    padding: '8px 0',
                    borderLeft: '3px solid rgba(59, 130, 246, 0.3)',
                    paddingLeft: '16px',
                    background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%)',
                    borderRadius: '0 8px 8px 0'
                  }}>
                    <strong style={{ 
                      color: '#1e293b',
                      marginRight: '8px',
                      display: 'inline-block',
                      minWidth: '20px'
                    }}>
                      {index + 1}.
                    </strong>
                    {text}
                  </p>
                ))}
              </div>
              
              {/* Enhanced Close Button */}
              <Button
                variant="primary"
                onClick={() => setShowInstructions(false)}
                style={{
                  width: '100%',
                  fontSize: 'clamp(14px, 3vw, 16px)',
                  fontWeight: '700',
                  padding: 'clamp(12px, 3vh, 16px)',
                  background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 25%, #6366f1 75%, #8b5cf6 100%)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 'clamp(8px, 2vw, 12px)',
                  color: '#ffffff',
                  boxShadow: `
                    0 8px 25px rgba(59, 130, 246, 0.3), 
                    inset 0 1px 0 rgba(255, 255, 255, 0.3)
                  `,
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1.02)';
                  e.target.style.boxShadow = `
                    0 12px 35px rgba(59, 130, 246, 0.4), 
                    inset 0 1px 0 rgba(255, 255, 255, 0.4)
                  `;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = `
                    0 8px 25px rgba(59, 130, 246, 0.3), 
                    inset 0 1px 0 rgba(255, 255, 255, 0.3)
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }


        @keyframes pulse {
          0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
        }


        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }


        @keyframes shine {
          0% { left: -100%; }
          50%, 100% { left: 100%; }
        }


        @keyframes modalSlideIn {
          from { 
            opacity: 0; 
            transform: translateY(-20px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
      `}</style>
    </Layout>
  );
}
