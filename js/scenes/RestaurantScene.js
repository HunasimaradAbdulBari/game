class RestaurantScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RestaurantScene' });
    }
    
    create() {
        console.log('RestaurantScene created with enhanced UI');
        const { width, height } = this.cameras.main;
        
        // Get current level and data
        this.currentLevel = parseInt(localStorage.getItem('restaurant-level') || '1');
        this.levelData = this.getLevelData(this.currentLevel);
        this.basket = JSON.parse(sessionStorage.getItem('basket') || '[]');
        
        // Create enhanced background
        this.createEnhancedBackground(width, height);
        
        // Create UI sections
        this.createHeader(width);
        this.createCustomerSection(width, height);
        this.createBasketSection(width, height);
        this.createActionButtons(width, height);
        
        this.updateUI();
    }
    
    createEnhancedBackground(width, height) {
        // Gradient background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x8e44ad, 0x9b59b6, 0xa569bd, 0x8e44ad, 1, 1, 1, 1);
        bg.fillRect(0, 0, width, height);
        
        // Restaurant atmosphere particles
        for(let i = 0; i < 15; i++) {
            const particle = this.add.circle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                Phaser.Math.Between(3, 7),
                0xffffff,
                0.1
            );
            
            this.tweens.add({
                targets: particle,
                y: particle.y - Phaser.Math.Between(30, 60),
                alpha: { from: 0.1, to: 0.2 },
                duration: Phaser.Math.Between(5000, 8000),
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut',
                delay: Math.random() * 3000
            });
        }
    }
    
    createHeader(width) {
        // Header background
        const headerBg = this.add.graphics();
        headerBg.fillStyle(0x000000, 0.3);
        headerBg.fillRoundedRect(20, 20, width - 40, 80, 20);
        
        // Title
        this.add.text(width/2, 45, `Restaurant - Level ${this.currentLevel}`, {
            fontSize: '32px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '800',
            color: '#ffffff',
            stroke: '#2c3e50',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Progress indicator
        this.add.text(width/2, 75, `Difficulty: ${'⭐'.repeat(this.currentLevel)}`, {
            fontSize: '18px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '600',
            color: '#f1c40f'
        }).setOrigin(0.5);
    }
    
    createCustomerSection(width, height) {
        const centerY = height/2 - 30;
        
        // Customer container with background
        const customerBg = this.add.graphics();
        customerBg.fillStyle(0xffffff, 0.9);
        customerBg.fillRoundedRect(width/2 - 200, centerY - 80, 400, 160, 25);
        customerBg.lineStyle(4, 0xe74c3c, 1);
        customerBg.strokeRoundedRect(width/2 - 200, centerY - 80, 400, 160, 25);
        
        // Customer avatar
        const customerAvatar = this.add.circle(width/2 - 120, centerY - 20, 35, 0xe74c3c);
        this.add.text(width/2 - 120, centerY - 20, '👨‍🍳', { fontSize: '50px' }).setOrigin(0.5);
        
        // Customer speech bubble
        const speechBg = this.add.graphics();
        speechBg.fillStyle(0xffffff, 1);
        speechBg.fillRoundedRect(width/2 - 60, centerY - 60, 240, 120, 15);
        speechBg.lineStyle(2, 0x34495e, 1);
        speechBg.strokeRoundedRect(width/2 - 60, centerY - 60, 240, 120, 15);
        
        // Speech bubble pointer
        speechBg.fillTriangle(
            width/2 - 60, centerY - 20,
            width/2 - 80, centerY - 10,
            width/2 - 60, centerY
        );
        
        this.add.text(width/2 - 55, centerY - 45, 'Customer says:', {
            fontSize: '16px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '800',
            color: '#2c3e50'
        });
        
        this.add.text(width/2 + 60, centerY - 15, `"${this.levelData.request}"`, {
            fontSize: '14px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '600',
            color: '#e74c3c',
            wordWrap: { width: 220 },
            align: 'center'
        }).setOrigin(0.5);
        
        // Breathing animation for customer
        this.tweens.add({
            targets: customerAvatar,
            scaleX: { from: 1, to: 1.05 },
            scaleY: { from: 1, to: 1.05 },
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createBasketSection(width, height) {
        const basketY = height/2 + 120;
        
        if (this.basket.length > 0) {
            // Basket display background
            const basketBg = this.add.graphics();
            basketBg.fillStyle(0x27ae60, 0.9);
            basketBg.fillRoundedRect(width/2 - 150, basketY - 40, 300, 80, 20);
            basketBg.lineStyle(3, 0x2ecc71, 1);
            basketBg.strokeRoundedRect(width/2 - 150, basketY - 40, 300, 80, 20);
            
            this.add.text(width/2, basketY - 15, '🛒 Your Basket:', {
                fontSize: '18px',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: '700',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            this.add.text(width/2, basketY + 10, this.basket.join(', '), {
                fontSize: '16px',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: '600',
                color: '#ffffff',
                wordWrap: { width: 280 },
                align: 'center'
            }).setOrigin(0.5);
        }
    }
    
    createActionButtons(width, height) {
        const buttonY = height - 80;
        
        if (this.basket.length === 0) {
            // Go to market button (large, prominent)
            this.createButton(
                width/2, buttonY, 250, 55, 0x27ae60, 
                '🏪 GO TO MARKET', 20, () => this.goToMarket()
            );
            
            // Menu button (smaller, top right)
            this.createButton(
                width - 80, 50, 120, 40, 0x95a5a6, 
                'Menu', 14, () => this.goToMenu()
            );
        } else {
            // Submit order button
            this.createButton(
                width/2 - 120, buttonY, 200, 50, 0x3498db, 
                `✓ SUBMIT (${this.basket.length})`, 16, () => this.submitOrder()
            );
            
            // Back to market button
            this.createButton(
                width/2 + 120, buttonY, 200, 50, 0x27ae60, 
                '+ ADD MORE', 16, () => this.goToMarket()
            );
            
            // Clear basket button (top right)
            this.createButton(
                width - 80, 50, 120, 40, 0xe74c3c, 
                'Clear', 14, () => this.clearBasket()
            );
            
            // Menu button (top left)
            this.createButton(
                80, 50, 120, 40, 0x95a5a6, 
                'Menu', 14, () => this.goToMenu()
            );
        }
    }
    
    createButton(x, y, width, height, color, text, fontSize, callback) {
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
        
        return container;
    }
    
    goToMarket() {
        console.log('Going to market...');
        this.cameras.main.fadeOut(500, 22, 160, 133);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('MarketScene');
        });
    }
    
    submitOrder() {
        console.log('Submitting order...');
        this.cameras.main.fadeOut(500, 52, 152, 219);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('ResultScene');
        });
    }
    
    clearBasket() {
        sessionStorage.removeItem('basket');
        this.basket = [];
        
        // Visual feedback
        this.cameras.main.flash(120, 231, 76, 60, false);
        
        // Restart scene to refresh UI
        this.time.delayedCall(200, () => {
            this.scene.restart();
        });
    }
    
    goToMenu() {
        console.log('Going to menu...');
        this.cameras.main.fadeOut(500, 142, 68, 173);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('MenuScene');
        });
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
    
    updateUI() {
        if (window.updateGameUI) {
            window.updateGameUI();
        }
    }
}
