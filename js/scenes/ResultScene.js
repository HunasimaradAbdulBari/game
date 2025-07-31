class ResultScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ResultScene' });
    }
    
    create() {
        console.log('ResultScene created with enhanced win/loss handling');
        const { width, height } = this.cameras.main;
        
        // Get data
        this.currentLevel = parseInt(localStorage.getItem('restaurant-level') || '1');
        this.levelData = this.getLevelData(this.currentLevel);
        this.basket = JSON.parse(sessionStorage.getItem('basket') || '[]');
        this.maxUnlockedLevel = parseInt(localStorage.getItem('max-unlocked-level') || '1');
        
        // Check win condition
        this.isWin = this.checkWin();
        
        // Update progress if won
        if (this.isWin) {
            this.updateProgress();
        }
        
        // Create result screen
        this.createResultBackground(width, height);
        this.createResultContent(width, height);
        this.createActionButtons(width, height);
    }
    
    createResultBackground(width, height) {
        // Dynamic background based on result
        const bgColor1 = this.isWin ? 0x27ae60 : 0xe74c3c;
        const bgColor2 = this.isWin ? 0x2ecc71 : 0xc0392b;
        
        const bg = this.add.graphics();
        bg.fillGradientStyle(bgColor1, bgColor2, bgColor1, bgColor2, 1, 1, 1, 1);
        bg.fillRect(0, 0, width, height);
        
        // Celebration particles for win
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
                0xf1c40f,
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
        // Result title with animation
        const titleText = this.isWin ? 'LEVEL COMPLETE! 🎉' : 'TRY AGAIN! 💪';
        const titleColor = this.isWin ? '#ffffff' : '#ffffff';
        
        const title = this.add.text(width/2, height/4, titleText, {
            fontSize: '42px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '900',
            color: titleColor,
            stroke: '#2c3e50',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Title animation
        title.setScale(0);
        this.tweens.add({
            targets: title,
            scaleX: 1,
            scaleY: 1,
            duration: 600,
            ease: 'Elastic.easeOut'
        });
        
        // Level info
        const levelInfo = this.add.text(width/2, height/4 + 60, `Level ${this.currentLevel}`, {
            fontSize: '24px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '700',
            color: '#ecf0f1'
        }).setOrigin(0.5);
        
        // Comparison section with better layout
        this.createComparisonSection(width, height);
        
        // Progress indicator for wins
        if (this.isWin && this.currentLevel < 3) {
            this.add.text(width/2, height/2 + 120, 'Next level unlocked!', {
                fontSize: '20px',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: '700',
                color: '#f1c40f'
            }).setOrigin(0.5);
        } else if (this.isWin && this.currentLevel === 3) {
            this.add.text(width/2, height/2 + 120, 'You are a Restaurant Master! 👑', {
                fontSize: '22px',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: '800',
                color: '#f1c40f'
            }).setOrigin(0.5);
        }
    }
    
    createComparisonSection(width, height) {
        const centerY = height/2;
        
        // Required ingredients section
        const requiredBg = this.add.graphics();
        requiredBg.fillStyle(0xffffff, 0.9);
        requiredBg.fillRoundedRect(width/2 - 180, centerY - 50, 160, 100, 15);
        requiredBg.lineStyle(3, 0x3498db, 1);
        requiredBg.strokeRoundedRect(width/2 - 180, centerY - 50, 160, 100, 15);
        
        this.add.text(width/2 - 100, centerY - 30, 'Required:', {
            fontSize: '16px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '800',
            color: '#2c3e50'
        }).setOrigin(0.5);
        
        this.add.text(width/2 - 100, centerY + 10, this.levelData.required.join('\n'), {
            fontSize: '14px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '600',
            color: '#34495e',
            align: 'center'
        }).setOrigin(0.5);
        
        // Your basket section
        const basketBg = this.add.graphics();
        const basketColor = this.isWin ? 0x27ae60 : 0xe74c3c;
        basketBg.fillStyle(0xffffff, 0.9);
        basketBg.fillRoundedRect(width/2 + 20, centerY - 50, 160, 100, 15);
        basketBg.lineStyle(3, basketColor, 1);
        basketBg.strokeRoundedRect(width/2 + 20, centerY - 50, 160, 100, 15);
        
        this.add.text(width/2 + 100, centerY - 30, 'Your Basket:', {
            fontSize: '16px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '800',
            color: '#2c3e50'
        }).setOrigin(0.5);
        
        const basketItems = this.basket.length > 0 ? this.basket.join('\n') : 'Empty';
        this.add.text(width/2 + 100, centerY + 10, basketItems, {
            fontSize: '14px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '600',
            color: '#34495e',
            align: 'center'
        }).setOrigin(0.5);
        
        // Result icon between sections
        const resultIcon = this.isWin ? '✅' : '❌';
        this.add.text(width/2, centerY, resultIcon, {
            fontSize: '32px'
        }).setOrigin(0.5);
    }
    
    createActionButtons(width, height) {
        const buttonY = height - 100;
        
        if (this.isWin) {
            // Win buttons
            if (this.currentLevel < 3) {
                // Next level button
                this.createActionButton(
                    width/2 - 100, buttonY, 180, 50, 0x3498db, 
                    'NEXT LEVEL', 18, () => this.goToNextLevel()
                );
            } else {
                // All levels complete - play again from level 1
                this.createActionButton(
                    width/2 - 100, buttonY, 180, 50, 0x3498db, 
                    'PLAY AGAIN', 18, () => this.playFromStart()
                );
            }
            
            // Replay current level
            this.createActionButton(
                width/2 + 100, buttonY, 180, 50, 0x27ae60, 
                'REPLAY LEVEL', 18, () => this.replayLevel()
            );
        } else {
            // Loss buttons
            this.createActionButton(
                width/2 - 100, buttonY, 180, 50, 0xf39c12, 
                'TRY AGAIN', 18, () => this.tryAgain()
            );
            
            this.createActionButton(
                width/2 + 100, buttonY, 180, 50, 0x95a5a6, 
                'CHANGE LEVEL', 18, () => this.goToMenu()
            );
        }
        
        // Main menu button (always present)
        this.createActionButton(
            width/2, buttonY + 60, 200, 45, 0x8e44ad, 
            'MAIN MENU', 16, () => this.goToMenu()
        );
    }
    
    createActionButton(x, y, width, height, color, text, fontSize, callback) {
        const container = this.add.container(x, y);
        
        // Button shadow
        const shadow = this.add.graphics();
        shadow.fillStyle(0x000000, 0.3);
        shadow.fillRoundedRect(-width/2 + 3, -height/2 + 3, width, height, 12);
        
        // Button background
        const bg = this.add.graphics();
        bg.fillStyle(color, 0.9);
        bg.fillRoundedRect(-width/2, -height/2, width, height, 12);
        bg.lineStyle(3, 0xffffff, 0.8);
        bg.strokeRoundedRect(-width/2, -height/2, width, height, 12);
        
        // Button text
        const buttonText = this.add.text(0, 0, text, {
            fontSize: `${fontSize}px`,
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '700',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        container.add([shadow, bg, buttonText]);
        container.setSize(width, height);
        container.setInteractive({ useHandCursor: true });
        
        // Hover effects
        container.on('pointerover', () => {
            this.tweens.add({
                targets: container,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 200,
                ease: 'Back.easeOut'
            });
            
            bg.clear();
            bg.fillStyle(this.lightenColor(color, 0.2), 1);
            bg.fillRoundedRect(-width/2, -height/2, width, height, 12);
            bg.lineStyle(4, 0xffffff, 1);
            bg.strokeRoundedRect(-width/2, -height/2, width, height, 12);
        });
        
        container.on('pointerout', () => {
            this.tweens.add({
                targets: container,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Back.easeOut'
            });
            
            bg.clear();
            bg.fillStyle(color, 0.9);
            bg.fillRoundedRect(-width/2, -height/2, width, height, 12);
            bg.lineStyle(3, 0xffffff, 0.8);
            bg.strokeRoundedRect(-width/2, -height/2, width, height, 12);
        });
        
        container.on('pointerdown', () => {
            this.tweens.add({
                targets: container,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                ease: 'Power2.easeInOut',
                onComplete: callback
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
    }
    
    updateProgress() {
        // Update max unlocked level if current level is higher
        const nextLevel = this.currentLevel + 1;
        if (nextLevel > this.maxUnlockedLevel) {
            localStorage.setItem('max-unlocked-level', nextLevel);
            console.log(`Level ${nextLevel} unlocked!`);
        }
    }
    
    goToNextLevel() {
        const nextLevel = this.currentLevel + 1;
        if (nextLevel <= 3) {
            localStorage.setItem('restaurant-level', nextLevel);
            sessionStorage.removeItem('basket');
            
            this.cameras.main.fadeOut(500, 52, 152, 219);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('RestaurantScene');
            });
        }
    }
    
    replayLevel() {
        sessionStorage.removeItem('basket');
        
        this.cameras.main.fadeOut(500, 142, 68, 173);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('RestaurantScene');
        });
    }
    
    tryAgain() {
        sessionStorage.removeItem('basket');
        
        this.cameras.main.fadeOut(500, 243, 156, 18);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('RestaurantScene');
        });
    }
    
    playFromStart() {
        localStorage.setItem('restaurant-level', '1');
        sessionStorage.removeItem('basket');
        
        this.cameras.main.fadeOut(500, 52, 152, 219);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('RestaurantScene');
        });
    }
    
    goToMenu() {
        sessionStorage.removeItem('basket');
        
        this.cameras.main.fadeOut(500, 142, 68, 173);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('MenuScene');
        });
    }
    
    lightenColor(color, amount) {
        const r = Math.min(255, ((color >> 16) & 0xff) + Math.round(255 * amount));
        const g = Math.min(255, ((color >> 8) & 0xff) + Math.round(255 * amount));
        const b = Math.min(255, (color & 0xff) + Math.round(255 * amount));
        return (r << 16) | (g << 8) | b;
    }
    
    checkWin() {
        const required = [...this.levelData.required].sort();
        const selected = [...this.basket].sort();
        
        return required.length === selected.length && 
               required.every((item, i) => item === selected[i]);
    }
    
    getLevelData(level) {
        const levels = [
            { 
                id: 1, 
                request: "I need: Bread, Lettuce, Tomato", 
                required: ['bread', 'lettuce', 'tomato'], 
                available: ['bread', 'lettuce', 'tomato', 'cheese', 'meat', 'onion'] 
            },
            { 
                id: 2, 
                request: "Make a burger: Bread, Meat, Cheese, Lettuce", 
                required: ['bread', 'meat', 'cheese', 'lettuce'], 
                available: ['bread', 'meat', 'cheese', 'lettuce', 'tomato', 'onion', 'pickle', 'sauce'] 
            },
            { 
                id: 3, 
                request: "Pizza needs: Dough, Sauce, Cheese, Pepperoni", 
                required: ['dough', 'sauce', 'cheese', 'pepperoni'], 
                available: ['dough', 'sauce', 'cheese', 'pepperoni', 'mushroom', 'olive', 'pepper'] 
            }
        ];
        return levels.find(l => l.id === level);
    }
}
