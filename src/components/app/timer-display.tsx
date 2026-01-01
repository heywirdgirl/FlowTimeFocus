"use client";

import { useEffect, useState } from "react";
import { useMachine } from "@xstate/react";
import { timerMachine } from "@/ai/timer-machine"; // File đã tạo ở bước trước
import { useCycleStore } from "@/store/useCycleStore"; // Store Zustand mới
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Play, Pause, RotateCcw, SkipForward, Edit, Plus, Trash2, Save, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Phase } from "@/lib/types";
import { CycleProgressBar } from "./cycle-progress-bar";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Helper giữ nguyên
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// PhaseEditor giữ nguyên cấu trúc cũ
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
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Phase Title" />
            <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration (min)" step="0.1" />
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" className="w-full">{isNew ? 'Add' : 'Save'}</Button>
              <Button onClick={onCancel} size="sm" variant="outline" className="w-full">Cancel</Button>
            </div>
        </div>
    );
}

export function TimerDisplay() {
  // 1. KẾT NỐI ZUSTAND (Thay thế useCycle cũ)
  const { 
    currentCycle, 
    currentPhaseIndex, 
    updateCycle, 
    updatePhase, 
    addPhase, 
    deletePhase, 
    setCurrentPhaseIndex,
    advancePhase,
    audioLibrary,
    saveCycleChanges,
    createNewCycle,
    playSounds
  } = useCycleStore();

  // 2. KẾT NỐI XSTATE (Thay thế useTimer cũ)
  const currentPhase = currentCycle?.phases[currentPhaseIndex];
  
  const [state, send] = useMachine(timerMachine, {
    input: { duration: (currentPhase?.duration || 0) * 60 },
    actions: {
      onTimerEnd: () => {
        // Logic âm thanh và chuyển phase khi hết giờ
        if (playSounds && currentPhase?.soundFile) {
          new Audio(currentPhase.soundFile.url).play();
        }
        advancePhase();
      }
    }
  });

  // State local cho UI giữ nguyên
  const [isDirty, setIsDirty] = useState(false);
  const [isEditingCycle, setIsEditingCycle] = useState(false);
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
  const [isAddingPhase, setIsAddingPhase] = useState(false);
  const [sessionsUntilLongRest, setSessionsUntilLongRest] = useState(5);

  // Đồng bộ XState khi Phase thay đổi (Ví dụ: click chọn phase khác hoặc sửa duration)
  useEffect(() => {
    if (currentPhase) {
      send({ type: 'UPDATE_DURATION', duration: currentPhase.duration * 60 });
    }
  }, [currentPhase?.id, currentPhase?.duration, send]);

  if (!currentCycle || !currentPhase) return <Card className="p-8 text-center">Loading...</Card>;

  // Trích xuất thông tin từ XState
  const { timeLeft } = state.context;
  const isActive = state.matches('running');
  const progress = ( (currentPhase.duration * 60 - timeLeft) / (currentPhase.duration * 60) ) * 100;

  // Handlers kết nối Store
  const handleSavePhase = (phaseId: string, updates: Partial<Phase>) => {
      updatePhase(phaseId, updates);
      setEditingPhaseId(null);
      setIsDirty(true);
  };

  return (
    <Card className="w-full text-center border-2 shadow-lg relative">
      <CardHeader className="pb-2">
        {isEditingCycle ? (
          <div className="flex flex-col gap-2">
            <Input value={currentCycle.name} onChange={(e) => { updateCycle({ name: e.target.value }); setIsDirty(true); }} className="text-3xl font-headline text-center" />
            <Button size="sm" onClick={() => setIsEditingCycle(false)}>Done</Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-3xl font-headline tracking-wider">{currentCycle.name}</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsEditingCycle(true)}><Edit className="h-5 w-5" /></Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex flex-col items-center justify-center pt-4">
        {/* SVG Progress Circle giữ nguyên logic, chỉ thay timeLeft từ XState */}
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle className="text-gray-200 dark:text-gray-700" strokeWidth="5" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
            <circle
              className="text-primary transition-all duration-1000 linear"
              strokeWidth="5"
              strokeDasharray="282.74"
              strokeDashoffset={282.74 - (progress / 100) * 282.74}
              strokeLinecap="round"
              stroke="currentColor" fill="transparent" r="45" cx="50" cy="50"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-5xl md:text-7xl font-bold tabular-nums">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <div className="mt-6 text-center min-h-[60px] w-full">
            <p className="text-xl text-muted-foreground">{currentPhase.title}</p>
            <CycleProgressBar totalCycles={sessionsUntilLongRest} />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <div className="flex justify-center items-center gap-4">
            <Button onClick={() => send({ type: 'RESET' })} variant="outline" size="icon" className="h-14 w-14 rounded-full">
                <RotateCcw />
            </Button>
            {/* Start/Pause điều khiển qua XState send() */}
            <Button onClick={() => send({ type: isActive ? 'PAUSE' : 'START' })} size="icon" className="h-20 w-20 rounded-full shadow-lg">
                {isActive ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10" />}
            </Button>
            <Button onClick={() => send({ type: 'SKIP' })} variant="outline" size="icon" className="h-14 w-14 rounded-full">
                <SkipForward />
            </Button>
        </div>

        {/* Phần danh sách Phase và Editor giữ nguyên, chỉ thay đổi các hàm gọi từ Zustand */}
        <div className="w-full space-y-2 py-4">
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
                          <Button variant="ghost" size="icon" onClick={() => setEditingPhaseId(editingPhaseId === phase.id ? null : phase.id)}>
                              <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => { deletePhase(phase.id); setIsDirty(true); }} className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                          </Button>
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
          <Button variant="outline" size="sm" onClick={() => setIsAddingPhase(true)} className="mt-2 mx-auto flex">
              <Plus className="mr-2 h-4 w-4" /> Add Phase
          </Button>
          {isAddingPhase && (
             <PhaseEditor isNew phase={{ title: 'New Phase', duration: 5 }} onSave={(p) => { addPhase(p); setIsAddingPhase(false); setIsDirty(true); }} onCancel={() => setIsAddingPhase(false)} />
          )}
        </div>

        {/* Footer actions kết nối saveCycleChanges từ Store */}
        <div className="flex items-center justify-center gap-2 pt-4 border-t w-full max-w-sm mx-auto">
            <Button onClick={createNewCycle} size="sm" variant="outline" className="w-full">
                <Copy className="mr-2 h-4 w-4" /> New Cycle
            </Button>
            <Button onClick={async () => { await saveCycleChanges(); setIsDirty(false); }} size="sm" variant="outline" disabled={!isDirty} className="w-full">
                <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
