import { create } from 'zustand';

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

export const useStore = create<AppState>((set) => ({
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
}));
