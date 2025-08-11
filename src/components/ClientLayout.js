'use client';

import { useEffect } from 'react';

export default function ClientLayout({ children }) {
  useEffect(() => {
    // Prevent zoom on mobile devices
    const preventZoom = (e) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchmove', preventZoom, { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchmove', preventZoom);
    };
  }, []);

  return <>{children}</>;
}