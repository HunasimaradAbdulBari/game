import { AnimationManager } from './AnimationManager';

export class RestaurantScene extends Phaser.Scene {
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
        this.animationManager = new AnimationManager(this);

        // FIXED: Track popup elements for proper cleanup
        this.popupElements = [];
        this.popupVisible = false;

        // Create enhanced background
        this.createEnhancedBackground(width, height);
        
        // Create UI sections
        this.createHeader(width);
        this.createCustomerSection(width, height);
        this.createBasketSection(width, height);
        this.createActionButtons(width, height);
        
        // FIXED: Add How to Play button
        this.createHowToPlayButton(width, height);
        
        this.updateUI();
    }

    createEnhancedBackground(width, height) {
        // CHANGED: Light gradient background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xffffff, 0xf8fafc, 0xf1f5f9, 0xe2e8f0, 1, 1, 1, 1);
        bg.fillRect(0, 0, width, height);

        // CHANGED: Soft particles
        for(let i = 0; i < 15; i++) {
            const particle = this.add.circle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                Phaser.Math.Between(3, 7),
                0x94a3b8, // CHANGED: Soft grey
                0.2
            );

            this.tweens.add({
                targets: particle,
                y: particle.y - Phaser.Math.Between(30, 60),
                alpha: { from: 0.2, to: 0.4 },
                duration: Phaser.Math.Between(5000, 8000),
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut',
                delay: Math.random() * 3000
            });
        }
    } // FIXED: Added missing closing brace

    createHeader(width) {
        // CHANGED: Light header
        const headerBg = this.add.graphics();
        headerBg.fillStyle(0xffffff, 0.9); // CHANGED: Light white
        headerBg.fillRoundedRect(20, 20, width - 40, 80, 20);

        // CHANGED: Dark text on light background
        this.add.text(width/2, 45, `Restaurant - Level ${this.currentLevel}`, {
            fontSize: '32px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '800',
            color: '#1e293b', // CHANGED: Dark grey text
            stroke: '#e2e8f0', // CHANGED: Light stroke
            strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(width/2, 75, `Difficulty: ${'⭐'.repeat(this.currentLevel)}`, {
            fontSize: '18px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '600',
            color: '#fbbf24' // CHANGED: Soft amber
        }).setOrigin(0.5);
    } // FIXED: Added missing closing brace

    createCustomerSection(width, height) {
        const centerY = height/2 - 30;

        // CHANGED: Light customer container
        const customerBg = this.add.graphics();
        customerBg.fillStyle(0xffffff, 0.95); // CHANGED: Pure white
        customerBg.fillRoundedRect(width/2 - 200, centerY - 80, 400, 160, 25);
        customerBg.lineStyle(4, 0x6366f1, 1); // CHANGED: Soft indigo border
        customerBg.strokeRoundedRect(width/2 - 200, centerY - 80, 400, 160, 25);

        // CHANGED: Soft customer avatar
        const customerAvatar = this.add.circle(width/2 - 120, centerY - 20, 35, 0x6366f1);
        this.add.text(width/2 - 120, centerY - 20, '👨🍳', { fontSize: '50px' }).setOrigin(0.5);

        // Customer speech bubble
        const speechBg = this.add.graphics();
        speechBg.fillStyle(0xffffff, 1);
        speechBg.fillRoundedRect(width/2 - 60, centerY - 60, 240, 120, 15);
        speechBg.lineStyle(2, 0x64748b, 1); // CHANGED: Soft grey border
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
            color: '#1e293b' // CHANGED: Dark grey text
        });

        this.add.text(width/2 + 60, centerY - 15, `"${this.levelData.request}"`, {
            fontSize: '14px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '600',
            color: '#f87171', // CHANGED: Soft red
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
    } // FIXED: Added missing closing brace

    createBasketSection(width, height) {
        const basketY = height/2 + 120;

        if (this.basket.length > 0) {
            // CHANGED: Light basket display
            const basketBg = this.add.graphics();
            basketBg.fillStyle(0x10b981, 0.9); // CHANGED: Soft emerald
            basketBg.fillRoundedRect(width/2 - 150, basketY - 40, 300, 80, 20);
            basketBg.lineStyle(3, 0x059669, 1); // CHANGED: Darker emerald border
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
    } // FIXED: Added missing closing brace

    createActionButtons(width, height) {
        const buttonY = height - 80;

        if (this.basket.length === 0) {
            // CHANGED: Soft button colors
            this.createButton(
                width/2, buttonY, 250, 55, 0x10b981, // CHANGED: Soft emerald
                '🏪 GO TO MARKET', 20, () => this.goToMarket()
            );

            this.createButton(
                width - 80, 50, 120, 40, 0x9ca3af, // CHANGED: Soft grey
                'Menu', 14, () => this.goToMenu()
            );
        } else {
            // CHANGED: Soft button colors
            this.createButton(
                width/2 - 120, buttonY, 200, 50, 0x6366f1, // CHANGED: Soft indigo
                `✓ SUBMIT (${this.basket.length})`, 16, () => this.submitOrder()
            );

            this.createButton(
                width/2 + 120, buttonY, 200, 50, 0x10b981, // CHANGED: Soft emerald
                '+ ADD MORE', 16, () => this.goToMarket()
            );

            this.createButton(
                width - 80, 50, 120, 40, 0xf87171, // CHANGED: Soft red
                'Clear', 14, () => this.clearBasket()
            );

            this.createButton(
                80, 50, 120, 40, 0x9ca3af, // CHANGED: Soft grey
                'Menu', 14, () => this.goToMenu()
            );
        }
    } // FIXED: Added missing closing brace

    createHowToPlayButton(width, height) {
        this.createButton(
            50, height - 140, 120, 35, 0xa78bfa, // CHANGED: Soft purple
            'How to Play', 12, () => this.showInstructions()
        );
    } // FIXED: Added missing closing brace

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
    } // FIXED: Added missing closing brace

    showInstructions() {
        if (this.popupVisible) return;
        
        this.popupVisible = true;
        const { width, height } = this.cameras.main;

        // IMMEDIATE cleanup approach - no animations
        this.clearPopupElements();

        // Create instruction overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.8);
        overlay.fillRect(0, 0, width, height);
        overlay.setDepth(1000);
        overlay.setInteractive();
        this.popupElements.push(overlay);

        const panelWidth = Math.min(600, width - 40);
        const panelHeight = Math.min(500, height - 40);

        // Instruction panel background
        const instructionBg = this.add.graphics();
        instructionBg.fillStyle(0xffffff, 0.95);
        instructionBg.fillRoundedRect(
            width/2 - panelWidth/2,
            height/2 - panelHeight/2,
            panelWidth,
            panelHeight,
            20
        );
        instructionBg.lineStyle(3, 0x6366f1, 1); // CHANGED: Soft indigo
        instructionBg.strokeRoundedRect(
            width/2 - panelWidth/2,
            height/2 - panelHeight/2,
            panelWidth,
            panelHeight,
            20
        );
        instructionBg.setDepth(1001);
        this.popupElements.push(instructionBg);

        // Title
        const instructionTitle = this.add.text(width/2, height/2 - panelHeight/2 + 40, '📖 How to Play Restaurant Master', {
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '20px',
            fontWeight: '800',
            color: '#1e293b' // CHANGED: Dark grey
        }).setOrigin(0.5).setDepth(1002);
        this.popupElements.push(instructionTitle);

        // Instructions array
        const instructions = [
            '🎯 Welcome to Restaurant Master!',
            '',
            '1. Read the customer\'s order carefully',
            '2. Click "GO TO MARKET" to collect ingredients',
            '3. Drag items to your basket or tap to add them',
            '4. Return here and click "SUBMIT" when ready',
            '5. Get all ingredients correct to advance!',
            '',
            '💡 Tips:',
            '• You can view your basket anytime in the market',
            '• Use "ADD MORE" to get additional ingredients',
            '• Each level gets more challenging!'
        ];

        instructions.forEach((instruction, index) => {
            const isTitle = index === 0;
            const isSubtitle = instruction.startsWith('💡');
            const isEmpty = instruction === '';
            
            if (!isEmpty) {
                const instructionText = this.add.text(
                    width/2,
                    height/2 - panelHeight/2 + 80 + (index * 25),
                    instruction,
                    {
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                        fontSize: isTitle ? '16px' : (isSubtitle ? '14px' : '12px'),
                        fontWeight: isTitle || isSubtitle ? '700' : '500',
                        color: isTitle ? '#f87171' : (isSubtitle ? '#fbbf24' : '#475569'), // CHANGED: Soft colors
                        wordWrap: { width: panelWidth - 60 },
                        align: 'center'
                    }
                ).setOrigin(0.5).setDepth(1002);
                this.popupElements.push(instructionText);
            }
        });

        // Close button
        const closeBtn = this.add.graphics();
        closeBtn.fillStyle(0xf87171, 0.9); // CHANGED: Soft red
        closeBtn.fillRoundedRect(
            width/2 - 60,
            height/2 + panelHeight/2 - 50,
            120,
            35,
            8
        );
        closeBtn.lineStyle(2, 0xffffff, 0.8);
        closeBtn.strokeRoundedRect(
            width/2 - 60,
            height/2 + panelHeight/2 - 50,
            120,
            35,
            8
        );
        closeBtn.setDepth(1001);
        closeBtn.setInteractive({ useHandCursor: true });
        this.popupElements.push(closeBtn);

        const closeText = this.add.text(
            width/2,
            height/2 + panelHeight/2 - 32,
            'GOT IT!',
            {
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '14px',
                fontWeight: '700',
                color: '#ffffff'
            }
        ).setOrigin(0.5).setDepth(1002);
        this.popupElements.push(closeText);

        // Close event handlers - immediate cleanup
        const closeInstructions = () => {
            this.closeInstructions();
        };

        closeBtn.on('pointerdown', closeInstructions);
        overlay.on('pointerdown', closeInstructions);
    } // FIXED: Added missing closing brace

    closeInstructions() {
        if (!this.popupVisible) return;
        this.popupVisible = false;
        
        // IMMEDIATE cleanup without animations
        this.clearPopupElements();
    } // FIXED: Added missing closing brace

    clearPopupElements() {
        // IMMEDIATE DESTRUCTION - No animations, just destroy everything
        this.children.list.forEach(child => {
            if (child.depth >= 1000) { // All popup elements have depth 1000+
                try {
                    child.destroy();
                } catch (error) {
                    console.warn('Error destroying popup element:', error);
                }
            }
        });
        
        this.popupElements.forEach((element) => {
            if (element && element.destroy) {
                try {
                    element.destroy();
                } catch (error) {
                    console.warn('Error destroying popup element:', error);
                }
            }
        });
        
        this.popupElements = [];
        this.popupVisible = false;
    } // FIXED: Added missing closing brace

    goToMarket() {
        console.log('Going to market...');
        this.clearPopupElements();
        
        this.cameras.main.fadeOut(500, 22, 160, 133);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            if (typeof window !== 'undefined' && window.navigateToScene) {
                window.navigateToScene('market');
            }
        });
    } // FIXED: Added missing closing brace

    submitOrder() {
        console.log('Submitting order...');
        this.clearPopupElements();
        
        this.cameras.main.fadeOut(500, 52, 152, 219);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            if (typeof window !== 'undefined' && window.navigateToScene) {
                window.navigateToScene('result');
            }
        });
    } // FIXED: Added missing closing brace

    clearBasket() {
        sessionStorage.removeItem('basket');
        this.basket = [];
        
        this.cameras.main.flash(120, 231, 76, 60, false);
        
        this.time.delayedCall(200, () => {
            this.scene.restart();
        });
    } // FIXED: Added missing closing brace

    goToMenu() {
        console.log('Going to menu...');
        this.clearPopupElements();
        
        this.cameras.main.fadeOut(500, 142, 68, 173);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            if (typeof window !== 'undefined' && window.navigateToScene) {
                window.navigateToScene('menu');
            }
        });
    } // FIXED: Added missing closing brace

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
    } // FIXED: Added missing closing brace

    updateUI() {
        if (typeof window !== 'undefined' && window.updateGameUI) {
            window.updateGameUI();
        }
    } // FIXED: Added missing closing brace

    shutdown() {
        console.log('RestaurantScene: Shutting down...');
        
        this.clearPopupElements();
        
        if (this.animationManager) {
            this.animationManager.destroy();
        }
        
        this.time.removeAllEvents();
        
        console.log('RestaurantScene: Shutdown complete');
    } // FIXED: Added missing closing brace
} // FIXED: Added missing CLASS closing brace
