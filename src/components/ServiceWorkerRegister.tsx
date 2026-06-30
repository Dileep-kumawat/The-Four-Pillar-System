'use client';

import { useEffect } from 'react';

/**
 * Registers the PWA service worker (/public/sw.js) once the component mounts.
 * Must be a Client Component so it has access to the browser's navigator API.
 * Add this once in the root layout.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', {
          scope: '/',
          updateViaCache: 'none', // always fetch a fresh SW script
        })
        .then((registration) => {
          console.log('[SW] Registered, scope:', registration.scope);

          // Check for updates whenever the component mounts
          registration.update().catch(() => {
            // Silently ignore update errors (e.g. offline)
          });
        })
        .catch((error) => {
          console.error('[SW] Registration failed:', error);
        });
    }
  }, []);

  // This component renders nothing — it's purely a side-effect hook
  return null;
}
