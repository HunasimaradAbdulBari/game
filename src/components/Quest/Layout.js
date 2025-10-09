// components/Layout.js - Full Screen Layout
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Layout({ children, scene }) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`game-container scene-${scene}`}>
      <div className={`scene scene-${scene}`}>
        {children}
      </div>
    </div>
  );
}
