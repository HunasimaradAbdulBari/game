// src/components/Quest/scenes/RestaurantScene.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../Layout';
import Button from '../Button';
import { getCurrentLevel, getBasket, clearBasket } from '../utils/storage';
import { getRandomExperiment, setCurrentExperiment, getCurrentExperiment } from '../utils/gameLogic';
import { Experiment } from '../../../types';

export default function RestaurantPage() {
  const router = useRouter();
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [levelData, setLevelData] = useState<Experiment | null>(null);
  const [basket, setBasket] = useState<string[]>([]);

  useEffect(() => {
    const level = getCurrentLevel();
    
    let data = getCurrentExperiment();
    if (!data) {
      data = getRandomExperiment();
      setCurrentExperiment(data);
    }
    
    const currentBasket = getBasket();
    
    setCurrentLevel(level);
    setLevelData(data);
    setBasket(currentBasket);
  }, []);

  const handleGoToMarket = (): void => router.push('/market');
  const handleSubmitOrder = (): void => router.push('/result');
  const handleClearBasket = (): void => {
    clearBasket();
    setBasket([]);
  };
  const handleGoToMenu = (): void => router.push('/');

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
        
        {/* Header */}
        <div className="header-section" style={{
          textAlign: 'center',
          marginBottom: 'clamp(12px, 3vh, 28px)',
          flexShrink: 0,
          minHeight: 'clamp(20px, 5vh, 40px)'
        }}>
        </div>

        {/* Teacher Section */}
        <div className="teacher-section" style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(12px, 3vh, 24px)',
          maxHeight: 'calc(100vh - 140px)',
          overflow: 'hidden'
        }}>
          
          {/* Speech Bubble */}
          <div className="speech-bubble" style={{
            marginTop: '-208px',
            marginBottom: ' 62px',
            marginLeft: 'clamp(15px, 6vw, 90px)',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 'clamp(10px, 2.5vw, 24px)',
            padding: 'clamp(8px, 2vw, 24px)',
            maxWidth: 'clamp(150px, 82vw, 500px)',
            width: '60%',
            boxShadow: '0 6px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
            border: '1.5px solid rgba(33, 150, 243, 0.15)',
            backdropFilter: 'blur(8px)',
            minHeight: 'clamp(60px, 12vh, 120px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'fixed'
          }}>
            <h3 className="speech-title" style={{
              fontSize: 'clamp(20px, 1.2vw, 18px)',
              fontWeight: '600',
              color: '#2563eb',
              marginBottom: 'clamp(4px, 1vw, 12px)',
              textAlign: 'center',
              lineHeight: 1.2
            }}>
              Professor says:
            </h3>
            <p className="question-text" style={{
              fontSize: 'clamp(5px, 1.0vw, 16px)',
              color: '#1e293b',
              lineHeight: 'clamp(1.2, 1.3, 1.4)',
              textAlign: 'center',
              fontStyle: 'italic',
              margin: 0,
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              maxHeight: 'clamp(40px, 8vh, 80px)',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 'clamp(2, 3, 4)',
              WebkitBoxOrient: 'vertical'
            }}>
              "{levelData.question}"
            </p>
          </div>

          {/* Basket Display */}
          {basket.length > 0 && (
            <div className="basket-display" style={{
              borderRadius: 'clamp(10px, 2.5vw, 16px)',
              padding: 'clamp(10px, 2.5vw, 16px)',
              maxWidth: 'clamp(280px, 85vw, 500px)',
              width: '100%',
              minHeight: 'clamp(20px, 4vh, 40px)'
            }}>
            </div>
          )}
        </div>

        {/* Action Buttons */}
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
                  }}
                >
                  Clear
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
                  }}
                >
                  HOME
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        /* Fullscreen styles */
        .main-container {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          overflow: hidden !important;
        }

        * {
          box-sizing: border-box;
          user-select: none;
        }

        :global(html),
        :global(body) {
          width: 100vw !important;
          height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
      `}</style>
    </Layout>
  );
}