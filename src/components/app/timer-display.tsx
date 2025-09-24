
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
import type { Phase } from "@/lib/types";


const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

function PhaseEditor({ phase, onSave, onCancel, isNew }: { phase: Partial<Phase>, onSave: (p: Partial<Phase>) => void, onCancel: () => void, isNew?: boolean }) {
    
    const [title, setTitle] = useState(phase?.title || "");
    const [duration, setDuration] = useState(String(phase?.duration || ""));

    const handleSave = () => {
        const newDuration = parseFloat(duration);
        if (title.trim() && !isNaN(newDuration) && newDuration >= 0.1) {
            onSave({ ...phase, title, duration: newDuration });
        }
    }

    return (
        <div className="p-2 my-2 border rounded-lg bg-background space-y-2">
            <Input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Phase Title"
            />
            <Input 
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Duration (min)"
                min="0.1"
                step="0.1"
            />
             {parseFloat(duration) < 0.1 && (
                <p className="text-xs text-destructive mt-1">
                    Số phút phải lớn hơn hoặc bằng 0.1
                </p>
            )}
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" className="w-full">{isNew ? 'Add' : 'Save'}</Button>
              <Button onClick={onCancel} size="sm" variant="outline" className="w-full">Cancel</Button>
            </div>
        </div>
    )
}

export function TimerDisplay() {
  const { timeLeft, isActive, cyclesCompleted, startPause, reset, skip } = useTimer();
  const { currentCycle, currentPhaseIndex, updateCycle, updatePhase, addPhaseAfter, deletePhase, setCurrentPhaseIndex } = useCycle();
  const { settings } = useSettings();

  const [isEditingCycle, setIsEditingCycle] = useState(false);
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
  const [isAddingPhase, setIsAddingPhase] = useState(false);

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

  const handleSavePhase = (phaseId: string, updates: Partial<Phase>) => {
      updatePhase(phaseId, updates);
      setEditingPhaseId(null);
  }

  const handleAddPhase = (newPhase: Partial<Phase>) => {
      if (newPhase.title && newPhase.duration) {
          addPhaseAfter(currentPhase.id, newPhase);
      }
      setIsAddingPhase(false);
  }

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
            <p className="text-xl text-muted-foreground">{currentPhase.title}</p>
            <p className="text-sm text-muted-foreground">{currentPhase.description}</p>
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

        <div className="w-full space-y-2">
          <div className="flex flex-col items-center justify-center gap-2 w-full max-w-sm mx-auto">
              {currentCycle.phases.map((phase, index) => (
                  <div key={phase.id} className="w-full">
                      <div className="flex items-center gap-2 w-full">
                          <Button 
                              variant={index === currentPhaseIndex ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPhaseIndex(index)}
                              className={cn("h-auto py-2 px-4 w-full justify-between flex-grow", index === currentPhaseIndex && "shadow-md")}
                          >
                              <span>{phase.title}</span>
                              <span>{phase.duration}m</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setEditingPhaseId(editingPhaseId === phase.id ? null : phase.id)} title="Edit Phase">
                              <Edit className="h-4 w-4" />
                          </Button>
                          {totalPhases > 1 && (
                            <Button variant="ghost" size="icon" onClick={() => deletePhase(phase.id)} title="Delete Phase" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                      </div>
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
          <div className="flex justify-center items-center">
             <Button variant="outline" size="sm" onClick={() => setIsAddingPhase(true)} title="Add Phase After Current" className="mt-2">
                  <Plus className="mr-2 h-4 w-4" /> Add Phase
              </Button>
          </div>
          {isAddingPhase && (
             <div className="w-full max-w-sm mx-auto">
                <PhaseEditor
                    isNew
                    phase={{ title: 'New Phase', duration: 5 }}
                    onSave={handleAddPhase}
                    onCancel={() => setIsAddingPhase(false)}
                />
             </div>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
            Cycle {cyclesCompleted + 1}/{settings.sessionsUntilLongRest > 0 ? settings.sessionsUntilLongRest : '∞'} | Total: {totalDuration.toFixed(1)}m
        </div>
      </CardFooter>
    </Card>
  );
}
