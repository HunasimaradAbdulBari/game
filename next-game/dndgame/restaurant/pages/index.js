// pages/index.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// REMOVED: import BackgroundAnimation from '../components/BackgroundAnimation';
import Layout from '../components/Layout';
import LevelSelector from '../components/LevelSelector';
import Button from '../components/Button';
import { resetProgress, getCurrentLevel } from '../utils/storage';

export default function MenuPage() {
  const router = useRouter();
  const [showInstructions, setShowInstructions] = useState(false);

  const handleLevelSelect = (level) => {
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
    // REMOVED: <BackgroundAnimation /> - Layout already includes it
    <Layout scene="menu">
      <div className="menu-scene">
        {/* Floating Elements */}
        <div className="floating-elements">
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              className="floating-particle"
              style={{
                position: 'absolute',
                width: `${Math.random() * 6 + 3}px`,
                height: `${Math.random() * 6 + 3}px`,
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                borderRadius: '50%',
                opacity: Math.random() * 0.3 + 0.1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 8 + 6}s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * 4}s`,
                pointerEvents: 'none'
              }}
            />
          ))}
        </div>

        {/* Title Section */}
        <div className="title-section fade-in">
          <h1>Restaurant Master</h1>
          <h2>Select Your Level</h2>
        </div>

        {/* Level Selector */}
        <div className="level-selector-container slide-in">
          <LevelSelector onLevelSelect={handleLevelSelect} />
        </div>

        {/* Bottom Buttons */}
        <div className="bottom-buttons fade-in">
          <Button
            variant="danger"
            onClick={handleResetProgress}
            className="reset-button"
          >
            <svg 
              className="button-icon" 
              aria-hidden="true" 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke="currentColor" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"
              />
            </svg>
            Reset Game
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleShowInstructions}
            className="instructions-button"
          >
            <svg 
              className="button-icon" 
              aria-hidden="true" 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                fillRule="evenodd" 
                d="M11 4.717c-2.286-.58-4.16-.756-7.045-.71A1.99 1.99 0 0 0 2 6v11c0 1.133.934 2.022 2.044 2.007 2.759-.038 4.5.16 6.956.791V4.717Zm2 15.081c2.456-.631 4.198-.829 6.956-.791A2.013 2.013 0 0 0 22 16.999V6a1.99 1.99 0 0 0-1.955-1.993c-2.885-.046-4.76.13-7.045.71v15.081Z" 
                clipRule="evenodd"
              />
            </svg>
            How to Play
          </Button>
        </div>

        {/* Instructions Modal */}
        {showInstructions && (
          <div
            className="instructions-overlay"
            onClick={() => setShowInstructions(false)}
          >
            <div
              className="instructions-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>🎯 HOW TO PLAY RESTAURANT MASTER</h3>
              <div className="instructions-content">
                <p>1. Read the customer's request carefully</p>
                <p>2. Go to the market and collect the right ingredients</p>
                <p>3. Drag items to your basket or tap to add them</p>
                <p>4. Submit your order to complete the level</p>
                <p>5. Get all ingredients correct to unlock the next level!</p>
              </div>
              
              <Button
                variant="primary"
                onClick={() => setShowInstructions(false)}
                className="got-it-button"
              >
                GOT IT!
              </Button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .menu-scene {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          position: relative;
          gap: clamp(20px, 4vw, 32px);
          padding: clamp(16px, 3vw, 24px);
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .title-section {
          flex-shrink: 0;
          margin-bottom: clamp(16px, 3vw, 24px);
        }

        .title-section h1 {
          font-size: clamp(36px, 8vw, 64px);
          font-weight: 800;
          color: #0d47a1;
          margin-bottom: clamp(8px, 2vw, 16px);
          text-shadow: 0 2px 4px rgba(33, 150, 243, 0.1);
          background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .title-section h2 {
          font-size: clamp(18px, 4vw, 28px);
          font-weight: 600;
          color: #1565c0;
          opacity: 0.9;
        }

        .level-selector-container {
          flex-shrink: 0;
          margin: clamp(16px, 3vw, 24px) 0;
        }

        .bottom-buttons {
          display: flex;
          gap: clamp(12px, 3vw, 20px);
          flex-wrap: wrap;
          justify-content: center;
          flex-shrink: 0;
        }

        .button-icon {
          width: 20px;
          height: 20px;
          margin-right: 8px;
          color: currentColor;
        }

        .instructions-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(13, 71, 161, 0.1);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.3s ease forwards;
          padding: clamp(12px, 3vw, 24px);
        }

        .instructions-panel {
          background: linear-gradient(135deg, #ffffff 0%, #f8fdff 100%);
          border-radius: clamp(16px, 3vw, 24px);
          padding: clamp(24px, 5vw, 40px);
          max-width: min(90vw, 600px);
          max-height: 80vh;
          overflow: auto;
          border: 2px solid rgba(33, 150, 243, 0.1);
          box-shadow: 0 20px 60px rgba(33, 150, 243, 0.15);
          animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          text-align: left;
        }

        .instructions-panel h3 {
          font-size: clamp(20px, 4vw, 28px);
          font-weight: 700;
          color: #0d47a1;
          margin-bottom: 20px;
          text-align: center;
        }

        .instructions-content p {
          font-size: clamp(14px, 2.5vw, 18px);
          font-weight: 500;
          color: #1565c0;
          margin-bottom: 12px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(33, 150, 243, 0.1);
        }

        .instructions-content p:last-child {
          border-bottom: none;
          margin-bottom: 24px;
        }

        .got-it-button {
          width: 100%;
          margin-top: 16px;
        }

        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          100% { transform: translateY(-20px) translateX(10px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .bottom-buttons {
            flex-direction: column;
            align-items: center;
            width: 100%;
            max-width: 300px;
          }

          .instructions-panel {
            margin: 12px;
            padding: 20px;
          }

          .menu-scene {
            gap: 20px;
            padding: 16px;
          }

          .button-icon {
            width: 16px;
            height: 16px;
            margin-right: 6px;
          }
        }

        @media (max-width: 480px) {
          .menu-scene {
            padding: 12px;
            gap: 16px;
          }

          .button-icon {
            width: 14px;
            height: 14px;
            margin-right: 4px;
          }
        }
      `}</style>
    </Layout>
  );
}
