// src/contexts/settings-context.tsx - OPTIMIZED VERSION (Oct 19, 2025)
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Theme = "light" | "dark" | "system";

interface Settings {
  playSounds: boolean;
  theme: Theme;
}

interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  toggleSounds: () => void;
  setTheme: (theme: Theme) => void;
}

const defaultSettings: Settings = {
  playSounds: true,
  theme: "system",
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => defaultSettings);

  // 🔥 OPTIMIZE 1: DEBOUNCE SAVE
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const saveToStorage = () => {
      try {
        localStorage.setItem("flowtime-settings", JSON.stringify(settings));
      } catch (error) {
        console.error("Failed to save settings", error);
      }
    };

    timeoutId = setTimeout(saveToStorage, 300); // Debounce 300ms
    return () => clearTimeout(timeoutId);
  }, [settings]);

  // 🔥 LOAD FROM STORAGE
  useEffect(() => {
    try {
      const stored = localStorage.getItem("flowtime-settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error("Failed to load settings", error);
    }
  }, []);

  // 🔥 OPTIMIZE 2: INITIAL THEME + SYNC
  useEffect(() => {
    const root = document.documentElement;
    
    // Set initial theme (no flash)
    const applyTheme = () => {
      root.classList.remove("light", "dark");
      if (settings.theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(settings.theme);
      }
    };

    // Initial apply
    applyTheme();
    
    // Listen for system changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => settings.theme === "system" && applyTheme();
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [settings.theme]);

  // 🔥 HELPER FUNCTIONS
  const toggleSounds = useCallback(() => {
    setSettings(prev => ({ ...prev, playSounds: !prev.playSounds }));
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    setSettings(prev => ({ ...prev, theme }));
  }, []);

  const value: SettingsContextType = {
    settings,
    setSettings,
    toggleSounds, // 🔥 BONUS
    setTheme       // 🔥 BONUS
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}