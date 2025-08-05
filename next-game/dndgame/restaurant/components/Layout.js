// components/Layout.js - CORRECTED VERSION
import { useEffect, useState } from 'react';
import BackgroundAnimation from './BackgroundAnimation';

export default function Layout({ children, scene }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <BackgroundAnimation />
      <div className={`scene scene-${scene}`}>
        <div className="game-container">
          {children}
        </div>
      </div>
    </>
  );
}
