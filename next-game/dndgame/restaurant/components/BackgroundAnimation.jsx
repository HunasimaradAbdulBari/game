// components/BackgroundAnimation.jsx
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function BackgroundAnimation() {
  const router = useRouter();
  const bubblesRef = useRef([]);
  const pyramidsRef = useRef([]);
  const gradientRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Only exclude result page, allow all others
  if (router.pathname === '/result') {
    return null;
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let gsap = null;
    let animations = [];

    const loadGSAP = async () => {
      try {
        const { gsap: gsapModule } = await import('gsap');
        gsap = gsapModule;

        // Enhanced bubble animations with GSAP
        bubblesRef.current.forEach((bubble, index) => {
          if (!bubble) return;

          // Floating animation with random paths
          const floatTween = gsap.to(bubble, {
            y: gsap.utils.random(-40, 40),
            x: gsap.utils.random(-30, 30),
            duration: gsap.utils.random(4, 8),
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            delay: gsap.utils.random(0, 3)
          });

          // Rotation animation
          const rotateTween = gsap.to(bubble, {
            rotation: gsap.utils.random(0, 360),
            duration: gsap.utils.random(15, 25),
            repeat: -1,
            ease: "none",
            delay: gsap.utils.random(0, 5)
          });

          // Scale pulsing
          const scaleTween = gsap.to(bubble, {
            scale: gsap.utils.random(0.8, 1.3),
            duration: gsap.utils.random(3, 6),
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            delay: gsap.utils.random(0, 2)
          });

          // Opacity breathing effect
          const opacityTween = gsap.to(bubble, {
            opacity: gsap.utils.random(0.3, 0.8),
            duration: gsap.utils.random(2, 5),
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            delay: gsap.utils.random(0, 2)
          });

          animations.push(floatTween, rotateTween, scaleTween, opacityTween);
        });

        // Enhanced pyramid animations with GSAP
        pyramidsRef.current.forEach((pyramid, index) => {
          if (!pyramid) return;

          // 3D drift animation
          const driftTween = gsap.to(pyramid, {
            y: gsap.utils.random(-50, 50),
            x: gsap.utils.random(-40, 40),
            rotationX: gsap.utils.random(-30, -10),
            duration: gsap.utils.random(8, 15),
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            delay: gsap.utils.random(0, 4)
          });

          // Continuous Y rotation (enhanced)
          const spinTween = gsap.to(pyramid.querySelector('.wrapper'), {
            rotationY: 360,
            duration: gsap.utils.random(6, 12),
            repeat: -1,
            ease: "none",
            delay: gsap.utils.random(0, 3)
          });

          // Scale animation
          const pyramidScaleTween = gsap.to(pyramid, {
            scale: gsap.utils.random(0.7, 1.2),
            duration: gsap.utils.random(4, 8),
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            delay: gsap.utils.random(0, 3)
          });

          animations.push(driftTween, spinTween, pyramidScaleTween);
        });

        // Enhanced background gradient animation
        if (gradientRef.current) {
          const gradientTween = gsap.to(gradientRef.current, {
            rotation: 360,
            duration: 20,
            repeat: -1,
            ease: "none"
          });

          // Add breathing effect to background
          const breatheTween = gsap.to(gradientRef.current, {
            scale: gsap.utils.random(1, 1.1),
            duration: gsap.utils.random(8, 12),
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
          });

          animations.push(gradientTween, breatheTween);
        }

        // Additional floating particles animation
        const createFloatingParticles = () => {
          const particles = document.querySelectorAll('.floating-particle');
          particles.forEach((particle, index) => {
            if (!particle) return;

            const particleTween = gsap.to(particle, {
              y: gsap.utils.random(-100, 100),
              x: gsap.utils.random(-80, 80),
              rotation: gsap.utils.random(0, 360),
              scale: gsap.utils.random(0.5, 1.5),
              opacity: gsap.utils.random(0.2, 0.9),
              duration: gsap.utils.random(5, 12),
              repeat: -1,
              yoyo: true,
              ease: "power2.inOut",
              delay: gsap.utils.random(0, 4)
            });

            animations.push(particleTween);
          });
        };

        createFloatingParticles();

      } catch (error) {
        console.log('GSAP not available, using CSS animations');
      }
    };

    loadGSAP();

    return () => {
      // Cleanup GSAP animations
      animations.forEach(animation => {
        if (animation && animation.kill) {
          animation.kill();
        }
      });
      animations = [];
    };
  }, [mounted, router.pathname]);

  if (!mounted) return null;

  return (
    <div className="background-animation-container">
      {/* Enhanced Floating Bubbles */}
      <div className="bubble-container">
        {[...Array(5)].map((_, index) => (
          <div 
            key={index}
            className={`bubble bubble-${index + 1}`}
            ref={el => bubblesRef.current[index] = el}
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        ))}
      </div>

      {/* Enhanced Floating Pyramids */}
      <div 
        className="pyramid-loader pyramid-1"
        ref={el => pyramidsRef.current[0] = el}
      >
        <div className="wrapper">
          <span className="side side1"></span>
          <span className="side side2"></span>
          <span className="side side3"></span>
          <span className="side side4"></span>
          <span className="shadow"></span>
        </div>
      </div>

      <div 
        className="pyramid-loader pyramid-2"
        ref={el => pyramidsRef.current[1] = el}
      >
        <div className="wrapper">
          <span className="side side1"></span>
          <span className="side side2"></span>
          <span className="side side3"></span>
          <span className="side side4"></span>
          <span className="shadow"></span>
        </div>
      </div>

      {/* Additional Floating Particles for Enhanced Effect */}
      <div className="floating-particles">
        {[...Array(12)].map((_, index) => (
          <div 
            key={index}
            className={`floating-particle particle-${index + 1}`}
          />
        ))}
      </div>

      {/* Enhanced Background Gradient */}
      <div 
        className="enhanced-gradient-bg"
        ref={gradientRef}
      />

      {/* ALL THE CSS STYLES - ENHANCED WITH GSAP-FRIENDLY ANIMATIONS */}
      <style jsx>{`
        .background-animation-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
          background: linear-gradient(135deg, #e3f2fd 0%, #f8fdff 50%, #ffffff 100%);
        }

        /* Enhanced rotating gradient background */
        .enhanced-gradient-bg {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(
            from 0deg,
            rgba(187, 222, 251, 0.4),
            rgba(144, 202, 249, 0.5),
            rgba(100, 181, 246, 0.4),
            rgba(66, 165, 245, 0.3),
            rgba(33, 150, 243, 0.4),
            rgba(30, 136, 229, 0.5),
            rgba(25, 118, 210, 0.4),
            rgba(187, 222, 251, 0.4)
          );
          transform: translate(-50%, -50%);
          filter: blur(80px);
          opacity: 0.5;
          will-change: transform, scale;
        }

        .background-animation-container::before,
        .background-animation-container::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 180%;
          height: 180%;
          background: conic-gradient(
            from 0deg,
            rgba(187, 222, 251, 0.2),
            rgba(144, 202, 249, 0.3),
            rgba(100, 181, 246, 0.2),
            rgba(66, 165, 245, 0.1),
            rgba(33, 150, 243, 0.2),
            rgba(30, 136, 229, 0.3),
            rgba(25, 118, 210, 0.2),
            rgba(187, 222, 251, 0.2)
          );
          transform: translate(-50%, -50%);
          animation: rotate-reverse 25s linear infinite;
          filter: blur(60px);
          opacity: 0.3;
        }

        .background-animation-container::after {
          width: 160%;
          height: 160%;
          animation: rotate 30s linear infinite;
          opacity: 0.2;
        }

        /* Bubble Container */
        .bubble-container {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        /* Enhanced Bubbles with GSAP-friendly properties */
        .bubble {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          box-shadow: inset 0 0 25px rgba(33, 150, 243, 0.15);
          opacity: 0.6;
          will-change: transform, opacity, scale;
        }

        .bubble-1 {
          top: 10%;
          left: 10%;
          transform: scale(0.6);
        }

        .bubble-2 {
          top: 20%;
          right: 15%;
          transform: scale(0.4);
        }

        .bubble-3 {
          top: 60%;
          left: 20%;
          transform: scale(0.5);
        }

        .bubble-4 {
          bottom: 20%;
          right: 20%;
          transform: scale(0.3);
        }

        .bubble-5 {
          bottom: 10%;
          left: 50%;
          transform: scale(0.45);
        }

        .bubble::before {
          content: '';
          position: absolute;
          top: 30px;
          left: 35px;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.8);
          z-index: 10;
          filter: blur(1px);
        }

        .bubble::after {
          content: '';
          position: absolute;
          top: 50px;
          left: 60px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          z-index: 10;
          filter: blur(1px);
        }

        .bubble span {
          position: absolute;
          border-radius: 50%;
        }

        .bubble span:nth-child(1) {
          inset: 8px;
          border-left: 10px solid rgba(33, 150, 243, 0.3);
          filter: blur(6px);
        }

        .bubble span:nth-child(2) {
          inset: 8px;
          border-right: 10px solid rgba(100, 181, 246, 0.4);
          filter: blur(6px);
        }

        .bubble span:nth-child(3) {
          inset: 8px;
          border-top: 10px solid rgba(187, 222, 251, 0.5);
          filter: blur(6px);
        }

        .bubble span:nth-child(4) {
          inset: 20px;
          border-left: 10px solid rgba(144, 202, 249, 0.3);
          filter: blur(8px);
        }

        .bubble span:nth-child(5) {
          inset: 8px;
          border-bottom: 8px solid rgba(255, 255, 255, 0.4);
          filter: blur(6px);
          transform: rotate(330deg);
        }

        /* Enhanced Pyramids with GSAP-friendly properties */
        .pyramid-loader {
          position: absolute;
          width: 80px;
          height: 80px;
          display: block;
          transform-style: preserve-3d;
          transform: rotateX(-20deg);
          opacity: 0.4;
          pointer-events: none;
          will-change: transform, scale, opacity;
        }

        .pyramid-1 {
          top: 15%;
          right: 25%;
        }

        .pyramid-2 {
          bottom: 25%;
          left: 15%;
        }

        .wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          will-change: transform;
        }

        .pyramid-loader .wrapper .side {
          width: 50px;
          height: 50px;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          transform-origin: center top;
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }

        .pyramid-loader .wrapper .side1 {
          transform: rotateZ(-30deg) rotateY(90deg);
          background: conic-gradient(
            rgba(33, 150, 243, 0.4),
            rgba(100, 181, 246, 0.3),
            rgba(187, 222, 251, 0.4),
            rgba(144, 202, 249, 0.3)
          );
        }

        .pyramid-loader .wrapper .side2 {
          transform: rotateZ(30deg) rotateY(90deg);
          background: conic-gradient(
            rgba(144, 202, 249, 0.3),
            rgba(187, 222, 251, 0.4),
            rgba(100, 181, 246, 0.3),
            rgba(33, 150, 243, 0.4)
          );
        }

        .pyramid-loader .wrapper .side3 {
          transform: rotateX(30deg);
          background: conic-gradient(
            rgba(187, 222, 251, 0.4),
            rgba(144, 202, 249, 0.3),
            rgba(33, 150, 243, 0.3),
            rgba(100, 181, 246, 0.4)
          );
        }

        .pyramid-loader .wrapper .side4 {
          transform: rotateX(-30deg);
          background: conic-gradient(
            rgba(100, 181, 246, 0.4),
            rgba(33, 150, 243, 0.3),
            rgba(187, 222, 251, 0.3),
            rgba(144, 202, 249, 0.4)
          );
        }

        .pyramid-loader .wrapper .shadow {
          width: 40px;
          height: 40px;
          background: rgba(33, 150, 243, 0.2);
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          transform: rotateX(90deg) translateZ(-30px);
          filter: blur(8px);
        }

        /* Enhanced Floating Particles */
        .floating-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .floating-particle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: radial-gradient(circle, 
            rgba(33, 150, 243, 0.8) 0%, 
            rgba(187, 222, 251, 0.4) 100%);
          box-shadow: 0 0 15px rgba(33, 150, 243, 0.3);
          opacity: 0.6;
          will-change: transform, opacity, scale;
        }

        .particle-1 { top: 5%; left: 5%; }
        .particle-2 { top: 15%; left: 85%; }
        .particle-3 { top: 25%; left: 15%; }
        .particle-4 { top: 35%; right: 10%; }
        .particle-5 { top: 45%; left: 60%; }
        .particle-6 { top: 55%; right: 30%; }
        .particle-7 { top: 65%; left: 25%; }
        .particle-8 { top: 75%; right: 15%; }
        .particle-9 { bottom: 20%; left: 40%; }
        .particle-10 { bottom: 10%; right: 20%; }
        .particle-11 { top: 40%; left: 30%; }
        .particle-12 { bottom: 30%; right: 40%; }

        /* Fallback CSS keyframes */
        @keyframes rotate {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes rotate-reverse {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(-360deg);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .bubble {
            width: 100px;
            height: 100px;
          }
          
          .pyramid-loader {
            width: 60px;
            height: 60px;
          }
          
          .pyramid-loader .wrapper .side {
            width: 35px;
            height: 35px;
          }
          
          .floating-particle {
            width: 6px;
            height: 6px;
          }
        }

        @media (max-width: 480px) {
          .bubble {
            width: 80px;
            height: 80px;
          }
          
          .pyramid-loader {
            width: 50px;
            height: 50px;
          }
          
          .pyramid-loader .wrapper .side {
            width: 30px;
            height: 30px;
          }
          
          .floating-particle {
            width: 4px;
            height: 4px;
          }
        }
      `}</style>
    </div>
  );
}