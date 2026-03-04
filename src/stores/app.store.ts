import { create } from "zustand";

type AppState = {
  isSidebarOpen: boolean;
  isLoading: boolean;
};

type AppActions = {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
};

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()((set) => ({
  isSidebarOpen: true,
  isLoading: false,

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  setLoading: (loading) => set({ isLoading: loading }),
}));
