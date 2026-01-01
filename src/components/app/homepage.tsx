
"use client";

import { TimerDisplay } from "./timer-display";
import { CycleList } from "./cycle-list";
import { cn } from "@/lib/utils";
import { useCycleStore } from "@/store/useCycleStore";
import { useTimerStore } from "@/store/useTimerStore";

export function Homepage() {
  const { isActive } = useTimerStore();
  const { currentCycle, currentPhaseIndex } = useCycleStore();
  const currentPhase = currentCycle?.phases[currentPhaseIndex];

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
    
    return 'bg-accent/20';
  };

  return (
    <div className={cn("min-h-screen w-full transition-colors duration-1000 flex flex-col", sessionTypeClass())}>

      <main className="flex-grow container mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <TimerDisplay />
            </div>
            <div className="w-full">
              <CycleList />
            </div>
        </div>
      </main>

    </div>
  );
}
