"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useSettings } from "@/contexts/settings-context";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { settings, setSettings } = useSettings();

  const toggleTheme = () => {
    const themes = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(settings.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length] as "light" | "dark" | "system";
    setSettings(s => ({ ...s, theme: nextTheme }));
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {settings.theme === "light" && <Sun className="h-[1.2rem] w-[1.2rem]" />}
      {settings.theme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem]" />}
      {settings.theme === "system" && <Monitor className="h-[1.2rem] w-[1.2rem]" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
