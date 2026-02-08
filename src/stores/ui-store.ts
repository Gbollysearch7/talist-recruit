import { create } from "zustand";

// ─── Types ──────────────────────────────────────────────────────────────────

interface UIState {
  sidebarOpen: boolean;
  activeModal: string | null;
}

interface UIActions {
  toggleSidebar: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export type UIStore = UIState & UIActions;

// ─── Store ──────────────────────────────────────────────────────────────────

export const useUIStore = create<UIStore>((set) => ({
  // State
  sidebarOpen: true,
  activeModal: null,

  // Actions
  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  openModal: (modalId) => set({ activeModal: modalId }),

  closeModal: () => set({ activeModal: null }),
}));
