'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useStore } from '@/store/useStore';
import {
  LayoutDashboard,
  CheckSquare,
  ClipboardList,
  Calendar,
  BarChart3,
  History,
  Settings,
  LogOut,
  X,
  User,
} from 'lucide-react';

export default function MobileDrawer() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const mobileSidebarOpen = useStore((state) => state.mobileSidebarOpen);
  const setMobileSidebarOpen = useStore((state) => state.setMobileSidebarOpen);

  const navItems = [
    { name: "Today's Tasks", path: '/today', icon: CheckSquare },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Master Habits', path: '/master-habits', icon: ClipboardList },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'History', path: '/history', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  if (!mobileSidebarOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setMobileSidebarOpen(false)}
      />

      {/* Drawer Panel */}
      <aside className="relative flex flex-col w-72 max-w-[85vw] h-full bg-sidebar border-r border-border text-foreground shadow-2xl animate-in slide-in-from-left duration-250 select-none">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2 overflow-hidden">
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="w-7 h-7 rounded-full border border-border"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-semibold">
                {session?.user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <span className="font-semibold text-sm truncate max-w-[120px]">
              {session?.user?.name || 'Life OS'}
            </span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1 hover:bg-hover rounded text-muted hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors font-medium ${
                  isActive
                    ? 'bg-active text-foreground font-semibold border-l-4 border-accent'
                    : 'text-muted hover:bg-hover hover:text-foreground'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-accent' : 'text-muted'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button
            onClick={() => {
              setMobileSidebarOpen(false);
              signOut();
            }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-muted hover:bg-red-500/10 hover:text-red-500 transition-all font-medium"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
