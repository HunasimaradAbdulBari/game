import { AnimationManager } from './AnimationManager';

export class MarketScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MarketScene' });
    }

    create() {
        console.log('MarketScene: Starting creation...');
        
        const { width, height } = this.cameras.main;

        // Initialize state management (UNCHANGED)
        this.currentLevel = parseInt(localStorage.getItem('restaurant-level') || '1');
        this.levelData = this.getLevelData(this.currentLevel);
        this.basket = new Set(JSON.parse(sessionStorage.getItem('basket') || '[]'));
        
        // CRITICAL: Robust drag state management (UNCHANGED)
        this.isDragging = false;
        this.draggedItem = null;
        this.draggedItemOriginalState = null;
        this.itemContainers = [];
        this.activeTrailTimer = null;
        this.dragEventHandlers = new Map();
        
        // NEW: Basket popup state
        this.basketPopupVisible = false;
        this.basketPopupContainer = null;
        
        // Animation manager
        this.animationManager = new AnimationManager(this);
        
        // Responsive scaling
        this.baseWidth = 900;
        this.baseHeight = 650;
        this.scaleFactor = Math.min(width / this.baseWidth, height / this.baseHeight);

        // Create all elements with LIGHT DESIGN
        this.createModernBackground();
        this.createModernUI();
        this.createModernBasket();
        this.createModernItems();
        this.createModernNavigation();
        
        // CRITICAL: Setup drag system (UNCHANGED)
        this.setupRobustDragDropSystem();
        
        this.updateUI();

        // Modern fade in
        this.cameras.main.fadeIn(800, 15, 23, 42);
        
        console.log('MarketScene: Creation complete!');
    }

    createModernBackground() {
        const { width, height } = this.cameras.main;
        
        // CHANGED: Light gradient background
        const bgLayer1 = this.add.graphics();
        bgLayer1.fillGradientStyle(0xffffff, 0xf8fafc, 0xf1f5f9, 0xe2e8f0, 1, 1, 1, 1);
        bgLayer1.fillRect(0, 0, width, height);

        // CHANGED: Soft overlay
        const bgLayer2 = this.add.graphics();
        bgLayer2.fillGradientStyle(0x6366f1, 0x8b5cf6, 0x6366f1, 0x8b5cf6, 0.05, 0.05, 0.05, 0.05);
        bgLayer2.fillRect(0, 0, width, height);

        this.tweens.add({
            targets: bgLayer2,
            alpha: { from: 0.05, to: 0.15 },
            duration: 8000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // CHANGED: Light floating elements
        for(let i = 0; i < 12; i++) {
            const size = Phaser.Math.Between(2, 4);
            const element = this.add.circle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                size,
                0x6366f1, // CHANGED: Soft indigo
                Phaser.Math.FloatBetween(0.1, 0.2)
            );
            
            this.tweens.add({
                targets: element,
                x: element.x + Phaser.Math.Between(-40, 40),
                y: element.y - Phaser.Math.Between(30, 50),
                alpha: { from: element.alpha, to: 0.05 },
                duration: Phaser.Math.Between(8000, 12000),
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: Phaser.Math.Between(0, 4000)
            });
        }
    }

    createModernUI() {
        const { width } = this.cameras.main;
        
        // CHANGED: Light glassmorphism
        const titleBg = this.add.graphics();
        titleBg.fillStyle(0xffffff, 0.8);
        titleBg.fillRoundedRect(width/2 - 200, 15, 400, 55, 16);
        titleBg.lineStyle(1, 0x6366f1, 0.3);
        titleBg.strokeRoundedRect(width/2 - 200, 15, 400, 55, 16);

        this.title = this.add.text(width/2, 42, '🏪 Market Selection', {
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: `${Math.round(26 * this.scaleFactor)}px`,
            fontWeight: '700',
            color: '#1e293b', // CHANGED: Dark grey text
            stroke: '#f1f5f9', // CHANGED: Light stroke
            strokeThickness: 2
        }).setOrigin(0.5);

        // CHANGED: Soft instruction text
        this.instruction = this.add.text(width/2, 85, 'Drag items to basket or tap to add them! 🎯', {
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: `${Math.round(14 * this.scaleFactor)}px`,
            fontWeight: '500',
            color: '#475569', // CHANGED: Medium grey
            stroke: '#f8fafc', // CHANGED: Very light stroke
            strokeThickness: 1
        }).setOrigin(0.5);

        // Subtle breathing animation
        this.tweens.add({
            targets: this.title,
            scaleX: { from: 1, to: 1.02 },
            scaleY: { from: 1, to: 1.02 },
            duration: 4000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createModernBasket() {
        const { width } = this.cameras.main;
        
        // Modern basket positioning
        this.basketContainer = this.add.container(width - 110, 200);

        // CHANGED: Light glassmorphism basket
        const basketGlow = this.add.graphics();
        basketGlow.lineStyle(3, 0x10b981, 0.6);
        basketGlow.strokeRoundedRect(-65, -55, 130, 110, 16);

        const basketBg = this.add.graphics();
        basketBg.fillStyle(0xffffff, 0.8); // CHANGED: Light white
        basketBg.fillRoundedRect(-60, -50, 120, 100, 14);
        basketBg.lineStyle(1, 0x10b981, 0.4);
        basketBg.strokeRoundedRect(-60, -50, 120, 100, 14);

        // CHANGED: Dark text on light background
        this.basketLabel = this.add.text(0, -75, 'BASKET', {
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: `${Math.round(12 * this.scaleFactor)}px`,
            fontWeight: '600',
            color: '#1e293b' // CHANGED: Dark grey
        }).setOrigin(0.5);

        // Modern basket icon
        this.basketIcon = this.add.text(0, -15, '🛒', {
            fontSize: `${Math.round(40 * this.scaleFactor)}px`
        }).setOrigin(0.5);

        // CHANGED: Soft count display
        this.basketCountText = this.add.text(0, 20, `${this.basket.size} items`, {
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: `${Math.round(11 * this.scaleFactor)}px`,
            fontWeight: '500',
            color: '#10b981'
        }).setOrigin(0.5);

        // NEW: Click hint text
        this.basketClickHint = this.add.text(0, 35, 'Click to view', {
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: `${Math.round(8 * this.scaleFactor)}px`,
            fontWeight: '400',
            color: '#94a3b8',
            alpha: 0.7
        }).setOrigin(0.5);

        this.basketContainer.add([basketGlow, basketBg, this.basketLabel, this.basketIcon, this.basketCountText, this.basketClickHint]);
        this.basketContainer.setSize(130, 110);
        this.basketContainer.setInteractive({ useHandCursor: true });

        // Store references
        this.basketBg = basketBg;
        this.basketGlow = basketGlow;

        // Modern hover effects
        this.basketContainer.on('pointerover', () => {
            this.basketBg.clear();
            this.basketBg.fillStyle(0x10b981, 0.15);
            this.basketBg.fillRoundedRect(-60, -50, 120, 100, 14);
            this.basketBg.lineStyle(2, 0x10b981, 0.8);
            this.basketBg.strokeRoundedRect(-60, -50, 120, 100, 14);

            this.basketGlow.clear();
            this.basketGlow.lineStyle(4, 0x10b981, 0.8);
            this.basketGlow.strokeRoundedRect(-65, -55, 130, 110, 16);

            this.tweens.add({
                targets: this.basketContainer,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });

        this.basketContainer.on('pointerout', () => {
            this.basketBg.clear();
            this.basketBg.fillStyle(0xffffff, 0.8);
            this.basketBg.fillRoundedRect(-60, -50, 120, 100, 14);
            this.basketBg.lineStyle(1, 0x10b981, 0.4);
            this.basketBg.strokeRoundedRect(-60, -50, 120, 100, 14);

            this.basketGlow.clear();
            this.basketGlow.lineStyle(3, 0x10b981, 0.6);
            this.basketGlow.strokeRoundedRect(-65, -55, 130, 110, 16);

            this.tweens.add({
                targets: this.basketContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });

        // FIXED: Click handler for basket popup
        this.basketContainer.on('pointerdown', () => {
            if (!this.basketPopupVisible) {
                this.showBasketPopup();
            }
        });

        // Gentle floating animation
        this.tweens.add({
            targets: this.basketContainer,
            y: this.basketContainer.y - 4,
            duration: 4000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    showBasketPopup() {
        if (this.basketPopupVisible || this.basket.size === 0) return;

        const { width, height } = this.cameras.main;
        this.basketPopupVisible = true;

        // Create popup container
        this.basketPopupContainer = this.add.container(width/2, height/2);
        this.basketPopupContainer.setDepth(2000);

        // Popup background overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(-width/2, -height/2, width, height);
        this.basketPopupContainer.add(overlay);

        // Popup window
        const popupWidth = Math.min(400, width - 40);
        const popupHeight = Math.min(500, height - 40);

        const popupBg = this.add.graphics();
        popupBg.fillStyle(0xffffff, 0.95);
        popupBg.fillRoundedRect(-popupWidth/2, -popupHeight/2, popupWidth, popupHeight, 20);
        popupBg.lineStyle(2, 0x10b981, 0.8);
        popupBg.strokeRoundedRect(-popupWidth/2, -popupHeight/2, popupWidth, popupHeight, 20);
        this.basketPopupContainer.add(popupBg);

        // Popup title
        const popupTitle = this.add.text(0, -popupHeight/2 + 30, '🛒 Your Basket', {
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: '20px',
            fontWeight: '700',
            color: '#1e293b'
        }).setOrigin(0.5);
        this.basketPopupContainer.add(popupTitle);

        // Close button
        const closeButton = this.add.text(popupWidth/2 - 30, -popupHeight/2 + 30, '✕', {
            fontSize: '20px',
            fontWeight: '700',
            color: '#ef4444',
            backgroundColor: 'rgba(255,255,255,0.8)',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5);
        
        closeButton.setInteractive({ useHandCursor: true });
        closeButton.on('pointerdown', () => {
            this.hideBasketPopup();
        });
        
        this.basketPopupContainer.add(closeButton);

        // Basket items list
        const basketArray = Array.from(this.basket);
        const itemHeight = 50;
        const startY = -popupHeight/2 + 80;

        basketArray.forEach((item, index) => {
            const itemY = startY + (index * itemHeight);
            
            // Item container
            const itemBg = this.add.graphics();
            itemBg.fillStyle(0xf8fafc, 1);
            itemBg.fillRoundedRect(-popupWidth/2 + 20, itemY - 20, popupWidth - 40, 40, 8);
            itemBg.lineStyle(1, 0xe2e8f0, 1);
            itemBg.strokeRoundedRect(-popupWidth/2 + 20, itemY - 20, popupWidth - 40, 40, 8);
            this.basketPopupContainer.add(itemBg);

            // Item icon
            const itemIcon = this.add.text(-popupWidth/2 + 50, itemY, this.getItemIcon(item), {
                fontSize: '24px'
            }).setOrigin(0.5);
            this.basketPopupContainer.add(itemIcon);

            // Item name
            const itemName = this.add.text(-popupWidth/2 + 80, itemY, item.toUpperCase(), {
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: '14px',
                fontWeight: '600',
                color: '#334155'
            }).setOrigin(0, 0.5);
            this.basketPopupContainer.add(itemName);

            // Remove button
            const removeButton = this.add.text(popupWidth/2 - 40, itemY, '✕', {
                fontSize: '16px',
                fontWeight: '700',
                color: '#ffffff',
                backgroundColor: '#ef4444',
                padding: { x: 8, y: 4 }
            }).setOrigin(0.5);
            
            removeButton.setInteractive({ useHandCursor: true });
            removeButton.on('pointerdown', () => {
                this.removeItemFromBasket(item);
            });
            
            this.basketPopupContainer.add(removeButton);
        });

        // Popup animation
        this.basketPopupContainer.setScale(0);
        this.basketPopupContainer.setAlpha(0);
        this.tweens.add({
            targets: this.basketPopupContainer,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });

        // Close popup when clicking overlay
        overlay.setInteractive();
        overlay.on('pointerdown', () => {
            this.hideBasketPopup();
        });
    }

    hideBasketPopup() {
        if (!this.basketPopupVisible || !this.basketPopupContainer) return;

        this.tweens.add({
            targets: this.basketPopupContainer,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            duration: 200,
            ease: 'Back.easeIn',
            onComplete: () => {
                if (this.basketPopupContainer) {
                    this.basketPopupContainer.destroy();
                    this.basketPopupContainer = null;
                }
                this.basketPopupVisible = false;
            }
        });
    }

    removeItemFromBasket(itemName) {
        console.log(`Removing ${itemName} from basket`);
        
        // Remove from basket data
        this.basket.delete(itemName);
        sessionStorage.setItem('basket', JSON.stringify(Array.from(this.basket)));

        // Find and reactivate the item in the market
        const itemContainer = this.itemContainers.find(container => 
            container.itemName === itemName
        );

        if (itemContainer) {
            itemContainer.isInBasket = false;
            
            // Remove checkmark if present
            if (itemContainer.checkmark) {
                const children = itemContainer.list;
                const checkmarkElements = children.filter(child => 
                    child.type === 'Arc' || (child.type === 'Text' && child.text === '✓')
                );
                checkmarkElements.forEach(element => element.destroy());
                itemContainer.checkmark = false;
            }

            // Reactivate item
            this.makeItemActive(itemContainer);
            
            // Animate item back to normal state
            this.tweens.add({
                targets: itemContainer,
                scaleX: 1,
                scaleY: 1,
                alpha: 1,
                duration: 300,
                ease: 'Back.easeOut'
            });
        }

        // Update UI
        this.updateBasketUI();
        this.updateUI();
        
        // Hide current popup
        this.hideBasketPopup();
        
        // Refresh navigation to update button states
        this.time.delayedCall(100, () => {
            this.createModernNavigation();
            
            // Show updated popup if items remain
            if (this.basket.size > 0) {
                this.time.delayedCall(150, () => this.showBasketPopup());
            }
        });

        // Success feedback
        this.cameras.main.flash(100, 59, 130, 246, false);
    }

    createModernItems() {
        const { width, height } = this.cameras.main;
        const items = this.levelData.available;

        const cols = 3;
        const size = Math.round(105 * this.scaleFactor);
        const spacingX = Math.round(135 * this.scaleFactor);
        const spacingY = Math.round(115 * this.scaleFactor);
        const startY = Math.round(150 * this.scaleFactor);
        const centerOffset = -35;

        items.forEach((item, idx) => {
            const row = Math.floor(idx / cols);
            const col = idx % cols;

            const x = (width/2 + centerOffset) + (col - 1) * spacingX;
            const y = startY + row * spacingY;

            this.createModernItem(x, y, item, size, idx);
        });
    }

    createModernItem(x, y, item, size, index) {
        const container = this.add.container(x, y);
        container.itemName = item;
        container.originalX = x;
        container.originalY = y;
        container.isInBasket = this.basket.has(item);
        container.isDragEnabled = true;
        container.itemIndex = index;

        const outerGlow = this.add.graphics();
        const itemColor = this.getModernColor(item);
        outerGlow.lineStyle(2, itemColor, 0.4);
        outerGlow.strokeRoundedRect(-size/2 - 1, -size/2 - 1, size + 2, size + 2, 12);

        const shadow = this.add.graphics();
        shadow.fillStyle(0x000000, 0.15);
        shadow.fillRoundedRect(-size/2 + 2, -size/2 + 2, size - 4, size - 4, 10);

        const bg = this.add.graphics();
        bg.fillStyle(0xffffff, 0.95);
        bg.fillRoundedRect(-size/2, -size/2, size, size, 10);
        bg.lineStyle(1, itemColor, 0.3);
        bg.strokeRoundedRect(-size/2, -size/2, size, size, 10);

        const emoji = this.add.text(0, -size/6, this.getItemIcon(item), {
            fontSize: Math.round(size * 0.35)
        }).setOrigin(0.5);

        const name = this.add.text(0, size/3, item.toUpperCase(), {
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontSize: Math.round(9 * this.scaleFactor),
            fontWeight: '600',
            color: '#334155'
        }).setOrigin(0.5);

        container.add([shadow, outerGlow, bg, emoji, name]);
        container.setSize(size, size);

        container.outerGlow = outerGlow;
        container.bg = bg;
        container.emoji = emoji;
        container.shadow = shadow;
        container.nameText = name;
        container.itemColor = itemColor;
        container.itemSize = size;

        if (container.isInBasket) {
            this.makeItemInactive(container);
        } else {
            this.makeItemActive(container);
            container.setVisible(true);
            container.setAlpha(1);
            container.setScale(1);
        }

        this.itemContainers.push(container);

        container.setScale(0);
        container.setAlpha(0);
        this.tweens.add({
            targets: container,
            scaleX: container.isInBasket ? 0.85 : 1,
            scaleY: container.isInBasket ? 0.85 : 1,
            alpha: container.isInBasket ? 0.4 : 1,
            duration: 500,
            delay: index * 70,
            ease: 'Back.easeOut',
            onComplete: () => {
                if (!container.isInBasket) {
                    container.setVisible(true);
                    container.setAlpha(1);
                }
            }
        });

        this.tweens.add({
            targets: container,
            y: y - 3,
            duration: 4000 + Math.random() * 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: Math.random() * 2000
        });
    }

    createModernNavigation() {
        const { width, height } = this.cameras.main;
        
        this.children.list.forEach(child => {
            if (child.getData && child.getData('isNavElement')) {
                child.destroy();
            }
        });
        
        // Level indicator
        const levelBg = this.add.graphics();
        levelBg.fillStyle(0xffffff, 0.8); // CHANGED: Light white
        levelBg.fillRoundedRect(15, 15, 85, 25, 8);
        levelBg.lineStyle(1, 0x6366f1, 0.3);
        levelBg.strokeRoundedRect(15, 15, 85, 25, 8);
        levelBg.setDepth(500);
        levelBg.setData('isNavElement', true);
        
        const levelText = this.add.text(57, 27, `Level ${this.currentLevel}`, {
            fontSize: '11px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '600',
            color: '#1e293b' // CHANGED: Dark grey text
        }).setOrigin(0.5).setDepth(501);
        levelText.setData('isNavElement', true);
        
        // Basket indicator
        const basketIndicatorBg = this.add.graphics();
        basketIndicatorBg.fillStyle(0xffffff, 0.8); // CHANGED: Light white
        basketIndicatorBg.fillRoundedRect(width - 100, 15, 85, 25, 8);
        basketIndicatorBg.lineStyle(1, 0x10b981, 0.3);
        basketIndicatorBg.strokeRoundedRect(width - 100, 15, 85, 25, 8);
        basketIndicatorBg.setDepth(500);
        basketIndicatorBg.setData('isNavElement', true);
        
        const basketIndicatorText = this.add.text(width - 57, 27, `Items: ${this.basket.size}`, {
            fontSize: '11px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '600',
            color: '#1e293b' // CHANGED: Dark grey text
        }).setOrigin(0.5).setDepth(501);
        basketIndicatorText.setData('isNavElement', true);
        
        const buttonY = height - 30;
        
        // Back button
        this.backButton = this.createModernButton(
            65, buttonY, 100, 32, 0xf87171, 'Back', 12, () => this.goToMainMenu(), true // CHANGED: Soft red
        );
        this.backButton.setDepth(501);
        this.backButton.setData('isNavElement', true);
        
        // Conditional buttons based on basket state
        const hasItems = this.basket.size > 0;
        
        if (hasItems) {
            const submitButton = this.createModernButton(
                width - 75, buttonY, 140, 32, 0x10b981, 
                `Submit (${this.basket.size})`, 12, () => this.submitOrder(), true
            );
            submitButton.setDepth(501);
            submitButton.setData('isNavElement', true);
            
            const clearButton = this.createModernButton(
                width/2, buttonY, 110, 32, 0xfbbf24, 
                'Clear Basket', 11, () => this.clearBasket(), true // CHANGED: Soft amber
            );
            clearButton.setDepth(501);
            clearButton.setData('isNavElement', true);
        } else {
            // Disabled buttons when basket is empty
            const disabledSubmitButton = this.createModernButton(
                width - 75, buttonY, 140, 32, 0x9ca3af, 
                'Submit (0)', 12, null, false // CHANGED: Soft grey
            );
            disabledSubmitButton.setDepth(501);
            disabledSubmitButton.setData('isNavElement', true);
            
            const disabledClearButton = this.createModernButton(
                width/2, buttonY, 110, 32, 0x9ca3af, 
                'Clear Basket', 11, null, false // CHANGED: Soft grey
            );
            disabledClearButton.setDepth(501);
            disabledClearButton.setData('isNavElement', true);
        }
    }

    createModernButton(x, y, width, height, color, text, fontSize, callback, enabled = true) {
        const container = this.add.container(x, y);
        
        const shadow = this.add.graphics();
        shadow.fillStyle(0x000000, enabled ? 0.2 : 0.1);
        shadow.fillRoundedRect(-width/2 + 1, -height/2 + 1, width, height, 8);
        
        const bg = this.add.graphics();
        bg.fillStyle(color, enabled ? 0.9 : 0.5);
        bg.fillRoundedRect(-width/2, -height/2, width, height, 8);
        bg.lineStyle(1, 0xffffff, enabled ? 0.3 : 0.1);
        bg.strokeRoundedRect(-width/2, -height/2, width, height, 8);

        const buttonText = this.add.text(0, 0, text, {
            fontSize: `${fontSize}px`,
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '600',
            color: enabled ? '#ffffff' : '#94a3b8'
        }).setOrigin(0.5);

        container.add([shadow, bg, buttonText]);
        container.setSize(width, height);
        
        if (enabled && callback) {
            container.setInteractive({ useHandCursor: true });

            container.on('pointerover', () => {
                this.tweens.add({
                    targets: container,
                    scaleX: 1.03,
                    scaleY: 1.03,
                    duration: 200,
                    ease: 'Back.easeOut'
                });

                bg.clear();
                bg.fillStyle(this.lightenColor(color, 0.15), 1);
                bg.fillRoundedRect(-width/2, -height/2, width, height, 8);
                bg.lineStyle(2, 0xffffff, 0.5);
                bg.strokeRoundedRect(-width/2, -height/2, width, height, 8);
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
                bg.fillRoundedRect(-width/2, -height/2, width, height, 8);
                bg.lineStyle(1, 0xffffff, 0.3);
                bg.strokeRoundedRect(-width/2, -height/2, width, height, 8);
            });

            container.on('pointerdown', () => {
                this.tweens.add({
                    targets: container,
                    scaleX: 0.97,
                    scaleY: 0.97,
                    duration: 100,
                    yoyo: true,
                    ease: 'Power2.easeInOut',
                    onComplete: () => {
                        this.createSuccessExplosion(x, y);
                        this.time.delayedCall(100, callback);
                    }
                });
            });
        }

        return container;
    }

    getModernColor(item) {
        // CHANGED: All soft pastel colors
        const colors = {
            'bread': 0xfbbf24,     // Soft amber
            'lettuce': 0x10b981,   // Soft emerald  
            'tomato': 0xf87171,    // Soft red
            'cheese': 0xfde047,    // Soft yellow
            'meat': 0xa78bfa,      // Soft purple
            'onion': 0xa8a29e,     // Soft stone
            'pickle': 0x84cc16,    // Soft lime
            'sauce': 0xff8500,     // Soft orange
            'mushroom': 0x8b5cf6,  // Soft violet
            'dough': 0xfde047,     // Soft yellow
            'pepperoni': 0xf87171, // Soft red
            'olive': 0x84cc16,     // Soft lime
            'bell-pepper': 0xff8500, // Soft orange
            'sausage': 0xa78bfa,   // Soft purple
            'pineapple': 0xfbbf24, // Soft amber
            'spinach': 0x10b981    // Soft emerald
        };
        return colors[item] || 0x9ca3af; // Soft grey default
    }

    makeItemActive(container) {
        container.isDragEnabled = true;
        container.setInteractive({ useHandCursor: true });
        this.input.setDraggable(container);
        
        container.setVisible(true);
        container.setAlpha(1);
        container.setScale(1);
        
        this.addItemHoverEffects(container);
        
        container.on('pointerdown', () => {
            if (!this.isDragging) {
                this.selectItemDirectly(container.itemName, container);
            }
        });
    }

    makeItemInactive(container) {
        container.isDragEnabled = false;
        container.removeInteractive();
        container.alpha = 0.4;
        container.setScale(0.85);
        
        container.removeAllListeners();
        
        if (!container.checkmark) {
            this.addProfessionalCheckmark(container);
        }
    }

    addItemHoverEffects(container) {
        const { itemColor, itemSize } = container;
        
        container.on('pointerover', () => {
            if (container.isDragEnabled && !this.isDragging) {
                this.tweens.add({
                    targets: container,
                    scaleX: 1.08,
                    scaleY: 1.08,
                    duration: 200,
                    ease: 'Back.easeOut'
                });

                container.outerGlow.clear();
                container.outerGlow.lineStyle(3, itemColor, 0.8);
                container.outerGlow.strokeRoundedRect(-itemSize/2 - 2, -itemSize/2 - 2, itemSize + 4, itemSize + 4, 12);

                container.bg.clear();
                container.bg.fillStyle(0xffffff, 1);
                container.bg.fillRoundedRect(-itemSize/2, -itemSize/2, itemSize, itemSize, 10);
                container.bg.lineStyle(2, itemColor, 0.6);
                container.bg.strokeRoundedRect(-itemSize/2, -itemSize/2, itemSize, itemSize, 10);

                this.tweens.add({
                    targets: container.emoji,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    y: container.emoji.y - 3,
                    duration: 200,
                    ease: 'Back.easeOut'
                });
            }
        });

        container.on('pointerout', () => {
            if (container.isDragEnabled && !this.isDragging) {
                this.tweens.add({
                    targets: container,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 200,
                    ease: 'Back.easeOut'
                });

                container.outerGlow.clear();
                container.outerGlow.lineStyle(2, itemColor, 0.4);
                container.outerGlow.strokeRoundedRect(-itemSize/2 - 1, -itemSize/2 - 1, itemSize + 2, itemSize + 2, 12);

                container.bg.clear();
                container.bg.fillStyle(0xffffff, 0.95);
                container.bg.fillRoundedRect(-itemSize/2, -itemSize/2, itemSize, itemSize, 10);
                container.bg.lineStyle(1, itemColor, 0.3);
                container.bg.strokeRoundedRect(-itemSize/2, -itemSize/2, itemSize, itemSize, 10);

                this.tweens.add({
                    targets: container.emoji,
                    scaleX: 1,
                    scaleY: 1,
                    y: -itemSize/6,
                    duration: 200,
                    ease: 'Back.easeOut'
                });
            }
        });
    }

    setupRobustDragDropSystem() {
        this.input.off('dragstart');
        this.input.off('drag');
        this.input.off('dragend');
        
        this.resetDragState();

        this.input.on('dragstart', (pointer, gameObject) => {
            if (this.isDragging || !gameObject.isDragEnabled) {
                return;
            }
            
            this.isDragging = true;
            this.draggedItem = gameObject;
            this.draggedItemOriginalState = {
                x: gameObject.x,
                y: gameObject.y,
                scaleX: gameObject.scaleX,
                scaleY: gameObject.scaleY
            };
            
            gameObject.setDepth(1000);
            
            this.tweens.add({
                targets: gameObject,
                scaleX: 1.15,
                scaleY: 1.15,
                duration: 150,
                ease: 'Back.easeOut'
            });

            this.createProfessionalTrail(gameObject);
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            if (gameObject !== this.draggedItem || !this.isDragging) {
                return;
            }
            
            this.tweens.add({
                targets: gameObject,
                x: dragX,
                y: dragY,
                duration: 50,
                ease: 'Power2.easeOut'
            });
        });

        this.input.on('dragend', (pointer, gameObject) => {
            if (gameObject !== this.draggedItem || !this.isDragging) {
                return;
            }

            const droppedInBasket = this.isOverBasket(gameObject);
            
            if (droppedInBasket) {
                this.processBasketDrop(gameObject);
            } else {
                this.returnItemToOriginalPosition(gameObject);
            }
            
            this.resetDragState();
        });
    }

    // ========== MISSING METHODS ADDED BELOW ==========

    resetDragState() {
        if (this.activeTrailTimer) {
            this.activeTrailTimer.remove();
            this.activeTrailTimer = null;
        }
        
        if (this.draggedItem) {
            this.draggedItem.setDepth(0);
        }
        
        this.isDragging = false;
        this.draggedItem = null;
        this.draggedItemOriginalState = null;
    }

    createProfessionalTrail(gameObject) {
        if (this.activeTrailTimer) {
            this.activeTrailTimer.remove();
        }
        
        this.activeTrailTimer = this.time.addEvent({
            delay: 40,
            loop: true,
            callback: () => {
                if (this.isDragging && this.draggedItem === gameObject) {
                    const trail = this.add.circle(gameObject.x, gameObject.y, 
                        Phaser.Math.Between(2, 4), 0x10b981, 0.6);
                    trail.setDepth(999);
                    
                    this.tweens.add({
                        targets: trail,
                        alpha: 0,
                        scale: 0,
                        duration: 600,
                        ease: 'Power2.easeOut',
                        onComplete: () => trail.destroy()
                    });
                }
            }
        });
    }

    isOverBasket(gameObject) {
        if (!this.basketContainer || !gameObject) return false;
        
        const basketBounds = this.basketContainer.getBounds();
        const objBounds = gameObject.getBounds();
        
        const tolerance = 15;
        basketBounds.x -= tolerance;
        basketBounds.y -= tolerance;
        basketBounds.width += tolerance * 2;
        basketBounds.height += tolerance * 2;
        
        return Phaser.Geom.Rectangle.Overlaps(basketBounds, objBounds);
    }

    processBasketDrop(container) {
        const item = container.itemName;
        
        if (this.basket.has(item)) {
            this.showAlreadySelectedFeedback(container);
            this.returnItemToOriginalPosition(container);
            return;
        }

        this.basket.add(item);
        sessionStorage.setItem('basket', JSON.stringify(Array.from(this.basket)));

        this.cameras.main.flash(150, 16, 185, 129, false);

        container.isInBasket = true;
        this.tweens.add({
            targets: container,
            x: container.originalX,
            y: container.originalY,
            scaleX: 0.85,
            scaleY: 0.85,
            alpha: 0.4,
            duration: 400,
            ease: 'Elastic.easeOut',
            onComplete: () => {
                this.makeItemInactive(container);
            }
        });

        this.updateBasketUI();
        this.updateUI();
        this.createSuccessExplosion(container.x, container.y);
        
        this.createModernNavigation();
    }

    returnItemToOriginalPosition(container) {
        this.tweens.add({
            targets: container,
            x: container.originalX,
            y: container.originalY,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Elastic.easeOut'
        });
    }

    selectItemDirectly(item, container) {
        if (this.basket.has(item)) {
            this.showAlreadySelectedFeedback(container);
            return;
        }

        this.basket.add(item);
        sessionStorage.setItem('basket', JSON.stringify(Array.from(this.basket)));

        this.cameras.main.flash(150, 16, 185, 129, false);

        container.isInBasket = true;
        this.tweens.add({
            targets: container,
            scaleX: 0.85,
            scaleY: 0.85,
            alpha: 0.4,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.makeItemInactive(container);
            }
        });

        this.updateBasketUI();
        this.updateUI();
        this.createSuccessExplosion(container.x, container.y);
        
        this.createModernNavigation();
    }

    addProfessionalCheckmark(container) {
        if (container.checkmark) return;
        
        const checkBg = this.add.circle(25, -25, 8, 0x10b981);
        const checkIcon = this.add.text(25, -25, '✓', {
            fontSize: '12px',
            fontWeight: '900',
            color: '#ffffff'
        }).setOrigin(0.5);

        container.add([checkBg, checkIcon]);
        container.checkmark = true;

        checkBg.setScale(0);
        checkIcon.setScale(0);
        
        this.tweens.add({
            targets: [checkBg, checkIcon],
            scaleX: 1,
            scaleY: 1,
            duration: 400,
            ease: 'Elastic.easeOut'
        });
    }

    showAlreadySelectedFeedback(container) {
        this.cameras.main.flash(120, 249, 115, 22, false);
        
        this.tweens.add({
            targets: container,
            x: container.x + 8,
            duration: 80,
            repeat: 4,
            yoyo: true,
            ease: 'Power2.easeInOut',
            onComplete: () => {
                container.x = container.originalX;
            }
        });
    }

    updateBasketUI() {
        this.basketCountText.setText(`${this.basket.size} items`);
        
        this.tweens.add({
            targets: this.basketContainer,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 250,
            yoyo: true,
            ease: 'Elastic.easeOut'
        });
    }

    createSuccessExplosion(x, y) {
        for (let i = 0; i < 15; i++) {
            const particle = this.add.circle(x, y, 
                Phaser.Math.Between(2, 5), 0x10b981, 0.8);
            
            this.tweens.add({
                targets: particle,
                x: x + Phaser.Math.Between(-100, 100),
                y: y + Phaser.Math.Between(-100, 100),
                alpha: 0,
                scale: 0,
                duration: Phaser.Math.Between(600, 1000),
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    lightenColor(color, amount) {
        const r = Math.min(255, ((color >> 16) & 0xff) + Math.round(255 * amount));
        const g = Math.min(255, ((color >> 8) & 0xff) + Math.round(255 * amount));
        const b = Math.min(255, (color & 0xff) + Math.round(255 * amount));
        return (r << 16) | (g << 8) | b;
    }

    clearBasket() {
        this.basket.clear();
        sessionStorage.removeItem('basket');
        
        this.itemContainers.forEach(container => {
            if (container.isInBasket) {
                container.isInBasket = false;
                container.alpha = 1;
                container.setScale(1);
                
                if (container.checkmark) {
                    const children = container.list;
                    const checkmarkElements = children.filter(child => 
                        child.type === 'Arc' || (child.type === 'Text' && child.text === '✓')
                    );
                    checkmarkElements.forEach(element => element.destroy());
                    container.checkmark = false;
                }
                
                this.makeItemActive(container);
            }
        });
        
        this.updateBasketUI();
        this.updateUI();
        this.createModernNavigation();
        this.cameras.main.flash(100, 59, 130, 246, false);
    }

    goToMainMenu() {
        this.cameras.main.fadeOut(600, 239, 68, 68);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            sessionStorage.removeItem('basket');
            if (typeof window !== 'undefined' && window.navigateToScene) {
                window.navigateToScene('menu');
            }
        });
    }

    submitOrder() {
        this.cameras.main.fadeOut(600, 16, 185, 129);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            if (typeof window !== 'undefined' && window.navigateToScene) {
                window.navigateToScene('result');
            }
        });
    }

    getItemIcon(item) {
        const icons = {
            'bread': '🍞', 'lettuce': '🥬', 'tomato': '🍅', 'cheese': '🧀',
            'meat': '🥩', 'onion': '🧅', 'pickle': '🥒', 'sauce': '🍅',
            'mushroom': '🍄', 'dough': '🥖', 'pepperoni': '🍕', 'olive': '🫒',
            'bell-pepper': '🫑', 'sausage': '🌭', 'pineapple': '🍍', 'spinach': '🥬'
        };
        return icons[item] || '🍽️';
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
        if (window.updateGameUI) {
            window.updateGameUI();
        }
        
        if (typeof document !== 'undefined') {
            const levelElement = document.getElementById('current-level');
            const basketElement = document.getElementById('basket-count');
            
            if (levelElement) {
                levelElement.textContent = this.currentLevel;
            }
            
            if (basketElement) {
                basketElement.textContent = this.basket.size;
            }
        }
    }

    shutdown() {
        this.resetDragState();
        this.time.removeAllEvents();
        this.input.removeAllListeners();
        
        this.itemContainers.forEach(container => {
            if (container) {
                container.removeAllListeners();
            }
        });
        this.itemContainers = [];

        if (this.animationManager) {
            this.animationManager.destroy();
        }
    }
}
