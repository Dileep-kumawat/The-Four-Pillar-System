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
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  const sidebarOpen = useStore((state) => state.sidebarOpen);
  const toggleSidebar = useStore((state) => state.toggleSidebar);
  const toggleMobileSidebar = useStore((state) => state.toggleMobileSidebar);

  const navItems = [
    { name: "Today's Tasks", path: '/today', icon: CheckSquare },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Master Habits', path: '/master-habits', icon: ClipboardList },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'History', path: '/history', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  if (!sidebarOpen) {
    return (
      <div className="hidden md:flex flex-col items-center w-12 bg-sidebar border-r border-border h-screen py-4 transition-all duration-300">
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-hover rounded text-muted hover:text-foreground mb-4"
          title="Expand Sidebar"
        >
          <ChevronRight size={18} />
        </button>
        <div className="flex-1 flex flex-col gap-4 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`p-2 rounded transition-colors ${
                  isActive ? 'bg-active text-foreground' : 'text-muted hover:bg-hover hover:text-foreground'
                }`}
                title={item.name}
              >
                <Icon size={18} />
              </Link>
            );
          })}
        </div>
        <button
          onClick={() => signOut()}
          className="p-2 rounded text-muted hover:bg-hover hover:text-red-500 transition-colors"
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    );
  }

  return (
    <aside className="hidden md:flex flex-col w-60 bg-sidebar border-r border-border h-screen text-foreground transition-all duration-300 select-none">
      {/* Header / Profile */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2 overflow-hidden">
          {session?.user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-6 h-6 rounded-full border border-border bg-background"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-semibold">
              {session?.user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <span className="font-semibold text-sm truncate max-w-[120px]">
            {session?.user?.name || 'My Life OS'}
          </span>
          <span className="text-[10px] text-accent border border-accent/30 bg-accent/10 px-1 rounded font-mono uppercase">
            Pro
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1 hover:bg-hover rounded text-muted hover:text-foreground transition-colors"
          title="Collapse Sidebar"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-1.5 rounded text-sm transition-colors font-medium ${
                isActive
                  ? 'bg-active text-foreground font-semibold border-l-2 border-accent'
                  : 'text-muted hover:bg-hover hover:text-foreground'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-accent' : 'text-muted'} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-border">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full px-3 py-2 rounded text-sm text-muted hover:bg-red-500/10 hover:text-red-500 transition-all font-medium"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
