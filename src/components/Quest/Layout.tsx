'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutProps } from '../../types';

const Layout: React.FC<LayoutProps> = ({ children, scene }) => {
  const [mounted, setMounted] = useState<boolean>(false);
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
};

export default Layout;