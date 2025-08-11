// components/Layout.js - CORRECTED VERSION

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';


export default function Layout({ children, scene }) {
  const [mounted, setMounted] = useState(false);
  const bubblesContainerRef = useRef(null);
  const bubblesRef = useRef([]);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || router.pathname === '/result') return;

    // Load GSAP dynamically
    const loadGSAP = async () => {
      try {
        const { gsap } = await import('gsap');
        
        // Create bubbles container
        const container = bubblesContainerRef.current;
        if (!container) return;

        // Clear existing bubbles
        container.innerHTML = '';
        bubblesRef.current = [];

        // Create 20 animated bubbles
        for (let i = 0; i < 20; i++) {
          const bubble = document.createElement('div');
          bubble.className = 'floating-bubble';
          
          const size = Math.random() * 40 + 20; // 20-60px
          bubble.style.width = `${size}px`;
          bubble.style.height = `${size}px`;
          
          container.appendChild(bubble);
          bubblesRef.current.push(bubble);

          // Initial position
          gsap.set(bubble, {
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + size,
            opacity: Math.random() * 0.7 + 0.3,
            scale: Math.random() * 0.5 + 0.5
          });

          // Animation timeline
          const tl = gsap.timeline({ repeat: -1 });
          
          tl.to(bubble, {
            y: -size - 100,
            x: `+=${Math.random() * 200 - 100}`,
            duration: Math.random() * 15 + 10,
            ease: "sine.inOut",
            onComplete: () => {
              // Reset position
              gsap.set(bubble, {
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + size,
                opacity: Math.random() * 0.7 + 0.3,
                scale: Math.random() * 0.5 + 0.5
              });
            }
          });

          // Add subtle floating motion
          gsap.to(bubble, {
            x: `+=${Math.random() * 60 - 30}`,
            duration: Math.random() * 4 + 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: Math.random() * 2
          });

          // Add rotation
          gsap.to(bubble, {
            rotation: 360,
            duration: Math.random() * 20 + 15,
            repeat: -1,
            ease: "none"
          });
        }

        // Handle window resize
        const handleResize = () => {
          bubblesRef.current.forEach(bubble => {
            if (Math.random() > 0.5) {
              gsap.set(bubble, {
                x: Math.random() * window.innerWidth
              });
            }
          });
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          // Cleanup GSAP animations
          gsap.killTweensOf(bubblesRef.current);
        };

      } catch (error) {
        console.log('GSAP not available, falling back to CSS animations');
      }
    };

    loadGSAP();
  }, [mounted, router.pathname]);

  if (!mounted) return null;

  return (
    <>
      {/* Animated Bubbles Container - Only show if not result page */}
      {router.pathname !== '/result' && (
        <div 
          ref={bubblesContainerRef}
          className="animated-bubbles-container"
        />
      )}
      
      <div className={`scene scene-${scene}`}>
        <div className="game-container">
          {children}
        </div>
      </div>
    </>
  );
}