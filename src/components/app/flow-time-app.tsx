"use client";

import { useTimer } from "@/contexts/timer-context";
import { Header } from "./header";
import { TimerDisplay } from "./timer-display";
import { cn } from "@/lib/utils";
import { CycleList } from "./cycle-list";
import { Footer } from "./footer";

export function FlowTimeApp() {
  const { sessionType, isActive } = useTimer();

  const backgroundClass = isActive 
    ? sessionType === 'focus' 
      ? 'bg-session-focus-bg dark:bg-session-focus-bg-dark' 
      : 'bg-session-rest-bg dark:bg-session-rest-bg-dark'
    : 'bg-background';

  return (
    <div className={cn("min-h-screen w-full transition-colors duration-1000 flex flex-col", backgroundClass)}>
      <Header />
      <main className="flex-grow container mx-auto max-w-4xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 flex flex-col items-center gap-8">
            <TimerDisplay />
          </div>
          <div className="md:col-span-1">
            <CycleList />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
