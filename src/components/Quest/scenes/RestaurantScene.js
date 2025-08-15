// src/app/restaurant/page.js - Science Teacher Scene (replaces pages/restaurant.js)
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../Layout';
import Button from '../../Button';
import { getCurrentLevel, getBasket, clearBasket, getCurrentSubject } from '../utils/storage';
import { getLevelData } from '../utils/gameLogic';

export default function RestaurantPage() {
  const router = useRouter();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentSubject, setCurrentSubject] = useState('physics');
  const [levelData, setLevelData] = useState(null);
  const [basket, setBasket] = useState([]);

  useEffect(() => {
    const level = getCurrentLevel();
    const subject = getCurrentSubject();
    const data = getLevelData(level, subject);
    const currentBasket = getBasket();

    setCurrentLevel(level);
    setCurrentSubject(subject);
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

  const getSubjectEmoji = (subject) => {
    const emojis = {
      physics: '⚡',
      chemistry: '🧪', 
      electronics: '💡'
    };
    return emojis[subject] || '🔬';
  };

  if (!levelData) return null;

  return (
    <Layout scene="restaurant" subject={currentSubject}>
      {/* Subject-Specific Background */}
      {currentSubject === 'physics' && (
       <img
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            objectFit: 'cover',
            zIndex: -15,
            opacity: 0.9,
          }}
           src="/phy0.png" type="img/png" />
      )}
      {currentSubject === 'chemistry' && (
        <img
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            objectFit: 'cover',
            zIndex: -15,
            border:'none',
          }}
           src="/che.png" type="img/png" />
      )}

      {currentSubject === 'electronics' && (
       <img
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            objectFit: 'cover',
            zIndex: -15,
            border:'none',
          }}
           src="/electric1.png" type="img/jpg" />
      )}

      <div
        className="restaurant-scene"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: 'clamp(12px, 2vw, 20px)',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div className="header" style={{ textAlign: 'center', marginBottom: 'clamp(16px, 3vw, 32px)', flexShrink: 0 }}>
          <div
            className="header-content"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 'clamp(12px, 3vw, 20px)',
              padding: 'clamp(12px, 2vw, 16px) clamp(16px, 4vw, 32px)',
              display: 'inline-block',
              border: '2px solid #2563eb',
              boxShadow: '0 8px 32px rgba(37, 99, 235, 0.15)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(18px, 4vw, 32px)',
                fontWeight: '800',
                color: '#1e293b',
                marginBottom: 'clamp(4px, 1vw, 8px)',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {getSubjectEmoji(currentSubject)} Science Lab – Level {currentLevel}
            </h1>
            <p
              style={{
                fontSize: 'clamp(12px, 2.5vw, 18px)',
                fontWeight: '600',
                color: '#fbbf24',
              }}
            >
              Subject: {currentSubject.charAt(0).toUpperCase() + currentSubject.slice(1)} 
              {'⭐'.repeat(currentLevel)}
            </p>
          </div>
        </div>

        {/* Teacher Section */}
        <div
          className="customer-section"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '1',
            marginBottom: 'clamp(16px, 4vw, 32px)',
          }}
        >
          <div
            className="customer-card"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 'clamp(15px, 4vw, 25px)',
              padding: 'clamp(16px, 4vw, 32px)',
              maxWidth: '600px',
              border: '4px solid #2563eb',
              position: 'relative',
              boxShadow: '0 8px 32px rgba(37, 99, 235, 0.3)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Teacher Avatar */}
            <div
              className="customer-avatar"
              style={{
                position: 'absolute',
                left: 'clamp(16px, 4vw, 32px)',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 'clamp(50px, 12vw, 70px)',
                height: 'clamp(50px, 12vw, 70px)',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'clamp(25px, 6vw, 40px)',
                boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)',
              }}
            >
              👨‍🔬
            </div>

            {/* Speech Bubble */}
            <div
              className="speech-bubble"
              style={{
                marginLeft: 'clamp(70px, 16vw, 100px)',
                background: '#ffffff',
                borderRadius: 'clamp(8px, 2vw, 15px)',
                padding: 'clamp(12px, 3vw, 20px)',
                border: '2px solid #64748b',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(100, 116, 139, 0.1)',
              }}
            >
              <div
                style={{
                  content: '""',
                  position: 'absolute',
                  left: '-10px',
                  top: '20px',
                  width: '0',
                  height: '0',
                  borderTop: '10px solid transparent',
                  borderBottom: '10px solid transparent',
                  borderRight: '10px solid #64748b',
                }}
              />
              <div
                style={{
                  content: '""',
                  position: 'absolute',
                  left: '-8px',
                  top: '21px',
                  width: '0',
                  height: '0',
                  borderTop: '9px solid transparent',
                  borderBottom: '9px solid transparent',
                  borderRight: '9px solid #ffffff',
                }}
              />

              <p
                style={{
                  fontSize: 'clamp(12px, 2.5vw, 16px)',
                  fontWeight: '800',
                  color: '#1e293b',
                  marginBottom: 'clamp(4px, 1vw, 8px)',
                }}
              >
                Professor says:
              </p>
              <p
                style={{
                  fontSize: 'clamp(11px, 2.2vw, 14px)',
                  fontWeight: '600',
                  color: '#dc2626',
                  fontStyle: 'italic',
                  lineHeight: '1.4',
                }}
              >
                "{levelData.question}"
              </p>
            </div>
          </div>
        </div>

        {/* Basket Display */}
        {basket.length > 0 && (
          <div
            className="basket-display"
            style={{
              textAlign: 'center',
              marginBottom: 'clamp(12px, 3vw, 24px)',
              flexShrink: 0,
            }}
          >
            <div
              className="basket-content"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                borderRadius: 'clamp(12px, 3vw, 20px)',
                padding: 'clamp(8px, 2vw, 16px) clamp(16px, 4vw, 32px)',
                color: '#ffffff',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3
                style={{
                  fontSize: 'clamp(14px, 3vw, 18px)',
                  fontWeight: '700',
                  marginBottom: 'clamp(4px, 1vw, 8px)',
                }}
              >
                🧰 Your Equipment Basket:
              </h3>
              <p
                style={{
                  fontSize: 'clamp(12px, 2.5vw, 16px)',
                  fontWeight: '600',
                }}
              >
                {basket.join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div
          className="action-buttons"
          style={{
            display: 'flex',
            gap: 'clamp(8px, 2vw, 16px)',
            justifyContent: 'center',
            flexWrap: 'wrap',
            flexShrink: 0,
          }}
        >
          {basket.length === 0 ? (
            <>
              <Button variant="primary" onClick={handleGoToMarket}>
                GO TO LAB STORE
              </Button>
              <Button variant="secondary" onClick={handleGoToMenu}>
                MENU
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" onClick={handleSubmitOrder}>
                ✓ SUBMIT EQUIPMENT ({basket.length})
              </Button>
              <Button variant="secondary" onClick={handleGoToMarket}>
                + ADD MORE
              </Button>
              <Button variant="secondary" onClick={handleClearBasket}>
                Clear
              </Button>
              <Button variant="secondary" onClick={handleGoToMenu}>
                MENU
              </Button>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }

        @keyframes electronics-charge {
          100% { background-size: 120% 100%; }
        }

        .loader::before {
          content: "";
          position: absolute;
          top: -2px;
          bottom: -2px;
          left: 100%;
          width: 10px;
          background: linear-gradient(#0000 calc(50% - 7px), #22f49e 0 calc(50% - 5px), #0000 0 calc(50% + 5px), #22f49e 0 calc(50% + 7px), #0000 0) left / 100% 100%,
            linear-gradient(#22f49e calc(50% - 5px), #0000 0 calc(50% + 5px), #22f49e 0) left / 2px 100%,
            linear-gradient(#0000 calc(50% - 5px), #22f49e 0 calc(50% + 5px), #0000 0) right/2px 100%;
          background-repeat: no-repeat;
        }

        @media (max-width: 768px) {
          .action-buttons {
            flex-direction: column;
            align-items: center;
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
          }

          .customer-avatar {
            position: static !important;
            transform: none !important;
            margin: 0 auto 12px auto;
          }

          .speech-bubble {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </Layout>
  );
}