'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../Layout';
import Button from '../Button';
import { getCurrentLevel, getBasket, clearBasket } from '../utils/storage';
import { getRandomExperiment, setCurrentExperiment, getCurrentExperiment } from '../utils/gameLogic';

export default function RestaurantPage() {
  const router = useRouter();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelData, setLevelData] = useState(null);
  const [basket, setBasket] = useState([]);

  useEffect(() => {
    const level = getCurrentLevel();
    
    // Check if we already have a current experiment, if not get a random one
    let data = getCurrentExperiment();
    if (!data) {
      data = getRandomExperiment();
      setCurrentExperiment(data); // Store it so all scenes use the same experiment
    }
    
    const currentBasket = getBasket();
    
    setCurrentLevel(level);
    setLevelData(data);
    setBasket(currentBasket);
  }, []);

  const handleGoToMarket = () => router.push('/market');
  const handleSubmitOrder = () => router.push('/result');
  const handleClearBasket = () => {
    clearBasket();
    setBasket([]);
  };
  const handleGoToMenu = () => router.push('/');

  if (!levelData) return null;

  return (
    <Layout scene="restaurant">
      <div className="main-container" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: 'clamp(12px, 2.5vw, 32px)',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        
        {/* Header - Responsive */}
        <div className="header-section" style={{
          textAlign: 'center',
          marginBottom: 'clamp(12px, 3vh, 28px)',
          flexShrink: 0,
          minHeight: 'clamp(20px, 5vh, 40px)'
        }}>
          {/* Header content removed as per original */}
        </div>

        {/* Teacher Section - Enhanced Responsive */}
        <div className="teacher-section" style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(12px, 3vh, 24px)',
          maxHeight: 'calc(100vh - 140px)', // Ensure it doesn't overflow
          overflow: 'hidden'
        }}>
          
          {/* Teacher Avatar - Responsive sizing removed as per original */}

          {/* Speech Bubble - ENHANCED RESPONSIVE FOR MOBILE AND PC */}
          <div className="speech-bubble" style={{
            // PC positioning (move up)
            marginTop: '-68px', // MOVED UP for PC
            marginBottom: ' 62px',
            marginLeft: 'clamp(15px, 6vw, 90px)', // Adjusted for mobile
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 'clamp(10px, 2.5vw, 24px)',
            padding: 'clamp(8px, 2vw, 24px)', // Reduced padding for mobile
            maxWidth: 'clamp(150px, 82w, 500px)', // Reduced max width for mobile
            width: '60%',
            boxShadow: '0 6px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
            border: '1.5px solid rgba(33, 150, 243, 0.15)',
            backdropFilter: 'blur(8px)',
            minHeight: 'clamp(60px, 12vh, 120px)', // Ensure minimum height
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'fixed'
          }}>
            <h3 className="speech-title" style={{
              fontSize: 'clamp(20px, 1.2vw, 18px)', // Smaller font for mobile
              fontWeight: '600',
              color: '#2563eb',
              marginBottom: 'clamp(4px, 1vw, 12px)', // Reduced margin for mobile
              textAlign: 'center',
              lineHeight: '1.2' // Tighter line height
            }}>
              Professor says:
            </h3>
            <p className="question-text" style={{
              fontSize: 'clamp(5px, 1.0w, 16px)', // Much smaller font for mobile
              color: '#1e293b',
              lineHeight: 'clamp(1.2, 1.3, 1.4)', // Dynamic line height
              textAlign: 'center',
              fontStyle: 'italic',
              margin: 0,
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto', // Auto hyphenation for better text wrapping
              maxHeight: 'clamp(40px, 8vh, 80px)', // Limit height on mobile
              // maxWidth:'clamp(610px, 16vh, 160px)',
              overflow: 'hidden', // Hide overflow text if too long
              display: '-webkit-box',
              WebkitLineClamp: 'clamp(2, 3, 4)', // Dynamic line clamping
              WebkitBoxOrient: 'vertical'
            }}>
              "{levelData.question}"
            </p>
          </div>

          {/* Basket Display - Enhanced Responsive */}
          {basket.length > 0 && (
            <div className="basket-display" style={{
              borderRadius: 'clamp(10px, 2.5vw, 16px)',
              padding: 'clamp(10px, 2.5vw, 16px)',
              maxWidth: 'clamp(280px, 85vw, 500px)',
              width: '100%',
              minHeight: 'clamp(20px, 4vh, 40px)'
            }}>
              {/* Basket content preserved as original */}
            </div>
          )}
        </div>

        {/* Action Buttons - Enhanced Responsive Layout */}
        <div className="action-buttons" style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 'clamp(8px, 2vw, 16px)',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginBottom: 'clamp(20px, 5vh, 45px)',
          flexWrap: 'wrap',
          padding: '0 clamp(8px, 2vw, 16px)',
          maxWidth: '100%'
        }}>
          {basket.length === 0 ? (
            <>
              <Button
                variant="primary"
                onClick={handleGoToMarket}
                className="primary-btn"
                style={{
                  fontSize: 'clamp(11px, 2.2vw, 16px)',
                  padding: 'clamp(10px, 2.5vh, 16px) clamp(16px, 4vw, 24px)',
                  minWidth: 'clamp(140px, 28vw, 200px)',
                  maxWidth: 'clamp(200px, 45vw, 280px)',
                  minHeight: 'clamp(40px, 8vh, 56px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'clamp(4px, 1vw, 8px)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  borderRadius: 'clamp(8px, 2vw, 12px)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="1em" 
                  height="1em" 
                  strokeLinejoin="round" 
                  strokeLinecap="round" 
                  viewBox="0 0 24 24" 
                  strokeWidth={2} 
                  fill="none" 
                  stroke="currentColor" 
                  className="icon"
                  style={{
                    width: 'clamp(14px, 3vw, 18px)',
                    height: 'clamp(14px, 3vw, 18px)',
                    flexShrink: 0
                  }}
                >
                  <circle r={1} cy={21} cx={9} />
                  <circle r={1} cy={21} cx={20} />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg> 
                <span>GO TO LAB STORE</span>
              </Button>
              <Button
                variant="secondary"
                onClick={handleGoToMenu}
                className="secondary-btn"
                style={{
                  fontSize: 'clamp(11px, 2.2vw, 16px)',
                  padding: 'clamp(8px, 2vh, 12px) clamp(12px, 3vw, 20px)',
                  minWidth: 'clamp(80px, 18vw, 120px)',
                  minHeight: 'clamp(40px, 8vh, 48px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'clamp(4px, 1vw, 6px)',
                  borderRadius: 'clamp(8px, 2vw, 12px)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="1em" 
                  height="1em" 
                  viewBox="0 0 1024 1024" 
                  strokeWidth={0} 
                  fill="currentColor" 
                  stroke="currentColor" 
                  className="icon"
                  style={{
                    width: 'clamp(12px, 2.5vw, 16px)',
                    height: 'clamp(12px, 2.5vw, 16px)',
                    flexShrink: 0
                  }}
                >
                  <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z" />
                </svg> 
                <span>HOME</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                onClick={handleSubmitOrder}
                className="submit-btn"
                style={{
                  fontSize: 'clamp(10px, 2vw, 16px)',
                  padding: 'clamp(10px, 2.5vh, 16px) clamp(12px, 3vw, 20px)',
                  minWidth: 'clamp(160px, 35vw, 250px)',
                  maxWidth: 'clamp(250px, 50vw, 350px)',
                  minHeight: 'clamp(40px, 8vh, 56px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'clamp(4px, 1vw, 6px)',
                  whiteSpace: 'nowrap',
                  borderRadius: 'clamp(8px, 2vw, 12px)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  marginBottom: 'clamp(8px, 2vh, 12px)'
                }}
              >
                <svg 
                  className="w-[48px] h-[48px] text-gray-800 dark:text-white" 
                  aria-hidden="true" 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  fill="none" 
                  viewBox="0 0 24 24"
                  style={{
                    width: 'clamp(16px, 3.5vw, 20px)',
                    height: 'clamp(16px, 3.5vw, 20px)',
                    flexShrik: 0
                  }}
                >
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M5 11.917 9.724 16.5 19 7.5"/>
                </svg>
                <span>SUBMIT EQUIPMENT ({basket.length})</span>
              </Button>
              <div className="button-group" style={{
                display: 'flex',
                gap: 'clamp(6px, 1.5vw, 12px)',
                flexWrap: 'wrap',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '600px'
              }}>
                <Button
                  variant="secondary"
                  onClick={handleGoToMarket}
                  className="add-more-btn"
                  style={{
                    fontSize: 'clamp(10px, 2vw, 14px)',
                    padding: 'clamp(8px, 2vh, 12px) clamp(10px, 2.5vw, 16px)',
                    minWidth: 'clamp(80px, 18vw, 120px)',
                    minHeight: 'clamp(36px, 7vh, 48px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'clamp(3px, 0.8vw, 5px)',
                    borderRadius: 'clamp(6px, 1.5vw, 10px)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  + ADD MORE
                </Button>
                <Button
                  variant="danger"
                  onClick={handleClearBasket}
                  className="clear-btn"
                  style={{
                    fontSize: 'clamp(10px, 2vw, 14px)',
                    padding: 'clamp(8px, 2vh, 12px) clamp(10px, 2.5vw, 16px)',
                    minWidth: 'clamp(70px, 16vw, 100px)',
                    minHeight: 'clamp(36px, 7vh, 48px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'clamp(3px, 0.8vw, 5px)',
                    borderRadius: 'clamp(6px, 1.5vw, 10px)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  <svg 
                    className="w-[48px] h-[48px] text-gray-800 dark:text-white" 
                    aria-hidden="true" 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                    style={{
                      width: 'clamp(12px, 2.5vw, 16px)',
                      height: 'clamp(12px, 2.5vw, 16px)',
                      flexShrink: 0
                    }}
                  >
                    <path fillRule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clipRule="evenodd"/>
                  </svg>
                  <span>Clear</span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleGoToMenu}
                  className="home-btn"
                  style={{
                    fontSize: 'clamp(10px, 2vw, 14px)',
                    padding: 'clamp(8px, 2vh, 12px) clamp(10px, 2.5vw, 16px)',
                    minWidth: 'clamp(70px, 16vw, 100px)',
                    minHeight: 'clamp(36px, 7vh, 48px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'clamp(3px, 0.8vw, 5px)',
                    borderRadius: 'clamp(6px, 1.5vw, 10px)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="1em" 
                    height="1em" 
                    viewBox="0 0 1024 1024" 
                    strokeWidth={0} 
                    fill="currentColor" 
                    stroke="currentColor" 
                    className="icon"
                    style={{
                      width: 'clamp(12px, 2.5vw, 16px)',
                      height: 'clamp(12px, 2.5vw, 16px)',
                      flexShrink: 0
                    }}
                  >
                    <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z" />
                  </svg> 
                  <span>HOME</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        /* MANDATORY FULLSCREEN FOR ALL DEVICES - SIMPLE CSS */
        
        /* Force fullscreen container on ALL devices */
        .main-container {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          max-width: 100vw !important;
          max-height: 100vh !important;
          margin: 0 !important;
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          overflow: hidden !important;
        }

        /* Prevent any container scaling or windowing */
        * {
          box-sizing: border-box;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* Force body and html to be fullscreen */
        :global(html),
        :global(body) {
          width: 100vw !important;
          height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
        }

        /* Disable any browser zooming or scaling */
        :global(body) {
          zoom: 1 !important;
          transform: scale(1) !important;
          -webkit-text-size-adjust: 100% !important;
          -moz-text-size-adjust: 100% !important;
          -ms-text-size-adjust: 100% !important;
          text-size-adjust: 100% !important;
        }

        /* Mobile phones (320px - 480px) - ENHANCED RESPONSIVE */
        @media screen and (max-width: 480px) {
          .main-container {
            padding: clamp(8px, 2vw, 16px) !important;
          }

          .speech-bubble {
            margin-left: clamp(8px, 3vw, 15px) !important;
            margin-top: clamp(-120px, -15vh, -150px) !important;
            padding: clamp(6px, 1.5vw, 10px) !important;
            max-width: clamp(250px, 80vw, 300px) !important;
            width: clamp(70%, 80vw, 90%) !important;
          }
          
          .speech-title {
            font-size: clamp(9px, 2vw, 12px) !important;
            margin-bottom: clamp(2px, 0.8vw, 6px) !important;
          }
          
          .question-text {
            font-size: clamp(8px, 1.6vw, 11px) !important;
            line-height: 1.2 !important;
            -webkit-line-clamp: 2 !important;
            max-height: clamp(20px, 5vh, 30px) !important;
          }
          
          .action-buttons {
            flex-direction: column !important;
            gap: clamp(8px, 2vh, 12px) !important;
            padding: 0 clamp(12px, 3vw, 20px) !important;
          }
          
          .button-group {
            flex-direction: column !important;
            gap: clamp(6px, 1.5vh, 10px) !important;
            width: 100% !important;
          }

          .primary-btn,
          .secondary-btn,
          .submit-btn,
          .add-more-btn,
          .clear-btn,
          .home-btn {
            width: 100% !important;
            max-width: none !important;
            min-height: 44px !important;
          }
        }

        /* Extra Small Mobile phones (320px - 375px) */
        @media screen and (max-width: 375px) {
          .speech-bubble {
            margin-top: clamp(-100px, -12vh, -130px) !important;
            padding: clamp(5px, 1.2vw, 8px) !important;
            max-width: clamp(240px, 78vw, 280px) !important;
          }
          
          .speech-title {
            font-size: clamp(8px, 1.8vw, 10px) !important;
            margin-bottom: clamp(1px, 0.5vw, 4px) !important;
          }
          
          .question-text {
            font-size: clamp(7px, 1.4vw, 9px) !important;
            line-height: 1.1 !important;
            max-height: clamp(16px, 4vh, 24px) !important;
          }
        }

        /* Tablets (481px - 768px) */
        @media screen and (min-width: 481px) and (max-width: 768px) {
          .speech-bubble {
            margin-left: clamp(25px, 5vw, 50px) !important;
            margin-top: clamp(-200px, -25vh, -250px) !important;
            max-width: clamp(400px, 70vw, 500px) !important;
          }

          .action-buttons {
            flex-direction: row !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
          }
        }

        /* Small laptops and iPads (769px - 1024px) */
        @media screen and (min-width: 769px) and (max-width: 1024px) {
          .speech-bubble {
            margin-left: clamp(40px, 6vw, 70px) !important;
            margin-top: clamp(-240px, -30vh, -280px) !important;
            max-width: clamp(450px, 65vw, 550px) !important;
          }
        }

        /* Large screens and desktops (1025px+) */
        @media screen and (min-width: 1025px) {
          .speech-bubble {
            margin-left: clamp(60px, 7vw, 90px) !important;
            margin-top: clamp(-280px, -35vh, -320px) !important;
            max-width: clamp(500px, 60vw, 600px) !important;
          }
        }

        /* Ultra-large screens (1400px+) */
        @media screen and (min-width: 1400px) {
          .speech-bubble {
            margin-left: clamp(80px, 8vw, 100px) !important;
            margin-top: clamp(-300px, -38vh, -350px) !important;
            max-width: clamp(550px, 55vw, 650px) !important;
          }
        }

        /* Landscape orientation optimizations */
        @media screen and (orientation: landscape) and (max-height: 600px) {
          .main-container {
            padding: clamp(6px, 1.2vw, 12px) !important;
          }
          
          .teacher-section {
            gap: clamp(6px, 1.5vh, 12px) !important;
          }
          
          .speech-bubble {
            margin-top: clamp(-80px, -10vh, -120px) !important;
            padding: clamp(6px, 1.5vw, 12px) !important;
            max-height: clamp(50px, 12vh, 80px) !important;
          }
          
          .speech-title {
            font-size: clamp(8px, 1.8vw, 12px) !important;
            margin-bottom: clamp(2px, 0.5vw, 4px) !important;
          }
          
          .question-text {
            font-size: clamp(7px, 1.5vw, 10px) !important;
            -webkit-line-clamp: 1 !important;
          }
          
          .action-buttons {
            margin-bottom: clamp(10px, 2vh, 18px) !important;
          }
        }

        /* iOS Safari specific fixes */
        @supports (-webkit-touch-callout: none) {
          .main-container {
            height: -webkit-fill-available !important;
          }
          
          :global(body) {
            height: -webkit-fill-available !important;
          }
        }

        /* Android Chrome specific fixes */
        @media screen and (-webkit-min-device-pixel-ratio: 1) {
          .primary-btn,
          .secondary-btn,
          .submit-btn,
          .add-more-btn,
          .clear-btn,
          .home-btn {
            min-height: 48px !important;
            min-width: 48px !important;
          }
        }

        /* High DPI displays */
        @media screen and (min-resolution: 2dppx) {
          .icon {
            image-rendering: -webkit-optimize-contrast !important;
          }
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
          .primary-btn,
          .secondary-btn,
          .submit-btn,
          .add-more-btn,
          .clear-btn,
          .home-btn {
            min-height: 44px !important;
            min-width: 88px !important;
            font-size: clamp(12px, 3vw, 16px) !important;
          }
        }

        /* Prevent zoom on input focus (iOS) */
        :global(input),
        :global(select),
        :global(textarea) {
          font-size: 16px !important;
        }

        /* Smooth scrolling for all devices */
        * {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        /* Disable text selection and context menus */
        * {
          -webkit-touch-callout: none !important;
          -webkit-user-select: none !important;
          -khtml-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
        }

        /* Prevent any scrolling or overflow */
        :global(html),
        :global(body),
        .main-container {
          overflow: hidden !important;
          overscroll-behavior: none !important;
        }

        /* Force hardware acceleration */
        .main-container,
        .speech-bubble,
        .action-buttons {
          transform: translateZ(0) !important;
          will-change: transform !important;
          backface-visibility: hidden !important;
        }
      `}</style>
    </Layout>
  );
}
