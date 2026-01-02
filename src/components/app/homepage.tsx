
"use client";

import { TimerDisplay } from "./timer-display";
import { CycleList } from "./cycle-list";
import { cn } from "@/lib/utils";
import { useCycleStore } from "@/store/useCycleStore";
import { useTimerStore } from "@/store/useTimerStore";
import { Skeleton } from "@/components/ui/skeleton";

export function Homepage() {
  const { isActive } = useTimerStore();
  const { currentCycle, currentPhaseIndex, isLoading } = useCycleStore();

  // Show a loading skeleton if data isn't ready yet
  if (isLoading || !currentCycle) {
    return (
        <div className="min-h-screen w-full bg-background flex flex-col">
            <main className="flex-grow container mx-auto max-w-6xl px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-4">
                        <Skeleton className="h-[200px] w-full" />
                        <Skeleton className="h-[50px] w-full" />
                    </div>
                    <div className="w-full space-y-4">
                        <Skeleton className="h-[250px] w-full" />
                    </div>
                </div>
            </main>
        </div>
    );
  }

  const currentPhase = currentCycle.phases[currentPhaseIndex];

  // This should not happen if the loading logic is correct, but as a fallback:
  if (!currentPhase) {
    return <div>Error: Current phase could not be loaded.</div>;
  }

  const sessionTypeClass = () => {
    if (!isActive) return 'bg-background';

    // Use the 'type' property for more reliable styling
    if (currentPhase.type === 'work') {
      return 'bg-session-focus-bg dark:bg-session-focus-bg-dark';
    }
    if (currentPhase.type === 'break') {
      return 'bg-session-rest-bg dark:bg-session-rest-bg-dark';
    }
    
    // Fallback for other types
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
