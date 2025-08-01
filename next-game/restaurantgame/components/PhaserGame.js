import { useEffect, useRef } from 'react'

const PhaserGame = ({ sceneName }) => {
  const gameRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let game = null

    const initGame = async () => {
      try {
        console.log('Starting Phaser initialization...')
        
        // Enhanced Phaser import with fallback
        let Phaser
        try {
          Phaser = (await import('phaser')).default
        } catch (error) {
          console.error('Failed to import Phaser:', error)
          // Fallback to CDN version
          if (window.Phaser) {
            Phaser = window.Phaser
          } else {
            throw new Error('Phaser not available')
          }
        }
        
        console.log('Phaser imported successfully')

        // Enhanced scene imports with individual error handling
        let MenuScene, RestaurantScene, MarketScene, ResultScene
        
        try {
          const menuImport = await import('../phaser/scenes/MenuScene')
          MenuScene = menuImport.MenuScene
          console.log('MenuScene imported successfully')
        } catch (error) {
          console.error('Failed to import MenuScene:', error)
          throw error
        }

        try {
          const restaurantImport = await import('../phaser/scenes/RestaurantScene')
          RestaurantScene = restaurantImport.RestaurantScene
          console.log('RestaurantScene imported successfully')
        } catch (error) {
          console.error('Failed to import RestaurantScene:', error)
          throw error
        }

        try {
          const marketImport = await import('../phaser/scenes/MarketScene')
          MarketScene = marketImport.MarketScene
          console.log('MarketScene imported successfully')
        } catch (error) {
          console.error('Failed to import MarketScene:', error)
          throw error
        }

        try {
          const resultImport = await import('../phaser/scenes/ResultScene')
          ResultScene = resultImport.ResultScene
          console.log('ResultScene imported successfully')
        } catch (error) {
          console.error('Failed to import ResultScene:', error)
          throw error
        }

        // Verify all scenes are valid classes
        const scenes = [MenuScene, RestaurantScene, MarketScene, ResultScene]
        scenes.forEach((Scene, index) => {
          if (!Scene || typeof Scene !== 'function') {
            throw new Error(`Scene ${index} is not a valid class`)
          }
        })

        console.log('All scenes validated successfully')

        const config = {
          type: Phaser.AUTO,
          width: 900,
          height: 650,
          parent: containerRef.current,
          backgroundColor: '#f8fafc',
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            expandParent: false,
            fullscreenTarget: false,
            min: { width: 320, height: 240 },
            max: { width: 1200, height: 800 }
          },
          scene: scenes,
          input: {
            touch: true,
            mouse: true,
            activePointers: 3,
            smoothFactor: 0.2
          },
          physics: {
            default: 'arcade',
            arcade: { gravity: { y: 0 }, debug: false }
          },
          render: {
            antialias: true,
            pixelArt: false,
            roundPixels: true
          },
          fps: {
            target: 60,
            forceSetTimeOut: true
          }
        }

        console.log('Creating Phaser game with config:', config)
        game = new Phaser.Game(config)
        gameRef.current = game

        // Enhanced navigation with scene key mapping
        window.navigateToScene = (sceneName) => {
          console.log(`Navigation requested to: ${sceneName}`)
          
          const sceneKeyMap = {
            'menu': 'MenuScene',
            'MenuScene': 'MenuScene',
            'restaurant': 'RestaurantScene', 
            'RestaurantScene': 'RestaurantScene',
            'market': 'MarketScene',
            'MarketScene': 'MarketScene',
            'result': 'ResultScene',
            'ResultScene': 'ResultScene'
          }
          
          const targetScene = sceneKeyMap[sceneName] || sceneName
          
          if (game && game.scene) {
            try {
              console.log(`Starting scene: ${targetScene}`)
              game.scene.start(targetScene)
            } catch (error) {
              console.error(`Failed to start scene ${targetScene}:`, error)
            }
          } else {
            console.error('Game or scene manager not available')
          }
        }

        game.events.once('ready', () => {
          console.log('Phaser game ready!')
          
          // List all available scenes
          console.log('Available scenes:', game.scene.scenes.map(s => s.scene.key))
          
          if (sceneName && sceneName !== 'MenuScene') {
            setTimeout(() => {
              window.navigateToScene(sceneName)
            }, 100)
          }
        })

        const handleResize = () => {
          if (game && game.scale) {
            game.scale.refresh()
          }
        }

        window.addEventListener('resize', handleResize)
        window.addEventListener('orientationchange', handleResize)

        return () => {
          window.removeEventListener('resize', handleResize)
          window.removeEventListener('orientationchange', handleResize)
        }

      } catch (error) {
        console.error('Critical error initializing Phaser game:', error)
        console.error('Error stack:', error.stack)
        
        // Display error to user
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div style="padding: 20px; color: red; background: #ffe6e6; border: 1px solid red; border-radius: 5px;">
              <h3>Game Loading Error</h3>
              <p>Failed to initialize game: ${error.message}</p>
              <p>Check console for more details.</p>
            </div>
          `
        }
      }
    }

    initGame()

    return () => {
      if (gameRef.current) {
        try {
          gameRef.current.destroy(true)
          gameRef.current = null
        } catch (error) {
          console.warn('Error destroying game:', error)
        }
      }
      
      if (typeof window !== 'undefined') {
        delete window.navigateToScene
      }
    }
  }, [sceneName])

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#f8fafc'
      }} 
    />
  )
}

export default PhaserGame
