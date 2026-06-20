'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
