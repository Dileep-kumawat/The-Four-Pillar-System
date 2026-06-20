'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store/useStore';
import { Search, Moon, Sun, Menu, User } from 'lucide-react';

export default function TopBar() {
  const { data: session } = useSession();
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const toggleMobileSidebar = useStore((state) => state.toggleMobileSidebar);

  // Format today's date nicely: "Saturday, June 20"
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="flex items-center justify-between h-12 border-b border-border px-4 bg-background select-none">
      {/* Mobile left side: Menu toggle */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          onClick={toggleMobileSidebar}
          className="p-1.5 hover:bg-hover rounded text-foreground transition-colors"
          title="Open Menu"
        >
          <Menu size={20} />
        </button>
        <span className="font-semibold text-xs truncate max-w-[120px]">
          {session?.user?.name || 'Life OS'}
        </span>
      </div>

      {/* Global Search Bar */}
      <div className="hidden sm:flex items-center flex-1 max-w-md relative">
        <Search size={15} className="absolute left-3 text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search habits, logs, notes..."
          className="w-full h-8 pl-9 pr-3 text-sm bg-hover border border-border rounded focus:outline-none focus:border-accent transition-colors text-foreground"
        />
      </div>

      {/* Right widgets: Date, Theme toggle, Profile */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Date */}
        <span className="hidden md:inline text-xs font-mono text-muted uppercase tracking-wider">
          {formattedDate}
        </span>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-1.5 hover:bg-hover rounded text-muted hover:text-foreground transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* User profile / Avatar */}
        <div className="flex items-center gap-2">
          {session?.user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-7 h-7 rounded-full border border-border"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-hover border border-border flex items-center justify-center text-muted">
              <User size={14} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
