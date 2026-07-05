import { create } from "zustand"

interface UIState {
  theme: "light" | "dark" | "system"
  sidebarOpen: boolean
  setTheme: (theme: "light" | "dark" | "system") => void
  toggleSidebar: () => void
}

export const useUIStore = create<UIState>((set) => ({
  theme: "system",
  sidebarOpen: false,

  setTheme: (theme) => {
    set({ theme })
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark")
    }
  },

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))
