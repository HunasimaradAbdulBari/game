// components/Layout.js

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

export default function Layout({ children, scene }) {
  const [mounted, setMounted] = useState(false);
  const spheresRef = useRef([]);
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
        
        // Animate each sphere with unique bouncing and rotation
        spheresRef.current.forEach((sphere, index) => {
          if (!sphere) return;

          // Random bounce animation
          gsap.to(sphere, {
            y: gsap.utils.random(-15, 15),
            duration: gsap.utils.random(2, 4),
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            delay: gsap.utils.random(0, 2)
          });

          // Random horizontal float
          gsap.to(sphere, {
            x: gsap.utils.random(-20, 20),
            duration: gsap.utils.random(3, 5),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: gsap.utils.random(0, 1.5)
          });

          // Rotation for the entire sphere
          gsap.to(sphere, {
            rotation: 360,
            duration: gsap.utils.random(8, 12),
            repeat: -1,
            ease: "none",
            delay: gsap.utils.random(0, 3)
          });

          // Scale pulsing effect
          gsap.to(sphere, {
            scale: gsap.utils.random(0.9, 1.1),
            duration: gsap.utils.random(2.5, 4.5),
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            delay: gsap.utils.random(0, 2.5)
          });

          // Opacity pulsing for glowing effect
          gsap.to(sphere, {
            opacity: gsap.utils.random(0.4, 0.8),
            duration: gsap.utils.random(3, 6),
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            delay: gsap.utils.random(0, 2)
          });
        });

        return () => {
          // Cleanup GSAP animations
          gsap.killTweensOf(spheresRef.current);
        };

      } catch (error) {
        console.log('GSAP not available');
      }
    };

    loadGSAP();
  }, [mounted, router.pathname]);

  if (!mounted) return null;

  return (
    <>
      {/* Multiple 3D Spheres - Only show if not result page */}
      {router.pathname !== '/result' && (
        <div className="spheres-container">
          {/* Center Sphere */}
          <div 
            className="sphere-loader sphere-center"
            ref={el => spheresRef.current[0] = el}
          ></div>

          {/* 24 Spheres spread across full screen */}
          {Array.from({ length: 24 }, (_, index) => (
            <div
              key={index + 1}
              className={`sphere-loader sphere-${index + 1}`}
              ref={el => spheresRef.current[index + 1] = el}
            ></div>
          ))}
        </div>
      )}
      
      <div className={`scene scene-${scene}`}>
        <div className="game-container">
          {children}
        </div>
      </div>
    </>
  );
}
