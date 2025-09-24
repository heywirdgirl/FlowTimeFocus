"use client";

import { useTimer } from "@/contexts/timer-context";
import { useSettings } from "@/contexts/settings-context";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCycle } from "@/contexts/cycle-context";

export function CycleProgressBar() {
  const { cyclesCompleted, sessionPhaseRecords } = useTimer();
  const { settings } = useSettings();
  const { currentCycle } = useCycle();
  const totalCycles = settings.sessionsUntilLongRest > 0 ? settings.sessionsUntilLongRest : 0;

  if (totalCycles <= 0) {
    return (
        <div className="text-sm text-muted-foreground">
            Cycle {cyclesCompleted + 1}
        </div>
    );
  }

  const currentCycleProgress = () => {
    if (!currentCycle || currentCycle.phases.length === 0) return 0;
    const completedPhases = sessionPhaseRecords.filter(p => p.completionStatus === 'completed').length;
    return (completedPhases / currentCycle.phases.length);
  };

  const getBarHeight = (cycleIndex: number): string => {
    if (cycleIndex < cyclesCompleted) {
        // This logic could be enhanced if we store full history for each completed cycle
        return "100%";
    }
    if (cycleIndex === cyclesCompleted) {
        const progress = currentCycleProgress();
        if (progress > 0) {
            // Minimum 10% height for any progress, up to 100%
            return `${Math.max(10, progress * 100)}%`;
        }
        // if there is progress but it was all skipped
        if(sessionPhaseRecords.length > 0 && progress === 0) {
            return "5%"; // Small bar at the base if all phases so far were skipped
        }
    }
    return "0%";
  };

  return (
    <TooltipProvider>
      <div className="flex items-end justify-center gap-9 h-10 w-full max-w-[12rem] mx-auto" aria-label={`Cycle ${cyclesCompleted + 1} of ${totalCycles}`}>
        {Array.from({ length: totalCycles }).map((_, i) => {
          const isCurrent = i === cyclesCompleted;
          const isCompleted = i < cyclesCompleted;
          return (
            <Tooltip key={i} delayDuration={100}>
              <TooltipTrigger asChild>
                <div className="relative h-full flex-1 bg-muted rounded-t-sm overflow-hidden w-2">
                  <div
                    className={cn(
                      "absolute bottom-0 w-full rounded-t-sm transition-all duration-500",
                      isCurrent ? "bg-primary" : "bg-primary/50",
                      isCompleted ? "bg-green-500" : ""
                    )}
                    style={{ height: getBarHeight(i) }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cycle {i + 1}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
