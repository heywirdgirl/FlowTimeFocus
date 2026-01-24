"use client";

import { useEffect, useState } from "react";
import { useCycles } from "@/features/cycles";
import { useTimer } from "../hooks/use-timer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Play, Pause, Edit, Plus, Trash2, Save, Copy } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Phase, PhaseEditor } from "@/features/cycles";

export function TimerDisplay() {
  const {
    currentCycle,
    currentPhase,
    currentPhaseIndex,
    updateCycle,
    updatePhaseInCycle,
    addPhaseToCycle,
    deletePhaseFromCycle,
    setCurrentPhaseIndex,
    saveCyclesToStorage,
    createCycle,
  } = useCycles();

  const { 
    timeLeft, 
    isRunning, 
    progress, 
    toggle, 
    formatTime,
    initializeTimer, 
    stopTimer 
  } = useTimer();

  // Component state
  const [isDirty, setIsDirty] = useState(false);
  const [isEditingCycle, setIsEditingCycle] = useState(false);
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
  const [isAddingPhase, setIsAddingPhase] = useState(false);

  // Initialize timer on mount
  useEffect(() => {
    initializeTimer();
    return () => stopTimer();
  }, [initializeTimer, stopTimer]);

  // Loading guard
  if (!currentCycle || !currentPhase) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Loading Timer...</p>
      </Card>
    );
  }

  const handleSavePhase = (phaseId: string, updates: Partial<Phase>) => {
    updatePhaseInCycle(currentCycle.id, phaseId, updates);
    setEditingPhaseId(null);
    setIsDirty(true);
  };

  const totalDuration = currentPhase.duration * 60;
  const safeProgress = totalDuration > 0 ? progress : 0;

  return (
    <Card className="w-full text-center border-2 shadow-lg relative">
      {/* Cycle Header */}
      <CardHeader className="pb-2">
        {isEditingCycle ? (
          <div className="flex flex-col gap-2">
            <Input
              value={currentCycle.name}
              onChange={(e) => {
                updateCycle(currentCycle.id, { name: e.target.value });
                setIsDirty(true);
              }}
              className="text-3xl font-headline text-center"
            />
            <Button size="sm" onClick={() => setIsEditingCycle(false)}>
              Done
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-3xl font-headline tracking-wider">
              {currentCycle.name}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditingCycle(true)}
            >
              <Edit className="h-5 w-5" />
            </Button>
          </div>
        )}
      </CardHeader>

      {/* Timer Display */}
      <CardContent className="flex flex-col items-center justify-center pt-4">
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          {/* Progress Circle Background */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200 dark:text-gray-700"
              strokeWidth="5"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            {/* Progress Circle Foreground */}
            <circle
              className="text-primary transition-all duration-1000 linear"
              strokeWidth="5"
              strokeDasharray="282.74"
              strokeDashoffset={282.74 - (safeProgress / 100) * 282.74}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            />
          </svg>
          {/* Timer Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-5xl md:text-7xl font-bold tabular-nums">
              {formatTime()}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        {/* Play/Pause Button */}
        <div className="flex justify-center items-center gap-4">
          <Button
            onClick={toggle}
            size="icon"
            className="h-20 w-20 rounded-full shadow-lg"
          >
            {isRunning ? (
              <Pause className="h-10 w-10" />
            ) : (
              <Play className="h-10 w-10" />
            )}
          </Button>
        </div>

        {/* Phase List */}
        <div className="w-full space-y-2 py-4">
          <div className="flex flex-col items-center justify-center gap-2 w-full max-w-sm mx-auto">
            {currentCycle.phases.map((phase, index) => (
              <div key={phase.id} className="w-full">
                <div className="flex items-center gap-2 w-full">
                  {/* Phase Button */}
                  <Button
                    variant={index === currentPhaseIndex ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPhaseIndex(index)}
                    className={cn(
                      "h-auto py-2 px-4 w-full justify-between flex-grow",
                      index === currentPhaseIndex && "shadow-md"
                    )}
                  >
                    <span>{phase.title}</span>
                    <span>{phase.duration}m</span>
                  </Button>

                  {/* Edit Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setEditingPhaseId(editingPhaseId === phase.id ? null : phase.id)
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      deletePhaseFromCycle(currentCycle.id, phase.id);
                      setIsDirty(true);
                    }}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Phase Editor (Collapsible) */}
                {editingPhaseId === phase.id && (
                  <PhaseEditor
                    phase={phase}
                    onSave={(updates) => handleSavePhase(phase.id, updates)}
                    onCancel={() => setEditingPhaseId(null)}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Add Phase Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingPhase(true)}
            className="mt-2 mx-auto flex"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Phase
          </Button>

          {/* New Phase Editor */}
          {isAddingPhase && (
            <PhaseEditor
              isNew
              phase={{ title: 'New Phase', duration: 5, type: 'work' }}
              onSave={(p) => {
                addPhaseToCycle(currentCycle.id, p);
                setIsAddingPhase(false);
                setIsDirty(true);
              }}
              onCancel={() => setIsAddingPhase(false)}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2 pt-4 border-t w-full max-w-sm mx-auto">
          <Button
            onClick={createCycle}
            size="sm"
            variant="outline"
            className="w-full"
          >
            <Copy className="mr-2 h-4 w-4" /> New Cycle
          </Button>
          <Button
            onClick={async () => {
              await saveCyclesToStorage();
              setIsDirty(false);
            }}
            size="sm"
            variant="outline"
            disabled={!isDirty}
            className="w-full"
          >
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
