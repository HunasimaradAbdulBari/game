export const gameConfig = {
  type: typeof window !== 'undefined' ? window.Phaser?.AUTO : 'AUTO',
  width: 900,
  height: 650,
  backgroundColor: '#1f2937',
  scale: {
    mode: typeof window !== 'undefined' ? window.Phaser?.Scale.FIT : 'FIT',
    autoCenter: typeof window !== 'undefined' ? window.Phaser?.Scale.CENTER_BOTH : 'CENTER_BOTH',
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
}
