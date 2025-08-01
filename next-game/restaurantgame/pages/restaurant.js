import { useEffect } from 'react'
import { useRouter } from 'next/router'
import PhaserGame from '../components/PhaserGame'

export default function RestaurantPage() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.navigateToScene = function(scene) {
        switch(scene) {
          case 'menu':
            router.push('/')
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
    <div id="game-container">
      <div id="game-canvas">
        <PhaserGame sceneName="RestaurantScene" />
      </div>
      
      <div id="ui-overlay">
        <div className="ui-panel ui-panel-top-left">
          <div className="ui-icon">
            <i className="fas fa-trophy"></i>
          </div>
          <div className="ui-content">
            <div className="ui-label">Level</div>
            <div className="ui-value" id="current-level">1</div>
          </div>
        </div>
        
        <div className="ui-panel ui-panel-top-right">
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
  )
}
