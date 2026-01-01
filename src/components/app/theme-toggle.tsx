
"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useSettingStore } from "@/store/use-setting-store";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useSettingStore();

  const toggleTheme = () => {
    const themes: Array<typeof theme> = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {theme === "light" && <Sun className="h-[1.2rem] w-[1.2rem]" />}
      {theme === "dark" && <Moon className="h-[1.2rem] w-[1.2rem]" />}
      {theme === "system" && <Monitor className="h-[1.2rem] w-[1.2rem]" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
