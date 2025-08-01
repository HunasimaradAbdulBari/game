import { useEffect } from 'react'
import { useRouter } from 'next/router'
import PhaserGame from '../components/PhaserGame'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Initialize game UI updates
    if (typeof window !== 'undefined') {
      window.updateGameUI = function() {
        const level = parseInt(localStorage.getItem('restaurant-level') || '1')
        const basket = JSON.parse(sessionStorage.getItem('basket') || '[]')
        
        const levelElement = document.getElementById('current-level')
        const basketElement = document.getElementById('basket-count')
        
        if (levelElement) {
          levelElement.textContent = level
        }
        
        if (basketElement) {
          basketElement.textContent = Array.isArray(basket) ? basket.length : 0
        }
      }

      // Navigation helpers
      window.navigateToScene = function(scene) {
        switch(scene) {
          case 'restaurant':
            router.push('/restaurant')
            break
          case 'market':
            router.push('/market')
            break
          case 'result':
            router.push('/result')
            break
          default:
            router.push('/')
        }
      }
    }
  }, [router])

  return (
    <>
      <div id="loading-screen">
        <div className="loading-content">
          <div className="loading-logo">
            <i className="fas fa-utensils" style={{fontSize: '60px', color: '#3b82f6'}}></i>
          </div>
          <div className="loading-text">Restaurant Master</div>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
          <div className="loading-status">Loading your culinary adventure...</div>
        </div>
      </div>

      <div id="game-container" className="fade-in">
        <div id="game-canvas">
          <PhaserGame sceneName="MenuScene" />
        </div>
        
        <div id="ui-overlay">
          <div className="ui-panel ui-panel-top-left slide-in-left">
            <div className="ui-icon">
              <i className="fas fa-trophy"></i>
            </div>
            <div className="ui-content">
              <div className="ui-label">Level</div>
              <div className="ui-value" id="current-level">1</div>
            </div>
          </div>
          
          <div className="ui-panel ui-panel-top-right slide-in-right">
            <div className="ui-icon">
              <i className="fas fa-shopping-basket"></i>
            </div>
            <div className="ui-content">
              <div className="ui-label">Items</div>
              <div className="ui-value" id="basket-count">0</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
