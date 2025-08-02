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
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const level = getCurrentLevel();
    const data = getLevelData(level);
    const currentBasket = getBasket();

    setCurrentLevel(level);
    setLevelData(data);
    setBasket(currentBasket);
  }, []);

  const handleGoToMarket = () => {
    router.push('/market');
  };

  const handleSubmitOrder = () => {
    router.push('/result');
  };

  const handleClearBasket = () => {
    clearBasket();
    setBasket([]);
  };

  const handleGoToMenu = () => {
    router.push('/');
  };

  if (!levelData) return null;

  return (
    <Layout scene="restaurant">
      <div className="restaurant-scene" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '20px'
      }}>
        {/* Background Effects */}
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
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="header" style={{
          textAlign: 'center',
          marginBottom: '32px',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '20px',
          padding: '16px 32px'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            color: '#1e293b',
            marginBottom: '8px'
          }}>
            Restaurant - Level {currentLevel}
          </h1>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#fbbf24'
          }}>
            Difficulty: {'⭐'.repeat(currentLevel)}
          </div>
        </div>

        {/* Customer Section */}
        <div className="customer-section fade-in" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '1',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '25px',
            padding: '32px',
            maxWidth: '600px',
            border: '4px solid #6366f1',
            position: 'relative',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)'
          }}>
            {/* Customer Avatar */}
            <div style={{
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
              fontSize: '50px'
            }}>
              👨‍🍳
            </div>

            {/* Speech Bubble */}
            <div style={{
              marginLeft: '100px',
              background: '#ffffff',
              borderRadius: '15px',
              padding: '20px',
              border: '2px solid #64748b',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                left: '-10px',
                top: '20px',
                width: '0',
                height: '0',
                borderTop: '10px solid transparent',
                borderBottom: '10px solid transparent',
                borderRight: '10px solid #64748b'
              }} />
              <div style={{
                position: 'absolute',
                left: '-8px',
                top: '21px',
                width: '0',
                height: '0',
                borderTop: '9px solid transparent',
                borderBottom: '9px solid transparent',
                borderRight: '9px solid #ffffff'
              }} />

              <h3 style={{
                fontSize: '16px',
                fontWeight: '800',
                color: '#1e293b',
                marginBottom: '8px'
              }}>
                Customer says:
              </h3>
              <p style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#f87171',
                fontStyle: 'italic'
              }}>
                "{levelData.request}"
              </p>
            </div>
          </div>
        </div>

        {/* Basket Display */}
        {basket.length > 0 && (
          <div className="basket-display slide-in" style={{
            textAlign: 'center',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
            borderRadius: '20px',
            padding: '16px 32px',
            color: '#ffffff'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
              🛒 Your Basket:
            </h3>
            <p style={{ fontSize: '16px', fontWeight: '600' }}>
              {basket.join(', ')}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons" style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {basket.length === 0 ? (
            <>
              <Button variant="primary" size="large" onClick={handleGoToMarket}>
                🏪 GO TO MARKET
              </Button>
              <Button variant="secondary" onClick={handleGoToMenu}>
                Menu
              </Button>
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
              <Button variant="secondary" onClick={handleGoToMenu}>
                Menu
              </Button>
            </>
          )}
        </div>

        {/* How to Play Button */}
        <div style={{ position: 'absolute', bottom: '140px', left: '20px' }}>
          <Button 
            variant="secondary" 
            size="small" 
            onClick={() => setShowInstructions(true)}
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
                📖 How to Play Restaurant Master
              </h3>
              
              <div style={{ color: '#475569', lineHeight: '1.8' }}>
                <p><strong>🎯 Welcome to Restaurant Master!</strong></p>
                <br />
                <p><strong>1.</strong> Read the customer's order carefully</p>
                <p><strong>2.</strong> Click "GO TO MARKET" to collect ingredients</p>
                <p><strong>3.</strong> Drag items to your basket or tap to add them</p>
                <p><strong>4.</strong> Return here and click "SUBMIT" when ready</p>
                <p><strong>5.</strong> Get all ingredients correct to advance!</p>
                <br />
                <p><strong>💡 Tips:</strong></p>
                <p>• You can view your basket anytime in the market</p>
                <p>• Use "ADD MORE" to get additional ingredients</p>
                <p>• Each level gets more challenging!</p>
              </div>

              <Button 
                variant="danger" 
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
          100% { transform: translateY(-30px); }
        }
      `}</style>
    </Layout>
  );
}
