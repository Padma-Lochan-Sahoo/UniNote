import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeStore {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "dark", // UniNote defaults to dark
      toggleTheme: () =>
        set((s) => {
          const next = s.theme === "dark" ? "light" : "dark";
          document.documentElement.classList.toggle("dark", next === "dark");
          document.documentElement.classList.toggle("light", next === "light");
          return { theme: next };
        }),
    }),
    { name: "uninote-theme" }
  )
);
