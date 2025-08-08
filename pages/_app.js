// pages/_app.js - ADD BACKGROUND GLOBALLY
import '../styles/globals.css';
import { useEffect } from 'react';
// import BackgroundAnimation from '../components/BackgroundAnimation'; // Add this

export default function App({ Component, pageProps }) {
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
    <>
      {/* <BackgroundAnimation /> Add this line */}
      <Component {...pageProps} />
    </>
  );
}
