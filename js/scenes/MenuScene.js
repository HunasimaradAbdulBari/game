class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    create() {
        console.log('MenuScene created with level selector');
        const { width, height } = this.cameras.main;
        
        // Get saved progress
        this.maxUnlockedLevel = parseInt(localStorage.getItem('max-unlocked-level') || '1');
        this.currentLevel = parseInt(localStorage.getItem('restaurant-level') || '1');
        
        // Create background
        this.createEnhancedBackground(width, height);
        
        // Create title section
        this.createTitleSection(width, height);
        
        // Create level selector
        this.createLevelSelector(width, height);
        
        // Create bottom buttons
        this.createBottomButtons(width, height);
        
        // Hide loading screen when menu is ready
        this.time.delayedCall(1000, () => {
            if (window.hideLoadingScreen) {
                window.hideLoadingScreen();
            }
        });
    }
    
    createEnhancedBackground(width, height) {
        // Gradient background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x2c3e50, 0x3498db, 0x2980b9, 0x34495e, 1, 1, 1, 1);
        bg.fillRect(0, 0, width, height);
        
        // Floating particles
        for(let i = 0; i < 20; i++) {
            const particle = this.add.circle(
                Phaser.Math.Between(0, width),
                Phaser.Math.Between(0, height),
                Phaser.Math.Between(3, 8),
                0xffffff,
                0.1
            );
            
            this.tweens.add({
                targets: particle,
                y: particle.y - Phaser.Math.Between(20, 50),
                alpha: { from: 0.1, to: 0.3 },
                duration: Phaser.Math.Between(4000, 8000),
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut',
                delay: Math.random() * 3000
            });
        }
    }
    
    createTitleSection(width, height) {
        // Main title
        const title = this.add.text(width/2, height/6, 'Restaurant Master', {
            fontSize: '48px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '800',
            color: '#ffffff',
            stroke: '#2c3e50',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Subtitle
        const subtitle = this.add.text(width/2, height/6 + 60, 'Select Your Level', {
            fontSize: '24px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '600',
            color: '#ecf0f1',
            stroke: '#34495e',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Title animations
        this.tweens.add({
            targets: title,
            scaleX: { from: 1, to: 1.05 },
            scaleY: { from: 1, to: 1.05 },
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        this.tweens.add({
            targets: subtitle,
            alpha: { from: 0.8, to: 1 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createLevelSelector(width, height) {
        const startY = height/2 - 50;
        const levelSpacing = 120;
        const levelsPerRow = 3;
        
        // Level selector title
        this.add.text(width/2, startY - 50, 'Choose Your Challenge:', {
            fontSize: '20px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '700',
            color: '#f39c12'
        }).setOrigin(0.5);
        
        // Create level buttons (3 levels total)
        for(let level = 1; level <= 3; level++) {
            const row = Math.floor((level - 1) / levelsPerRow);
            const col = (level - 1) % levelsPerRow;
            
            const x = width/2 + (col - 1) * levelSpacing;
            const y = startY + row * 100;
            
            this.createLevelButton(x, y, level);
        }
    }
    
    createLevelButton(x, y, level) {
        const isUnlocked = level <= this.maxUnlockedLevel;
        const isCompleted = level < this.maxUnlockedLevel;
        
        // Button container
        const container = this.add.container(x, y);
        
        // Button background
        const bgColor = isUnlocked ? (isCompleted ? 0x27ae60 : 0x3498db) : 0x7f8c8d;
        const bg = this.add.graphics();
        bg.fillStyle(bgColor, 0.9);
        bg.fillRoundedRect(-40, -40, 80, 80, 15);
        bg.lineStyle(3, 0xffffff, 0.8);
        bg.strokeRoundedRect(-40, -40, 80, 80, 15);
        
        // Level number
        const levelText = this.add.text(0, -10, level.toString(), {
            fontSize: '32px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '900',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Status icon
        let statusIcon;
        if (isCompleted) {
            statusIcon = this.add.text(0, 15, '✓', {
                fontSize: '20px',
                color: '#ffffff',
                fontWeight: '900'
            }).setOrigin(0.5);
        } else if (isUnlocked) {
            statusIcon = this.add.text(0, 15, '▶', {
                fontSize: '16px',
                color: '#ffffff',
                fontWeight: '900'
            }).setOrigin(0.5);
        } else {
            statusIcon = this.add.text(0, 15, '🔒', {
                fontSize: '16px'
            }).setOrigin(0.5);
        }
        
        container.add([bg, levelText, statusIcon]);
        
        // Make interactive only if unlocked
        if (isUnlocked) {
            container.setSize(80, 80);
            container.setInteractive({ useHandCursor: true });
            
            // Hover effects
            container.on('pointerover', () => {
                this.tweens.add({
                    targets: container,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 200,
                    ease: 'Back.easeOut'
                });
                
                bg.clear();
                bg.fillStyle(bgColor + 0x222222, 1);
                bg.fillRoundedRect(-40, -40, 80, 80, 15);
                bg.lineStyle(4, 0xffffff, 1);
                bg.strokeRoundedRect(-40, -40, 80, 80, 15);
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
                bg.fillStyle(bgColor, 0.9);
                bg.fillRoundedRect(-40, -40, 80, 80, 15);
                bg.lineStyle(3, 0xffffff, 0.8);
                bg.strokeRoundedRect(-40, -40, 80, 80, 15);
            });
            
            // Click handler
            container.on('pointerdown', () => {
                this.selectLevel(level);
            });
        }
        
        // Entrance animation
        container.setScale(0);
        this.tweens.add({
            targets: container,
            scaleX: 1,
            scaleY: 1,
            duration: 400,
            delay: level * 100,
            ease: 'Back.easeOut'
        });
        
        // Floating animation for unlocked levels
        if (isUnlocked) {
            this.tweens.add({
                targets: container,
                y: y - 5,
                duration: 3000 + Math.random() * 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                delay: Math.random() * 2000
            });
        }
    }
    
    createBottomButtons(width, height) {
        // Reset progress button
        const resetBtn = this.createButton(
            width/2 - 100, height - 80, 180, 45, 0xe74c3c, 'Reset Progress', 16,
            () => this.resetProgress()
        );
        
        // Instructions button
        const helpBtn = this.createButton(
            width/2 + 100, height - 80, 180, 45, 0x9b59b6, 'How to Play', 16,
            () => this.showInstructions()
        );
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
        bg.lineStyle(2, 0xffffff, 0.6);
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
    
    selectLevel(level) {
        console.log(`Selected level: ${level}`);
        
        // Save selected level
        localStorage.setItem('restaurant-level', level);
        
        // Clear any existing basket
        sessionStorage.removeItem('basket');
        
        // Transition to restaurant scene
        this.cameras.main.fadeOut(500, 52, 73, 94);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('RestaurantScene');
        });
    }
    
    resetProgress() {
        // Confirm reset
        const confirmReset = confirm('Are you sure you want to reset all progress? This cannot be undone.');
        
        if (confirmReset) {
            localStorage.removeItem('max-unlocked-level');
            localStorage.setItem('restaurant-level', '1');
            sessionStorage.removeItem('basket');
            
            console.log('Progress reset');
            
            // Restart the scene to refresh UI
            this.scene.restart();
        }
    }
    
    showInstructions() {
        // Create instruction overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.8);
        overlay.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        overlay.setDepth(1000);
        
        const instructionBg = this.add.graphics();
        instructionBg.fillStyle(0xffffff, 0.95);
        instructionBg.fillRoundedRect(100, 100, 700, 450, 20);
        instructionBg.lineStyle(3, 0x3498db, 1);
        instructionBg.strokeRoundedRect(100, 100, 700, 450, 20);
        instructionBg.setDepth(1001);
        
        const instructions = [
            '🎯 HOW TO PLAY RESTAURANT MASTER',
            '',
            '1. Read the customer\'s request carefully',
            '2. Go to the market and collect the right ingredients',
            '3. Drag items to your basket or tap to add them',
            '4. Submit your order to complete the level',
            '5. Get all ingredients correct to unlock the next level!',
            '',
            '💡 Tips:',
            '• Each level gets more challenging',
            '• You can replay completed levels anytime',
            '• Make sure to get ALL required ingredients'
        ];
        
        instructions.forEach((line, index) => {
            const text = this.add.text(450, 140 + (index * 30), line, {
                fontSize: index === 0 ? '20px' : '16px',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                fontWeight: index === 0 ? '800' : '600',
                color: index === 0 ? '#2c3e50' : '#34495e',
                align: 'center'
            }).setOrigin(0.5).setDepth(1002);
        });
        
        // Close button
        const closeBtn = this.add.rectangle(450, 500, 120, 40, 0x3498db);
        closeBtn.setInteractive({ useHandCursor: true });
        closeBtn.setDepth(1002);
        
        const closeText = this.add.text(450, 500, 'GOT IT!', {
            fontSize: '16px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: '700',
            color: '#ffffff'
        }).setOrigin(0.5).setDepth(1003);
        
        closeBtn.on('pointerdown', () => {
            overlay.destroy();
            instructionBg.destroy();
            closeBtn.destroy();
            closeText.destroy();
            instructions.forEach((_, index) => {
                // Remove instruction texts (they'll be garbage collected)
            });
        });
    }
}
