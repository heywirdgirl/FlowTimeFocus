"use client";

import { useTimer } from "@/contexts/timer-context";
import { Header } from "./header";
import { TimerDisplay } from "./timer-display";
import { CycleList } from "./cycle-list";
import { Footer } from "./footer";
import { cn } from "@/lib/utils";
import { useCycle } from "@/contexts/cycle-context";

export function Homepage() {
  const { isActive } = useTimer();
  const { currentPhase } = useCycle();

  // A simple way to determine session type for background color
  const sessionTypeClass = () => {
    if (!isActive) return 'bg-background';
    if (!currentPhase) return 'bg-background';

    const title = currentPhase.title.toLowerCase();
    if (title.includes('focus') || title.includes('work')) {
      return 'bg-session-focus-bg dark:bg-session-focus-bg-dark';
    }
    if (title.includes('rest') || title.includes('break')) {
      return 'bg-session-rest-bg dark:bg-session-rest-bg-dark';
    }
    // Default for other phases like 'breathing', 'hold', etc.
    return 'bg-accent/20';
  };

  return (
    <div className={cn("min-h-screen w-full transition-colors duration-1000 flex flex-col", sessionTypeClass())}>
      <Header />
      <main className="flex-grow container mx-auto max-w-4xl px-4 py-8 md:py-12 flex flex-col justify-center">
        <TimerDisplay />
      </main>
      <Footer />
    </div>
  );
}
