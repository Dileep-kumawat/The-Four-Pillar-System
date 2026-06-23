'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';

function ThemeLoader() {
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return null;
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Apply the persisted theme immediately on mount to prevent flash
    try {
      const stored = localStorage.getItem('four-pillar-store');
      if (stored) {
        const parsed = JSON.parse(stored);
        const savedTheme = parsed?.state?.theme;
        const root = window.document.documentElement;
        if (savedTheme === 'dark') {
          root.classList.add('dark');
        } else if (savedTheme === 'light') {
          root.classList.remove('dark');
        }
      }
    } catch {
      // ignore parse errors
    }
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && <ThemeLoader />}
      {children}
    </>
  );
}
