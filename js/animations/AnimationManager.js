class AnimationManager {
    constructor(scene) {
        this.scene = scene;
        this.activeAnimations = new Set();
    }
    
    // Enhanced entrance animations
    createEntranceAnimation(target, type = 'fade', delay = 0) {
        if (!target || !this.scene) return null;
        
        const animations = {
            fade: () => this.fadeIn(target, delay),
            slideUp: () => this.slideUp(target, delay),
            slideDown: () => this.slideDown(target, delay),
            bounce: () => this.bounceIn(target, delay),
            elastic: () => this.elasticIn(target, delay),
            zoom: () => this.zoomIn(target, delay),
            bounceIn: () => this.bounceIn(target, delay)
        };
        
        return animations[type] ? animations[type]() : animations.fade();
    }
    
    fadeIn(target, delay = 0) {
        if (!target || !this.scene) return null;
        
        target.setAlpha(0);
        const tween = this.scene.tweens.add({
            targets: target,
            alpha: 1,
            duration: 800,
            delay: delay,
            ease: 'Power2.easeOut',
            onComplete: () => this.activeAnimations.delete(tween)
        });
        this.activeAnimations.add(tween);
        return tween;
    }
    
    slideUp(target, delay = 0) {
        if (!target || !this.scene) return null;
        
        const originalY = target.y;
        target.y += 100;
        target.setAlpha(0);
        
        const tween = this.scene.tweens.add({
            targets: target,
            y: originalY,
            alpha: 1,
            duration: 1000,
            delay: delay,
            ease: 'Back.easeOut',
            onComplete: () => this.activeAnimations.delete(tween)
        });
        this.activeAnimations.add(tween);
        return tween;
    }
    
    bounceIn(target, delay = 0) {
        if (!target || !this.scene) return null;
        
        target.setScale(0);
        target.setAlpha(0);
        
        const tween = this.scene.tweens.add({
            targets: target,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 1200,
            delay: delay,
            ease: 'Bounce.easeOut',
            onComplete: () => this.activeAnimations.delete(tween)
        });
        this.activeAnimations.add(tween);
        return tween;
    }
    
    elasticIn(target, delay = 0) {
        if (!target || !this.scene) return null;
        
        target.setScale(0);
        
        const tween = this.scene.tweens.add({
            targets: target,
            scaleX: 1,
            scaleY: 1,
            duration: 1500,
            delay: delay,
            ease: 'Elastic.easeOut',
            onComplete: () => this.activeAnimations.delete(tween)
        });
        this.activeAnimations.add(tween);
        return tween;
    }
    
    zoomIn(target, delay = 0) {
        if (!target || !this.scene) return null;
        
        target.setScale(0);
        target.setAlpha(0);
        
        const tween = this.scene.tweens.add({
            targets: target,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            duration: 800,
            delay: delay,
            ease: 'Back.easeOut',
            onComplete: () => this.activeAnimations.delete(tween)
        });
        this.activeAnimations.add(tween);
        return tween;
    }
    
    // Button hover effects
    createHoverEffect(button, scale = 1.1) {
        if (!button || !this.scene) return;
        
        button.on('pointerover', () => {
            this.scene.tweens.add({
                targets: button,
                scaleX: scale,
                scaleY: scale,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });
        
        button.on('pointerout', () => {
            this.scene.tweens.add({
                targets: button,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Back.easeOut'
            });
        });
    }
    
    // Floating animation
    createFloatingAnimation(target, amplitude = 10, duration = 3000) {
        if (!target || !this.scene) return null;
        
        const tween = this.scene.tweens.add({
            targets: target,
            y: target.y - amplitude,
            duration: duration,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
        this.activeAnimations.add(tween);
        return tween;
    }
    
    // Particle effects
    createParticleExplosion(x, y, color = 0xffffff, count = 15) {
        if (!this.scene) return;
        
        for (let i = 0; i < count; i++) {
            const particle = this.scene.add.circle(x, y, 
                Phaser.Math.Between(2, 6), color, 0.8);
            
            this.scene.tweens.add({
                targets: particle,
                x: x + Phaser.Math.Between(-150, 150),
                y: y + Phaser.Math.Between(-150, 150),
                alpha: 0,
                scale: 0,
                duration: Phaser.Math.Between(800, 1500),
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }
    
    // Scene transition effects
    createSceneTransition(callback, type = 'fade') {
        if (!this.scene || !callback) return;
        
        switch (type) {
            case 'fade':
                this.scene.cameras.main.fadeOut(500);
                this.scene.cameras.main.once('camerafadeoutcomplete', callback);
                break;
            case 'slide':
                this.scene.cameras.main.pan(
                    this.scene.cameras.main.centerX + this.scene.cameras.main.width,
                    this.scene.cameras.main.centerY,
                    500,
                    'Power2'
                );
                this.scene.time.delayedCall(500, callback);
                break;
            case 'zoom':
                this.scene.cameras.main.zoomTo(0, 500);
                this.scene.time.delayedCall(500, callback);
                break;
            default:
                callback();
        }
    }
    
    // Cleanup
    destroy() {
        this.activeAnimations.forEach(tween => {
            if (tween && tween.stop) tween.stop();
        });
        this.activeAnimations.clear();
    }
}
