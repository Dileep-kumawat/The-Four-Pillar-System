import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
  searchQuery: string;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      mobileSidebarOpen: false,
      searchQuery: '',
      theme: 'dark', // Default to Notion-like dark theme
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleMobileSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'four-pillar-store', // localStorage key
      partialize: (state) => ({ theme: state.theme }), // Only persist the theme
    }
  )
);
