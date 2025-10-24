"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Settings {
  playSounds: boolean; // Chỉ giữ âm thanh, luôn true
}

interface SettingsContextType {
  settings: Settings;
  // Loại bỏ setSettings, toggleSounds, setTheme
}

const defaultSettings: Settings = {
  playSounds: true, // Mặc định luôn bật
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

  // Loại bỏ debounce save vì không còn toggle
  useEffect(() => {
    try {
      localStorage.setItem("flowtime-settings", JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings", error);
    }
  }, [settings]);

  // Loại bỏ logic load theme, chỉ load âm thanh
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

  // Loại bỏ useEffect cho theme, áp dụng dark cố định trong globals.css
  const value: SettingsContextType = {
    settings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}