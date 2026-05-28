'use client';

import { useEffect } from 'react';

export function PWARegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.location.hostname !== 'localhost'
    ) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('⬡ OMNITRIX OS: Progressive Web App Link Secured. SW Registered.');
          })
          .catch((err) => {
            console.warn('⬡ OMNITRIX OS: SW registration aborted.', err);
          });
      });
    }
  }, []);

  return null;
}
export default PWARegistration;
