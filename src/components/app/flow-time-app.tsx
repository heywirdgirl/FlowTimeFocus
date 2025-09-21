"use client";

import { useTimer } from "@/contexts/timer-context";
import { Header } from "./header";
import { TimerDisplay } from "./timer-display";
import { TaskManager } from "./task-manager";
import { cn } from "@/lib/utils";

export function FlowTimeApp() {
  const { sessionType, isActive } = useTimer();

  const backgroundClass = isActive 
    ? sessionType === 'focus' 
      ? 'bg-session-focus-bg dark:bg-session-focus-bg-dark' 
      : 'bg-session-rest-bg dark:bg-session-rest-bg-dark'
    : 'bg-background';

  return (
    <div className={cn("min-h-screen w-full transition-colors duration-1000", backgroundClass)}>
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-8 md:py-12">
        <div className="flex flex-col items-center gap-8">
          <TimerDisplay />
          <TaskManager />
        </div>
      </main>
    </div>
  );
}
