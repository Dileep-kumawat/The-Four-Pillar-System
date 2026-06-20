import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found - The Four Pillar System',
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 space-y-6">
      <div className="space-y-2">
        <span className="text-xs font-bold text-red-500 font-mono uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded">
          404 Error
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight">Page not found</h1>
        <p className="text-sm text-muted max-w-sm mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center justify-center h-9 px-4 rounded bg-[#2eaadc] text-white text-sm font-medium hover:bg-[#258db6] transition-colors"
      >
        Go back home
      </Link>
    </div>
  );
}
