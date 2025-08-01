import { AnimationManager } from './AnimationManager';

export class ResultScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ResultScene' });
    }

    create() {
        console.log('🎮 ResultScene created');
        const { width, height } = this.cameras.main;

        // Get data
        this.currentLevel = parseInt(localStorage.getItem('restaurant-level') || '1');
        this.levelData = this.getLevelData(this.currentLevel);
        this.basket = JSON.parse(sessionStorage.getItem('basket') || '[]');
        this.maxUnlockedLevel = parseInt(localStorage.getItem('max-unlocked-level') || '1');
        this.animationManager = new AnimationManager(this);

        // Check win condition
        this.isWin = this.checkWin();

        // Update progress if won
        if (this.isWin) {
            this.updateProgress();
        }

        // EMERGENCY: Setup multiple navigation methods
        this.setupEmergencyNavigation();

        // Create result screen
        this.createResultBackground(width, height);
        this.createResultContent(width, height);
        this.createActionButtons(width, height);
        this.updateUI();
    }

    setupEmergencyNavigation() {
        console.log('🆘 Setting up emergency navigation...');
        
        // Create multiple navigation functions
        this.navMethods = {
            // Method 1: Window navigation
            windowNav: (scene) => {
                if (typeof window !== 'undefined' && window.navigateToScene) {
                    console.log('📍 Using window.navigateToScene');
                    window.navigateToScene(scene);
                    return true;
                }
                return false;
            },
            
            // Method 2: Direct scene start
            sceneNav: (scene) => {
                if (this.scene && this.scene.start) {
                    console.log('📍 Using scene.start');
                    this.scene.start(scene);
                    return true;
                }
                return false;
            },
            
            // Method 3: Router navigation (Next.js)
            routerNav: (scene) => {
                if (typeof window !== 'undefined' && window.location) {
                    console.log('📍 Using window.location');
                    const routes = {
                        'menu': '/',
                        'MenuScene': '/',
                        'restaurant': '/restaurant',
                        'RestaurantScene': '/restaurant',
                        'market': '/market',
                        'MarketScene': '/market'
                    };
                    
                    const route = routes[scene] || '/';
                    window.location.href = route;
                    return true;
                }
                return false;
            },
            
            // Method 4: Page reload
            reloadNav: () => {
                console.log('📍 Using page reload');
                if (typeof window !== 'undefined') {
                    window.location.reload();
                    return true;
                }
                return false;
            }
        };
    }

    createResultBackground(width, height) {
        const bgColor1 = this.isWin ? 0x10b981 : 0xf87171;
        const bgColor2 = this.isWin ? 0x34d399 : 0xfca5a5;
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xffffff, bgColor2, bgColor1, 0xf8fafc, 1, 1, 1, 1);
        bg.fillRect(0, 0, width, height);

        if (this.isWin) {
            this.createCelebrationParticles(width, height);
        }
    }

    createCelebrationParticles(width, height) {
        for(let i = 0; i < 30; i++) {
            const particle = this.add.circle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                Phaser.Math.Between(3, 8),
                0xfbbf24,
                0.8
            );

            this.tweens.add({
                targets: particle,
                y: particle.y - Phaser.Math.Between(50, 100),
                x: particle.x + Phaser.Math.Between(-50, 50),
                alpha: 0,
                scale: 0,
                duration: Phaser.Math.Between(2000, 4000),
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    createResultContent(width, height) {
        const titleText = this.isWin ? 'LEVEL COMPLETE! 🎉' : 'TRY AGAIN! 💪';
        const title = this.add.text(width/2, height/4, titleText, {
            fontSize: '42px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '900',
            color: '#1e293b',
            stroke: '#e2e8f0',
            strokeThickness: 6
        }).setOrigin(0.5);

        title.setScale(0);
        this.tweens.add({
            targets: title,
            scaleX: 1,
            scaleY: 1,
            duration: 600,
            ease: 'Elastic.easeOut'
        });

        const levelInfo = this.add.text(width/2, height/4 + 60, `Level ${this.currentLevel}`, {
            fontSize: '24px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '700',
            color: '#475569'
        }).setOrigin(0.5);

        this.createComparisonSection(width, height);

        if (this.isWin && this.currentLevel < 3) {
            this.add.text(width/2, height/2 + 120, 'Next level unlocked!', {
                fontSize: '20px',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: '700',
                color: '#fbbf24'
            }).setOrigin(0.5);
        } else if (this.isWin && this.currentLevel === 3) {
            this.add.text(width/2, height/2 + 120, 'You are a Restaurant Master! 👑', {
                fontSize: '22px',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: '800',
                color: '#fbbf24'
            }).setOrigin(0.5);
        }
    }

    createComparisonSection(width, height) {
        const centerY = height/2;

        const requiredBg = this.add.graphics();
        requiredBg.fillStyle(0xffffff, 0.95);
        requiredBg.fillRoundedRect(width/2 - 180, centerY - 50, 160, 100, 15);
        requiredBg.lineStyle(3, 0x6366f1, 1);
        requiredBg.strokeRoundedRect(width/2 - 180, centerY - 50, 160, 100, 15);

        this.add.text(width/2 - 100, centerY - 30, 'Required:', {
            fontSize: '16px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '800',
            color: '#1e293b'
        }).setOrigin(0.5);

        this.add.text(width/2 - 100, centerY + 10, this.levelData.required.join('\n'), {
            fontSize: '14px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '600',
            color: '#475569',
            align: 'center'
        }).setOrigin(0.5);

        const basketBg = this.add.graphics();
        basketBg.fillStyle(0xffffff, 0.95);
        const basketColor = this.isWin ? 0x10b981 : 0xf87171;
        basketBg.fillRoundedRect(width/2 + 20, centerY - 50, 160, 100, 15);
        basketBg.lineStyle(3, basketColor, 1);
        basketBg.strokeRoundedRect(width/2 + 20, centerY - 50, 160, 100, 15);

        this.add.text(width/2 + 100, centerY - 30, 'Your Basket:', {
            fontSize: '16px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '800',
            color: '#1e293b'
        }).setOrigin(0.5);

        const basketItems = this.basket.length > 0 ? this.basket.join('\n') : 'Empty';
        this.add.text(width/2 + 100, centerY + 10, basketItems, {
            fontSize: '14px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '600',
            color: '#475569',
            align: 'center'
        }).setOrigin(0.5);

        const resultIcon = this.isWin ? '✅' : '❌';
        this.add.text(width/2, centerY, resultIcon, {
            fontSize: '32px'
        }).setOrigin(0.5);
    }

    createActionButtons(width, height) {
        const buttonY = height - 100;

        if (this.isWin) {
            if (this.currentLevel < 3) {
                this.createEmergencyButton(
                    width/2 - 100, buttonY, 180, 50, 0x6366f1,
                    'NEXT LEVEL', 18, 'nextLevel'
                );
            } else {
                this.createEmergencyButton(
                    width/2 - 100, buttonY, 180, 50, 0x6366f1,
                    'PLAY AGAIN', 18, 'playAgain'
                );
            }

            this.createEmergencyButton(
                width/2 + 100, buttonY, 180, 50, 0x10b981,
                'REPLAY LEVEL', 18, 'replayLevel'
            );
        } else {
            this.createEmergencyButton(
                width/2 - 100, buttonY, 180, 50, 0xfbbf24,
                'TRY AGAIN', 18, 'tryAgain'
            );

            this.createEmergencyButton(
                width/2 + 100, buttonY, 180, 50, 0x9ca3af,
                'CHANGE LEVEL', 18, 'goToMenu'
            );
        }

        this.createEmergencyButton(
            width/2, buttonY + 60, 200, 45, 0xa78bfa,
            'MAIN MENU', 16, 'goToMenu'
        );
    }

    // EMERGENCY BUTTON with multiple event handlers
    createEmergencyButton(x, y, width, height, color, text, fontSize, actionType) {
        console.log(`🔘 Creating button: ${text}`);
        
        const container = this.add.container(x, y);

        const shadow = this.add.graphics();
        shadow.fillStyle(0x000000, 0.3);
        shadow.fillRoundedRect(-width/2 + 3, -height/2 + 3, width, height, 12);

        const bg = this.add.graphics();
        bg.fillStyle(color, 0.9);
        bg.fillRoundedRect(-width/2, -height/2, width, height, 12);
        bg.lineStyle(3, 0xffffff, 0.8);
        bg.strokeRoundedRect(-width/2, -height/2, width, height, 12);

        const buttonText = this.add.text(0, 0, text, {
            fontSize: `${fontSize}px`,
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '700',
            color: '#ffffff'
        }).setOrigin(0.5);

        container.add([shadow, bg, buttonText]);
        container.setSize(width, height);
        container.setInteractive({ useHandCursor: true });

        // EMERGENCY: Multiple click event handlers
        const clickHandler = () => {
            console.log(`🚨 EMERGENCY CLICK: ${text} -> ${actionType}`);
            this.executeEmergencyAction(actionType, text);
        };

        // Add multiple event listeners
        container.on('pointerdown', clickHandler);
        container.on('pointerup', clickHandler);
        container.on('pointertap', clickHandler);

        // Also add a timeout-based click handler
        container.on('pointerdown', () => {
            setTimeout(() => {
                console.log(`⏰ TIMEOUT CLICK: ${text} -> ${actionType}`);
                this.executeEmergencyAction(actionType, text);
            }, 100);
        });

        // Visual feedback
        container.on('pointerover', () => {
            this.tweens.add({
                targets: container,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });

        container.on('pointerout', () => {
            this.tweens.add({
                targets: container,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });

        // Entrance animation
        container.setScale(0);
        this.tweens.add({
            targets: container,
            scaleX: 1,
            scaleY: 1,
            duration: 400,
            delay: 800,
            ease: 'Back.easeOut'
        });

        return container;
    }

    // EMERGENCY ACTION EXECUTOR
    executeEmergencyAction(actionType, buttonText) {
        console.log(`🆘 EMERGENCY ACTION: ${actionType} from button "${buttonText}"`);
        
        // Clear basket first
        sessionStorage.removeItem('basket');
        
        let targetScene = '';
        let targetRoute = '';
        
        // Determine target scene and route
        switch (actionType) {
            case 'nextLevel':
                console.log('➡️ Next Level Action');
                const nextLevel = this.currentLevel + 1;
                if (nextLevel <= 3) {
                    localStorage.setItem('restaurant-level', nextLevel.toString());
                }
                targetScene = 'restaurant';
                targetRoute = '/restaurant';
                break;
                
            case 'replayLevel':
            case 'tryAgain':
                console.log('🔄 Replay/Try Again Action');
                targetScene = 'restaurant';
                targetRoute = '/restaurant';
                break;
                
            case 'playAgain':
                console.log('🎮 Play Again Action');
                localStorage.setItem('restaurant-level', '1');
                targetScene = 'restaurant';
                targetRoute = '/restaurant';
                break;
                
            case 'goToMenu':
                console.log('🏠 Go to Menu Action');
                targetScene = 'menu';
                targetRoute = '/';
                break;
                
            default:
                console.error(`❌ Unknown action: ${actionType}`);
                targetScene = 'menu';
                targetRoute = '/';
        }
        
        // Try multiple navigation methods
        console.log(`🎯 Target: ${targetScene} (${targetRoute})`);
        this.tryAllNavigationMethods(targetScene, targetRoute);
    }

    // Try all navigation methods in sequence
    tryAllNavigationMethods(targetScene, targetRoute) {
        console.log('🔄 Trying all navigation methods...');
        
        let success = false;
        
        // Method 1: Window navigation
        if (!success) {
            try {
                success = this.navMethods.windowNav(targetScene);
                if (success) console.log('✅ Window navigation succeeded');
            } catch (error) {
                console.error('❌ Window navigation failed:', error);
            }
        }
        
        // Method 2: Scene navigation  
        if (!success) {
            try {
                success = this.navMethods.sceneNav(targetScene);
                if (success) console.log('✅ Scene navigation succeeded');
            } catch (error) {
                console.error('❌ Scene navigation failed:', error);
            }
        }
        
        // Method 3: Router navigation (immediate)
        if (!success) {
            console.log('🆘 Using emergency router navigation');
            setTimeout(() => {
                this.navMethods.routerNav(targetScene);
            }, 100);
            success = true;
        }
        
        // Method 4: Reload as last resort
        if (!success) {
            console.log('🆘 Using emergency page reload');
            setTimeout(() => {
                this.navMethods.reloadNav();
            }, 200);
        }
        
        console.log(`📊 Navigation attempt completed. Success: ${success}`);
    }

    updateProgress() {
        const nextLevel = this.currentLevel + 1;
        if (nextLevel > this.maxUnlockedLevel) {
            localStorage.setItem('max-unlocked-level', nextLevel.toString());
            console.log(`Level ${nextLevel} unlocked!`);
        }
    }

    lightenColor(color, amount) {
        const r = Math.min(255, ((color >> 16) & 0xff) + Math.round(255 * amount));
        const g = Math.min(255, ((color >> 8) & 0xff) + Math.round(255 * amount));
        const b = Math.min(255, (color & 0xff) + Math.round(255 * amount));
        return (r << 16) | (g << 8) | b;
    }

    checkWin() {
        if (!this.levelData || !this.levelData.required) {
            return false;
        }

        const required = [...this.levelData.required].sort();
        const selected = [...this.basket].sort();

        return required.length === selected.length &&
            required.every((item, i) => item === selected[i]);
    }

    getLevelData(level) {
        const levels = [
            {
                id: 1,
                request: "I need a simple sandwich: Bread, Lettuce, Tomato",
                required: ['bread', 'lettuce', 'tomato'],
                available: ['bread', 'lettuce', 'tomato', 'cheese', 'meat', 'onion']
            },
            {
                id: 2,
                request: "Make me a burger: Bread, Meat, Cheese, Lettuce, Tomato",
                required: ['bread', 'meat', 'cheese', 'lettuce', 'tomato'],
                available: ['bread', 'meat', 'cheese', 'lettuce', 'tomato', 'onion', 'pickle', 'sauce', 'mushroom']
            },
            {
                id: 3,
                request: "Pizza ingredients needed: Dough, Sauce, Cheese, Pepperoni, Mushroom",
                required: ['dough', 'sauce', 'cheese', 'pepperoni', 'mushroom'],
                available: ['dough', 'sauce', 'cheese', 'pepperoni', 'mushroom', 'olive', 'bell-pepper', 'sausage', 'pineapple', 'spinach']
            }
        ];
        
        return levels.find(l => l.id === level);
    }

    updateUI() {
        if (typeof window !== 'undefined' && window.updateGameUI) {
            window.updateGameUI();
        }
        
        if (typeof document !== 'undefined') {
            const levelElement = document.getElementById('current-level');
            const basketElement = document.getElementById('basket-count');
            
            if (levelElement) {
                levelElement.textContent = this.currentLevel;
            }
            
            if (basketElement) {
                basketElement.textContent = this.basket.length;
            }
        }
    }

    shutdown() {
        console.log('ResultScene: Shutting down...');
        
        if (this.animationManager) {
            this.animationManager.destroy();
        }
        
        this.time.removeAllEvents();
        
        console.log('ResultScene: Shutdown complete');
    }
}
