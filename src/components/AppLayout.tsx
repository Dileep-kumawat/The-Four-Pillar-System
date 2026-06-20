'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileDrawer from '@/components/MobileDrawer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <div className="min-h-screen bg-background text-foreground">{children}</div>;
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <main className="p-4 md:p-6 bg-background relative">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background relative">
          {children}
        </main>
      </div>
      <MobileDrawer />
    </div>
  );
}
