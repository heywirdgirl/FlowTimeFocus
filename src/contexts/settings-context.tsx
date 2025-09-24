
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = "light" | "dark" | "system";

interface Settings {
  playSounds: boolean;
  theme: Theme;
}

interface SettingsContextType {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
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
  const [settings, setSettings] = useState<Settings>(() => {
    // Cannot read from localStorage on server, so this runs on client first mount.
    return defaultSettings;
  });

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem("flowtime-settings");
      if (storedSettings) {
        setSettings(prev => ({...prev, ...JSON.parse(storedSettings)}));
      }
    } catch (error) {
      console.error("Failed to read settings from localStorage", error);
    }
  }, []);
  
  useEffect(() => {
    try {
      localStorage.setItem("flowtime-settings", JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (settings.theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(settings.theme);
    }

  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
