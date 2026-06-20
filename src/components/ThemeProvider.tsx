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
    setMounted(true);
  }, []);

  return (
    <>
      {mounted && <ThemeLoader />}
      {children}
    </>
  );
}
