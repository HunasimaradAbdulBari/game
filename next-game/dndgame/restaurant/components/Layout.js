import { useEffect, useState } from 'react';

export default function Layout({ children, scene }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="game-container">
      <div className={`scene scene-${scene} fade-in`}>
        {children}
      </div>
    </div>
  );
}
