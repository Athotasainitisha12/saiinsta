import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeAccent = 'default' | 'purple' | 'blue' | 'coral' | 'green';

interface ThemeState {
  mode: ThemeMode;
  accent: ThemeAccent;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: ThemeAccent) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      accent: 'default',
      setMode: (mode) => {
        set({ mode });
        applyThemeMode(mode);
      },
      setAccent: (accent) => {
        set({ accent });
        applyThemeAccent(accent);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeMode(state.mode);
          applyThemeAccent(state.accent);
        }
      },
    }
  )
);

function applyThemeMode(mode: ThemeMode) {
  const root = document.documentElement;
  
  if (mode === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', isDark);
  } else {
    root.classList.toggle('dark', mode === 'dark');
  }
}

function applyThemeAccent(accent: ThemeAccent) {
  const root = document.documentElement;
  
  // Remove all accent classes
  root.classList.remove('accent-default', 'accent-purple', 'accent-blue', 'accent-coral', 'accent-green');
  root.classList.add(`accent-${accent}`);
}

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const { mode } = useThemeStore.getState();
    if (mode === 'system') {
      document.documentElement.classList.toggle('dark', e.matches);
    }
  });
}
