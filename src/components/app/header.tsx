"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cog, LogOut, User, Moon, Sun, Monitor } from "lucide-react";
import { SettingsSheet } from "./settings-sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSettings } from "@/contexts/settings-context";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const timezoneOffset = -now.getTimezoneOffset() / 60;
      const timezone = `+0${timezoneOffset}`.slice(-2);
      setCurrentTime(`${time} +07`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <header className="container mx-auto max-w-4xl px-4 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-headline text-foreground">
            Timeflow
          </h1>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-muted-foreground font-mono">{currentTime}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    {/* <AvatarImage src="/avatars/01.png" alt="User" /> */}
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">user@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsSheetOpen(true)}>
                  <Cog className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="hidden sm:flex">
              <ThemeToggle />
            </div>
             <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setIsSheetOpen(true)}>
              <Cog className="h-6 w-6" />
              <span className="sr-only">Open Settings</span>
            </Button>
          </div>
        </div>
      </header>
      <SettingsSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </>
  );
}
