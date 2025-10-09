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
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: 'clamp(16px, 4vw, 32px)',
        zIndex: 1
      }}>
        
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'clamp(16px, 4vh, 32px)',
          flexShrink: 0
        }}>
          {/* <h1 style={{
            fontSize: 'clamp(20px, 5vw, 32px)',
            fontWeight: '700',
            color: '#1e293b',
            background: 'linear-gradient(135deg, #080b00ff 0%, #090909ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            lineHeight: '1.2',
            textShadow: '0 2px 4px rgba(255,255,255,0.8)'
          }}>
            Lab
          </h1> */}
    
        </div>

        {/* Teacher Section */}
        <div style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(16px, 4vh, 32px)'
        }}>
          
          {/* Teacher Avatar */}
          {/* <div style={{
            fontSize: 'clamp(60px, 12vw, 120px)',
            animation: 'bounce 2s ease-in-out infinite'
          }}>
            👨‍🔬
          </div> */}

          {/* Speech Bubble */}
          <div style={{
            marginTop:'-220px',
            marginLeft:'90px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 'clamp(16px, 4vw, 24px)',
            padding: 'clamp(16px, 4vw, 24px)',
            maxWidth: 'min(90vw, 600px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '2px solid rgba(33, 150, 243, 0.2)'
          }}>
            <h3 style={{
              fontSize: 'clamp(14px, 3vw, 18px)',
              fontWeight: '600',
              color: '#2563eb',
              marginBottom: 'clamp(8px, 2vw, 12px)',
              textAlign: 'center'
            }}>
              Professor says:
            </h3>
            <p style={{
              fontSize: 'clamp(12px, 2.5vw, 16px)',
              color: '#1e293b',
              lineHeight: '1.5',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              "{levelData.question}"
            </p>
          </div>

          {/* Basket Display */}
          {basket.length > 0 && (
            <div style={{
              // background: 'rgba(232, 245, 233, 0.9)',
              borderRadius: 'clamp(12px, 3vw, 16px)',
              padding: 'clamp(12px, 3vw, 16px)',
              maxWidth: 'min(90vw, 500px)',
              // border: '2px solid rgba(76, 175, 80, 0.3)'
            }}>
              
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 'clamp(12px, 3vw, 16px)',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginBottom: '45px'
        }}>
          {basket.length === 0 ? (
            <>
              <Button
                variant="primary"
                onClick={handleGoToMarket}
                style={{
                  fontSize: 'clamp(12px, 2.5vw, 16px)',
                  // padding: 'clamp(12px, 3vw, 16px) clamp(24px, 6vw, 32px)',
                  minWidth: 'clamp(150px, 30vw, 200px)'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor" className="icon">
            <circle r={1} cy={21} cx={9} />
            <circle r={1} cy={21} cx={20} />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg> GO TO LAB STORE
              </Button>
              <Button
                variant="secondary"
                onClick={handleGoToMenu}
                style={{
                  fontSize: 'clamp(13px, 3vw, 18px)',
                  // padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024" strokeWidth={0} fill="currentColor" stroke="currentColor" className="icon">
            <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z" />
          </svg> HOME
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                onClick={handleSubmitOrder}
                style={{
                  fontSize: 'clamp(12px, 2.5vw, 16px)',
                  // padding: 'clamp(12px, 3vw, 16px) clamp(24px, 6vw, 32px)',
                  minWidth: 'clamp(150px, 30vw, 200px)'
                }}
              >
                <svg className="w-[48px] h-[48px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M5 11.917 9.724 16.5 19 7.5"/>
</svg>
 SUBMIT EQUIPMENT ({basket.length})
              </Button>
              <div style={{
                display: 'flex',
                gap: 'clamp(8px, 2vw, 12px)',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                <Button
                  variant="secondary"
                  onClick={handleGoToMarket}
                  style={{
                    fontSize: 'clamp(13px, 3vw, 18px)',
                    // minWidth: 'clamp(150px, 30vw, 200px)'
                    // padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)'
                  }}
                >
                 + ADD MORE
                </Button>
                <Button
                  variant="danger"
                  onClick={handleClearBasket}
                  style={{
                    fontSize: 'clamp(13px, 3vw, 18px)',
                    // padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)'
                  }}
                >
                <svg className="w-[48px] h-[48px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fillRule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clipRule="evenodd"/>
</svg>
 Clear
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleGoToMenu}
                  style={{
                    fontSize: 'clamp(13px, 3vw, 18px)',
                    // padding: 'clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)'
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024" strokeWidth={0} fill="currentColor" stroke="currentColor" className="icon">
            <path d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z" />
          </svg> HOME
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
