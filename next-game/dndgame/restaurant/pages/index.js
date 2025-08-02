import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
    <Layout scene="menu">
      <div className="menu-scene" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '20px',
        textAlign: 'center'
      }}>
        {/* Background Effects */}
        <div className="floating-elements">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="floating-particle"
              style={{
                position: 'absolute',
                width: `${Math.random() * 8 + 3}px`,
                height: `${Math.random() * 8 + 3}px`,
                backgroundColor: '#94a3b8',
                borderRadius: '50%',
                opacity: 0.2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 8 + 4}s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Title */}
        <div className="title-section slide-in" style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '800',
            color: '#1e293b',
            marginBottom: '16px',
            textShadow: '0 2px 4px rgba(203, 213, 225, 0.8)'
          }}>
            Restaurant Master
          </h1>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#475569'
          }}>
            Select Your Level
          </h2>
        </div>

        {/* Level Selector */}
        <div className="level-selector-container fade-in" style={{ marginBottom: '40px' }}>
          <LevelSelector onLevelSelect={handleLevelSelect} />
        </div>

        {/* Bottom Buttons */}
        <div className="bottom-buttons" style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <Button variant="danger" onClick={handleResetProgress}>
            Reset Progress
          </Button>
          <Button variant="secondary" onClick={handleShowInstructions}
          
          //  style={{ marginTop: '-34px', width: '100%' }}
          >
            How to Play
          </Button>
        </div>

        {/* Instructions Modal */}
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
              zIndex: 2000
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
                border: '3px solid #6366f1'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ 
                color: '#1e293b', 
                marginBottom: '20px',
                fontSize: '20px',
                fontWeight: '800'
              }}>
                🎯 HOW TO PLAY RESTAURANT MASTER
              </h3>
              
              <div style={{ color: '#475569', lineHeight: '1.6' }}>
                <p><strong>1.</strong> Read the customer's request carefully</p>
                <p><strong>2.</strong> Go to the market and collect the right ingredients</p>
                <p><strong>3.</strong> Drag items to your basket or tap to add them</p>
                <p><strong>4.</strong> Submit your order to complete the level</p>
                <p><strong>5.</strong> Get all ingredients correct to unlock the next level!</p>
              </div>

              <Button 
                variant="primary" 
                onClick={() => setShowInstructions(false)}
                style={{ marginTop: '24px', width: '100%' }}
              >
                GOT IT!
              </Button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-20px); }
        }
      `}</style>
    </Layout>
  );
}
