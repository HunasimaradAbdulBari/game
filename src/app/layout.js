// src/app/layout.js - Replaces _app.js and _document.js
'use client';
import { useEffect } from 'react';
import '../styles/globals.css';
// import '../styles/menu.module.css'

export default function RootLayout({ children }) {
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

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="description" content="Restaurant Master - Educational Drag and Drop Game" />
        <title>Lab-quest</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}