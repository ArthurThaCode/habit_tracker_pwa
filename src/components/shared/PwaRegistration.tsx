'use client';

import { useEffect } from 'react';

export default function PwaRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const register = () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.error('ServiceWorker registration failed: ', err);
        });
        navigator.serviceWorker.ready.then((registration) => {
          const urls = performance.getEntriesByType('resource').map((entry) => entry.name);
          registration.active?.postMessage({ type: 'CACHE_STATIC_ASSETS', urls });
        });
      };

      if (document.readyState === 'complete') {
        register();
      } else {
        window.addEventListener('load', register);
        return () => window.removeEventListener('load', register);
      }
    }
  }, []);

  return null;
}
