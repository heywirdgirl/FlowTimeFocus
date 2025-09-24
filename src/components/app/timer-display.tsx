
"use client";

import { useTimer } from "@/contexts/timer-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useCycle } from "@/contexts/cycle-context";
import { Play, Pause, RotateCcw, SkipForward, Edit, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useSettings } from "@/contexts/settings-context";
import { cn } from "@/lib/utils";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export function TimerDisplay() {
  const { timeLeft, isActive, cyclesCompleted, startPause, reset, skip } = useTimer();
  const { currentCycle, currentPhaseIndex, updateCycle, updatePhase, addPhaseAfter, deletePhase, setCurrentPhaseIndex } = useCycle();
  const { settings } = useSettings();

  const [isEditingCycle, setIsEditingCycle] = useState(false);
  const [isEditingPhase, setIsEditingPhase] = useState(false);
  const [phaseDurationInput, setPhaseDurationInput] = useState<string>("");

  const currentPhase = currentCycle?.phases[currentPhaseIndex];
  const totalPhases = currentCycle?.phases.length ?? 0;
  const totalDuration = currentCycle?.phases.reduce((acc, p) => acc + (p.duration || 0), 0) ?? 0;

  const progress = currentPhase && currentPhase.duration > 0 ? ((currentPhase.duration * 60 - timeLeft) / (currentPhase.duration * 60)) * 100 : 0;
  
  if (!currentCycle || !currentPhase) {
    return (
      <Card className="w-full text-center border-2 shadow-lg p-8">
        <p>Loading cycle...</p>
      </Card>
    );
  }

  const handleCycleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateCycle({ name: e.target.value });
  };
  
  const handleCycleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateCycle({ description: e.target.value });
  };

  const handlePhaseTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePhase(currentPhase.id, { title: e.target.value });
  };

  const handlePhaseDurationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhaseDurationInput(value);
    // Only update the actual duration if it's a valid number
    const duration = parseFloat(value);
    if (!isNaN(duration) && duration >= 0.1) {
        updatePhase(currentPhase.id, { duration });
    }
  };

  const handleEditPhaseClick = () => {
    setIsEditingPhase(true);
    setPhaseDurationInput(String(currentPhase.duration));
  };
  
  const handleDoneEditingPhaseClick = () => {
    const duration = parseFloat(phaseDurationInput);
    if (isNaN(duration) || duration < 0.1) {
        // Revert to original value if input is invalid
        setPhaseDurationInput(String(currentPhase.duration));
    }
    setIsEditingPhase(false);
  };


  const isPhaseDurationValid = parseFloat(phaseDurationInput) >= 0.1;

  return (
    <Card className="w-full text-center border-2 shadow-lg relative">
      <CardHeader className="pb-2">
        {isEditingCycle ? (
          <div className="flex flex-col gap-2">
            <Input
              value={currentCycle.name}
              onChange={handleCycleNameChange}
              className="text-3xl font-headline tracking-wider text-center"
            />
            <Textarea
              value={currentCycle.description}
              onChange={handleCycleDescriptionChange}
              placeholder="Cycle description"
              className="text-sm text-center"
            />
            <Button size="sm" onClick={() => setIsEditingCycle(false)}>Done</Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-3xl font-headline tracking-wider">{currentCycle.name}</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsEditingCycle(true)}>
              <Edit className="h-5 w-5" />
            </Button>
          </div>
        )}
        <p className="text-sm text-muted-foreground">{currentCycle.description}</p>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center justify-center pt-4">
        <div className="relative w-64 h-64 md:w-80 md:h-80">
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
            <circle
              className="text-primary"
              strokeWidth="5"
              strokeDasharray="282.74"
              strokeDashoffset={282.74 - (progress / 100) * 282.74}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-5xl md:text-7xl font-bold tracking-tighter text-foreground tabular-nums">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="mt-6 text-center min-h-[60px] w-full">
           {isEditingPhase ? (
             <div className="flex flex-col gap-2 items-center">
               <div className="flex gap-2">
                <Input value={currentPhase.title} onChange={handlePhaseTitleChange} className="text-center"/>
                <div className="w-32">
                    <Input 
                      type="number" 
                      value={phaseDurationInput} 
                      onChange={handlePhaseDurationInputChange} 
                      className="w-full text-center"
                      min="0.1"
                      step="0.1"
                    />
                    {!isPhaseDurationValid && (
                        <p className="text-xs text-destructive mt-1">
                            Số phút phải lớn hơn hoặc bằng 0.1
                        </p>
                    )}
                </div>
               </div>
               <Button size="sm" onClick={handleDoneEditingPhaseClick}>Done</Button>
             </div>
           ) : (
            <>
              <p className="text-xl text-muted-foreground">{currentPhase.title}</p>
              <p className="text-sm text-muted-foreground">{currentPhase.description}</p>
            </>
           )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <div className="flex justify-center items-center gap-4">
            <Button onClick={reset} variant="outline" size="icon" className="h-14 w-14 rounded-full">
                <RotateCcw />
                <span className="sr-only">Reset</span>
            </Button>
            <Button onClick={startPause} size="icon" className="h-20 w-20 rounded-full text-3xl shadow-lg">
                {isActive ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10" />}
                <span className="sr-only">{isActive ? "Pause" : "Start"}</span>
            </Button>
            <Button onClick={skip} variant="outline" size="icon" className="h-14 w-14 rounded-full">
                <SkipForward />
                <span className="sr-only">Skip</span>
            </Button>
        </div>

        <div className="w-full space-y-4">
          <div className="flex flex-col items-center justify-center gap-2 w-full max-w-sm mx-auto">
              {currentCycle.phases.map((phase, index) => (
                  <Button 
                      key={phase.id}
                      variant={index === currentPhaseIndex ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPhaseIndex(index)}
                      className={cn("h-auto py-2 px-4 w-full justify-between", index === currentPhaseIndex && "shadow-md")}
                  >
                      <span>{phase.title}</span>
                      <span>{phase.duration}m</span>
                  </Button>
              ))}
          </div>
          <div className="flex justify-center items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleEditPhaseClick} title="Edit Current Phase">
                  <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => addPhaseAfter(currentPhase.id)} title="Add Phase After Current">
                  <Plus className="h-4 w-4" />
              </Button>
              {totalPhases > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => deletePhase(currentPhase.id)} title="Delete Current Phase" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                  </Button>
              )}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
            Cycle {cyclesCompleted + 1}/{settings.sessionsUntilLongRest > 0 ? settings.sessionsUntilLongRest : '∞'} | Total: {totalDuration.toFixed(1)}m
        </div>
      </CardFooter>
    </Card>
  );
}

    