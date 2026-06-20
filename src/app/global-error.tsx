'use client';

import React from 'react';

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <title>Something went wrong</title>
      </head>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          backgroundColor: '#191919',
          color: 'rgba(255,255,255,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '24px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            maxWidth: '28rem',
            width: '100%',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: '8px',
            backgroundColor: '#202020',
            padding: '24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#ef4444',
              margin: '0 0 12px 0',
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              backgroundColor: 'rgba(0,0,0,0.2)',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid rgba(255,255,255,0.05)',
              textAlign: 'left',
              color: 'rgba(248,113,113,0.8)',
              wordBreak: 'break-word',
              margin: '0 0 24px 0',
            }}
          >
            {error?.message || 'An unexpected application error occurred.'}
          </p>
          <button
            onClick={() => unstable_retry()}
            style={{
              width: '100%',
              height: '36px',
              borderRadius: '6px',
              backgroundColor: '#2eaadc',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.15s',
            }}
            onMouseOver={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#258db6'; }}
            onMouseOut={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2eaadc'; }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
