// pages/restaurant.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { getCurrentLevel, getBasket, clearBasket } from '../utils/storage';
import { getLevelData } from '../utils/gameLogic';

export default function RestaurantPage() {
  const router = useRouter();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelData, setLevelData] = useState(null);
  const [basket, setBasket] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false); // hidden unless triggered

  useEffect(() => {
    const level = getCurrentLevel();
    const data = getLevelData(level);
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
      <div
        className="restaurant-scene"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '20px',
        }}
      >
        {/* Background Particles */}
        <div className="floating-elements">
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              className="floating-particle"
              style={{
                position: 'absolute',
                width: `${Math.random() * 7 + 3}px`,
                height: `${Math.random() * 7 + 3}px`,
                backgroundColor: '#94a3b8',
                borderRadius: '50%',
                opacity: 0.2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 8 + 5}s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div
          className="header"
          style={{
            textAlign: 'center',
            marginBottom: '32px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '20px',
            padding: '16px 32px',
          }}
        >
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#1e293b',
              marginBottom: '8px',
            }}
          >
            Restaurant – Level {currentLevel}
          </h1>
          <div
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#fbbf24',
            }}
          >
            Difficulty: {'⭐'.repeat(currentLevel)}
          </div>
        </div>

        {/* Customer Section */}
        <div
          className="customer-section fade-in"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '1',
            marginBottom: '32px',
          }}
        >
          {/* OUTER GRADIENT CARD */}
          <div
            className="card"
            style={{ width: '100%', maxWidth: '600px', borderRadius: '25px' }}
          >
            {/* INNER WHITE CARD */}
            <div
              className="card2"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '25px',
                padding: '32px',
                maxWidth: '600px',
                border: '4px solid #6366f1',
                position: 'relative',
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  position: 'absolute',
                  left: '32px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '50px',
                }}
              >
                👨‍🍳
              </div>

              {/* Speech Bubble */}
              <div
                style={{
                  marginLeft: '100px',
                  background: '#ffffff',
                  borderRadius: '15px',
                  padding: '20px',
                  border: '2px solid #64748b',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: '-10px',
                    top: '20px',
                    width: 0,
                    height: 0,
                    borderTop: '10px solid transparent',
                    borderBottom: '10px solid transparent',
                    borderRight: '10px solid #64748b',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: '-8px',
                    top: '21px',
                    width: 0,
                    height: 0,
                    borderTop: '9px solid transparent',
                    borderBottom: '9px solid transparent',
                    borderRight: '9px solid #ffffff',
                  }}
                />
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '800',
                    color: '#1e293b',
                    marginBottom: '8px',
                  }}
                >
                  Customer says:
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#f87171',
                    fontStyle: 'italic',
                  }}
                >
                  "{levelData.request}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Basket Display */}
        {basket.length > 0 && (
          <div
            className="basket-display slide-in"
            style={{
              textAlign: 'center',
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              borderRadius: '20px',
              padding: '16px 32px',
              color: '#ffffff',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
              🛒 Your Basket:
            </h3>
            <p style={{ fontSize: '16px', fontWeight: '600' }}>
              {basket.join(', ')}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div
          className="action-buttons"
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {basket.length === 0 ? (
            <>
              {/* GO TO MARKET button */}
              <button
                className="go-to-market-custom"
                onClick={handleGoToMarket}
                type="button"
              >
                <span className="hover-underline-animation">GO TO MARKET</span>
                <svg
                  id="arrow-horizontal"
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="10"
                  viewBox="0 0 46 16"
                >
                  <path
                    d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
                    transform="translate(30)"
                  ></path>
                </svg>
              </button>

              {/* MENU button (now styled identically to GO TO MARKET) */}
              <button
                className="menu-button-custom"
                onClick={handleGoToMenu}
                type="button"
              >
                <span className="hover-underline-animation">MENU</span>
                {/* <svg
                  viewBox="0 0 175 80"
                  width="30"
                  height="10"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                  <rect y="30" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                  <rect y="60" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                </svg> */}
              </button>
            </>
          ) : (
            <>
              <Button variant="primary" onClick={handleSubmitOrder}>
                ✓ SUBMIT ({basket.length})
              </Button>
              <Button variant="success" onClick={handleGoToMarket}>
                + ADD MORE
              </Button>
              <Button variant="danger" onClick={handleClearBasket}>
                Clear
              </Button>

              {/* MENU button (same style as GO TO MARKET) */}
              <button
                className="menu-button-custom"
                onClick={handleGoToMenu}
                type="button"
              >
                <span className="hover-underline-animation">MENU</span>
                {/* <svg
                  viewBox="0 0 175 80"
                  width="30"
                  height="10"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                  <rect y="30" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                  <rect y="60" width="80" height="15" fill="#f0f0f0" rx="10"></rect>
                </svg> */}
              </button>
            </>
          )}
        </div>

        {/* Instructions overlay (hidden unless triggered) */}
        {showInstructions && (
          <div
            className="instructions-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2000,
            }}
            onClick={() => setShowInstructions(false)}
          >
            <div
              className="instructions-panel"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '32px',
                maxWidth: '600px',
                maxHeight: '80vh',
                overflow: 'auto',
                margin: '20px',
                border: '3px solid #6366f1',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* content unchanged */}
            </div>
          </div>
        )}
      </div>

      {/* keyframes + custom button styles */}
      <style jsx>{`
        /* Float animation for background particles */
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-30px);
          }
        }

        /* ---------- Tiagoadag Card Styles ---------- */
        .card {
          width: 100%;
          max-width: 600px;
          height: auto;
          background-image: linear-gradient(163deg, #00ff75 0%, #3700ff 100%);
          border-radius: 25px;
          transition: all 0.3s;
        }
        .card:hover {
          box-shadow: 0 0 30px 1px rgba(0, 255, 117, 0.3);
        }
        .card2 {
          width: 100%;
          height: auto;
          background-color: #ffffff;
          border-radius: 25px;
          transition: all 0.2s;
        }
        .card2:hover {
          transform: scale(0.98);
          border-radius: 25px;
        }
          .menu-button-custom{
          font-size:20px;
          }

        /* ---------- Unified Button Styles (GO TO MARKET & MENU) ---------- */
        .go-to-market-custom,
        .menu-button-custom {
          width: 150px;
          height: 50px;
          background-color: #ffffff;
          margin: 20px;
          color: #568fa6;
          position: relative;
          overflow: hidden;
          font-size: 14px;
          letter-spacing: 1px;
          font-weight: 500;
          text-transform: uppercase;
          transition: all 0.3s ease;
          cursor: pointer;
          border: 0;
          border-bottom: 3px solid #4c6bff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 3px;
        }
        .go-to-market-custom svg,
        .menu-button-custom svg {
        color: #4c6bff;
          transform: translateX(-8px);
          transition: all 0.3s ease;
        }
        .go-to-market-custom:hover svg,
        .menu-button-custom:hover svg {
          transform: translateX(0);
        }
        .go-to-market-custom:active svg,
        .menu-button-custom:active svg {
          transform: scale(0.9);
        }
        .go-to-market-custom span,
        .menu-button-custom span {
          padding-bottom: 7px;
          letter-spacing: 4px;
          font-size: 14px;
          padding-right: 15px;
          text-transform: uppercase;
        }

        /* Hover underline animation */
        // .hover-underline-animation {
        //   position: relative;
        //   color: #000000;
        //   padding-bottom: 20px;
        // }
        // .hover-underline-animation:after {
        //   content: '';
        //   position: absolute;
        //   width: 100%;
        //   transform: scaleX(0);
        //   height: 2px;
        //   bottom: 0;
        //   left: 0;
        //   background-color: #000000;
        //   transform-origin: bottom right;
        //   transition: transform 0.25s ease-out;
        // }
        .go-to-market-custom:hover .hover-underline-animation:after,
        .menu-button-custom:hover .hover-underline-animation:after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }

        /* ---------- Additional Responsive & Misc Styles ---------- */
        @media (max-width: 500px) {
          .go-to-market-custom,
          .menu-button-custom {
            width: 130px;
            height: 48px;
            margin: 12px;
          }
        }
      `}</style>
    </Layout>
  );
}
