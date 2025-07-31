// Fixed game configuration to prevent auto-zoom
const config = {
    type: Phaser.AUTO,
    width: 900,
    height: 650,
    parent: 'game-canvas',
    backgroundColor: '#1f2937',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        // CRITICAL FIX: Prevent auto-zoom behavior
        zoom: 1,
        expandParent: false,
        fullscreenTarget: false,
        min: {
            width: 320,
            height: 240
        },
        max: {
            width: 1200,
            height: 800
        }
    },
    scene: [MenuScene, RestaurantScene, MarketScene, ResultScene],
    input: {
        touch: true,
        mouse: true,
        activePointers: 3,
        smoothFactor: 0.2
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
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
};

// Initialize the game
const game = new Phaser.Game(config);

// Enhanced loading but without anime.js
function initializeEnhancedLoading() {
    console.log('Initializing enhanced loading...');
    const progressBar = document.querySelector('.loading-progress');
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 12 + 3;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            setTimeout(() => {
                hideLoadingScreen();
            }, 500);
        }
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }, 120);
}

// Enhanced loading screen hide with CSS animations
function hideLoadingScreen() {
    console.log('Hiding loading screen...');
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.transition = 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transform = 'scale(0.9)';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 1200);
    }
}

// FIXED: Enhanced global UI updates with consistent data types
window.updateGameUI = function() {
    const level = parseInt(localStorage.getItem('restaurant-level') || '1');
    const basket = JSON.parse(sessionStorage.getItem('basket') || '[]');
    
    const levelElement = document.getElementById('current-level');
    const basketElement = document.getElementById('basket-count');
    
    if (levelElement) {
        levelElement.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        levelElement.textContent = level;
        levelElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            levelElement.style.transform = 'scale(1)';
        }, 300);
    }
    
    if (basketElement) {
        basketElement.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        // FIXED: Always use .length for consistency
        basketElement.textContent = Array.isArray(basket) ? basket.length : 0;
        basketElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            basketElement.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Enhanced UI panel pulse effect
    const panels = document.querySelectorAll('.ui-panel');
    panels.forEach(panel => {
        panel.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        panel.style.transform = 'scale(1.05)';
        setTimeout(() => {
            panel.style.transform = 'scale(1)';
        }, 400);
    });
};

// CRITICAL FIX: Enhanced resize handling to prevent zoom issues
window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        // Prevent zoom by forcing scale settings
        if (game && game.scale) {
            game.scale.zoom = 1;
            if (game.scale.setZoom) {
                game.scale.setZoom(1);
            }
            game.scale.refresh();
        }
    }, 250);
});

window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        // Prevent zoom on orientation change
        if (game && game.scale) {
            game.scale.zoom = 1;
            if (game.scale.setZoom) {
                game.scale.setZoom(1);
            }
            game.scale.refresh();
        }
    }, 500);
});

// Prevent context menu
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// FIXED: Safer touch event handling that doesn't interfere with Phaser
window.addEventListener('touchstart', (e) => {
    // Only prevent default for non-game elements
    if (!e.target.closest('#game-canvas')) {
        e.preventDefault();
    }
}, { passive: false });

window.addEventListener('touchmove', (e) => {
    // Only prevent default for non-game elements
    if (!e.target.closest('#game-canvas')) {
        e.preventDefault();
    }
}, { passive: false });

// CRITICAL FIX: Prevent pinch-to-zoom on mobile without breaking game
window.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) {
        // Force zoom back to 1 if changed
        if (game && game.scale) {
            game.scale.zoom = 1;
            if (game.scale.setZoom) {
                game.scale.setZoom(1);
            }
        }
    }
}, { passive: false });

// FIXED: Enhanced performance settings with proper check
if (window.devicePixelRatio) {  // Fixed casing from DevicePixelRatio
    document.addEventListener('DOMContentLoaded', () => {
        if (game && game.canvas) {
            game.canvas.style.imageRendering = 'auto';
        }
    });
}

// Enhanced DOM ready handling
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Starting enhanced initialization');
    
    // Enhanced UI panel entrance animation
    const panels = document.querySelectorAll('.ui-panel');
    panels.forEach((panel, index) => {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(-20px)';
        panel.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
        }, index * 200 + 200);
    });
    
    // Start loading
    setTimeout(() => {
        initializeEnhancedLoading();
    }, 1000);
});

// Game ready event
game.events.once('ready', () => {
    console.log('🍽️ Restaurant Game - Professional Edition Ready!');
    if (game.input) {
        game.input.mouse.disableContextMenu();
        game.input.touch.capture = true;
    }
    
    // CRITICAL FIX: Force initial zoom to 1
    if (game.scale) {
        game.scale.zoom = 1;
        if (game.scale.setZoom) {
            game.scale.setZoom(1);
        }
    }
});

// Enhanced error handling
window.addEventListener('error', (e) => {
    console.error('Game Error:', e.error);
    // Hide loading screen on error
    hideLoadingScreen();
});

// Visibility change handling
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (game.scene.isActive('MarketScene')) {
            const marketScene = game.scene.getScene('MarketScene');
            if (marketScene && marketScene.isDragging) {
                marketScene.isDragging = false;
                marketScene.draggedItem = null;
            }
        }
    }
});

console.log('🍽️ Restaurant Game - Enhanced Professional Edition Loaded');
