"use client";

import { useTimer } from "@/contexts/timer-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useCycle } from "@/contexts/cycle-context";
import { Play, Pause, RotateCcw, SkipForward, Edit, Plus, Trash2, Save, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react"; // Thêm useCallback
import { cn } from "@/lib/utils";
import type { Phase } from "@/lib/types";
import { CycleProgressBar } from "./cycle-progress-bar";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useHistory } from "@/contexts/history-context";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { debounce } from "lodash"; // Cần cài: npm i lodash

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

function PhaseEditor({
  phase,
  onSave,
  onCancel,
  isNew,
}: {
  phase: Partial<Phase>;
  onSave: (p: Partial<Phase>) => void;
  onCancel: () => void;
  isNew?: boolean;
}) {
  const [title, setTitle] = useState(phase?.title || "");
  const [duration, setDuration] = useState(String(phase?.duration || ""));
  const { audioLibrary } = useCycle();
  const [soundFileUrl, setSoundFileUrl] = useState(phase?.soundFile?.url || "");

  const handleSave = () => {
    const newDuration = parseFloat(duration);
    if (title.trim() && !isNaN(newDuration) && newDuration >= 0.1) {
      const selectedSound = audioLibrary.find((s) => s.url === soundFileUrl);
      onSave({
        ...phase,
        title,
        duration: newDuration,
        soundFile: selectedSound ? { url: selectedSound.url, name: selectedSound.name, type: selectedSound.type || '' } : null,
      });
    }
  };

  return (
    <div className="p-2 my-2 border rounded-lg bg-background space-y-2">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Phase Title" />
      <Input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="Duration (min)"
        step="0.1"
      />
      <Select onValueChange={setSoundFileUrl} value={soundFileUrl}>
        <SelectTrigger>
          <SelectValue placeholder="Select sound" />
        </SelectTrigger>
        <SelectContent>
          {audioLibrary.map((audio) => (
            <SelectItem key={audio.id} value={audio.url}>
              {audio.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {parseFloat(duration) < 0.1 && (
        <p className="text-xs text-destructive mt-1">Duration must be at least 0.1 minutes.</p>
      )}
      <div className="flex gap-2">
        <Button onClick={handleSave} size="sm" className="w-full">
          {isNew ? "Add" : "Save"}
        </Button>
        <Button onClick={onCancel} size="sm" variant="outline" className="w-full">
          Cancel
        </Button>
      </div>
    </div>
  );
}

export function TimerDisplay() {
  const { timeLeft, isActive, startPause, reset, skip, onCycleComplete, sessionPhaseRecords } = useTimer();
  const {
    currentCycle,
    currentPhaseIndex,
    updateCycle,
    updatePhase,
    addPhase,
    deletePhase,
    setCurrentPhaseIndex,
    // Loại bỏ createCycle
    saveCycleChanges,
    cloneCycle, // Giữ cloneCycle
    audioLibrary,
    endOfCycleSound,
    setEndOfCycleSound,
  } = useCycle();
  const { logSession } = useHistory();
  const { user } = useAuth();
  const { toast, showLoginPrompt } = useToast();

  const [isDirty, setIsDirty] = useState(false);
  const [isEditingCycle, setIsEditingCycle] = useState(false);
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
  const [isAddingPhase, setIsAddingPhase] = useState(false);
  const [sessionsUntilLongRest, setSessionsUntilLongRest] = useState(5);

  const currentPhase = currentCycle?.phases[currentPhaseIndex];
  const totalPhases = currentCycle?.phases.length ?? 0;
  const totalDuration = currentCycle?.phases.reduce((acc, p) => acc + (p.duration || 0), 0) ?? 0;

  const progress =
    currentPhase && currentPhase.duration > 0
      ? ((currentPhase.duration * 60 - timeLeft) / (currentPhase.duration * 60)) * 100
      : 0;

  useEffect(() => {
    if (onCycleComplete && currentCycle && sessionPhaseRecords.length > 0) {
      const isLastPhase = currentPhaseIndex === currentCycle.phases.length - 1;
      const isCycleComplete = isLastPhase && timeLeft === 0 && !isActive;
      if (isCycleComplete) {
        onCycleComplete(currentCycle, sessionPhaseRecords);
        logSession(currentCycle, "completed", sessionPhaseRecords);
      }
    }
  }, [timeLeft, isActive, currentPhaseIndex, currentCycle, sessionPhaseRecords, onCycleComplete, logSession]);

  if (!currentCycle || !currentPhase) {
    return (
      <Card className="w-full text-center border-2 shadow-lg p-8">
        <p>Loading cycle...</p>
      </Card>
    );
  }

  const handleError = (error: unknown, action: string) => {
    console.error(`Error in ${action}:`, error);
    if (error instanceof Error && error.message.includes("Please log in")) {
      showLoginPrompt(action);
    } else {
      toast({
        title: "Lỗi",
        description: `Có lỗi xảy ra khi ${action}: ${error instanceof Error ? error.message : 'Unknown error'}. Kiểm tra console để biết thêm.`,
        variant: "destructive",
      });
    }
  };

  const handleCycleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      updateCycle(currentCycle.id, { name: e.target.value });
      setIsDirty(true);
    } catch (error) {
      handleError(error, "thay đổi tên cycle");
    }
  };

  const handleSavePhase = async (phaseId: string, updates: Partial<Phase>) => {
    try {
      await updatePhase(currentCycle.id, phaseId, updates);
      setEditingPhaseId(null);
      setIsDirty(true);
    } catch (error) {
      handleError(error, "sửa phase");
    }
  };

  const handleAddPhase = async (newPhaseData: Partial<Phase>) => {
    try {
      await addPhase(currentCycle.id, { ...newPhaseData, id: uuidv4() });
      setIsAddingPhase(false);
      setIsDirty(true);
    } catch (error) {
      handleError(error, "thêm phase");
    }
  };

  const handleDeletePhase = async (phaseId: string) => {
    try {
      await deletePhase(currentCycle.id, phaseId);
      setIsDirty(true);
    } catch (error) {
      handleError(error, "xóa phase");
    }
  };

  const handleSaveChanges = async () => {
    try {
      await saveCycleChanges(currentCycle.id);
      setIsDirty(false);
    } catch (error) {
      handleError(error, "lưu thay đổi");
    }
  };

  const debouncedClone = useCallback(
    debounce(async () => {
      if (!user?.uid || !currentCycle) {
        showLoginPrompt("tạo cycle mới");
        return;
      }
      try {
        await cloneCycle(currentCycle.id);
        toast({
          title: "Thành công",
          description: `Đã tạo bản sao: [Copy] ${currentCycle.name}`,
        });
      } catch (error) {
        handleError(error, "tạo cycle mới");
      }
    }, 500),
    [user, currentCycle, cloneCycle, showLoginPrompt, toast]
  );

  const handleCreateNewCycle = () => {
    debouncedClone();
  };

  const handleEndOfCycleSoundChange = (soundUrl: string) => {
    const selectedSound = audioLibrary.find((s) => s.url === soundUrl);
    setEndOfCycleSound(selectedSound || null);
  };

  const isTemplate = currentCycle.id.startsWith("cycle_template_");
  const canEdit = !!user && !isTemplate;

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
            <Button size="sm" onClick={() => setIsEditingCycle(false)}>
              Done
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-3xl font-headline tracking-wider">{currentCycle.name}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (!canEdit) {
                  showLoginPrompt("chỉnh sửa cycle");
                  return;
                }
                setIsEditingCycle(true);
              }}
              disabled={!canEdit}
              title={!canEdit ? "Đăng nhập để chỉnh sửa" : "Edit Cycle"}
            >
              <Edit className="h-5 w-5" />
            </Button>
          </div>
        )}
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
              style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 1s linear" }}
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
          <CycleProgressBar totalCycles={sessionsUntilLongRest} />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <div className="flex justify-center items-center gap-4">
          <Button onClick={reset} variant="outline" size="icon" className="h-14 w-14 rounded-full">
            <RotateCcw />
            <span className="sr-only">Reset</span>
          </Button>
          <Button
            onClick={() => startPause(sessionsUntilLongRest)}
            size="icon"
            className="h-20 w-20 rounded-full text-3xl shadow-lg"
          >
            {isActive ? <Pause className="h-10 w-10" /> : <Play className="h-10 w-10" />}
            <span className="sr-only">{isActive ? "Pause" : "Start"}</span>
          </Button>
          <Button
            onClick={() => skip(sessionsUntilLongRest)}
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full"
          >
            <SkipForward />
            <span className="sr-only">Skip</span>
          </Button>
        </div>

        <div className="w-full space-y-2 py-4">
          <div className="flex flex-col items-center justify-center gap-2 w-full max-w-sm mx-auto">
            {currentCycle.phases.map((phase, index) => (
              <div key={phase.id} className="w-full">
                <div className="flex items-center gap-2 w-full">
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (!canEdit) {
                        showLoginPrompt("chỉnh sửa phase");
                        return;
                      }
                      setEditingPhaseId(editingPhaseId === phase.id ? null : phase.id);
                    }}
                    title={!canEdit ? "Đăng nhập để chỉnh sửa phase" : "Edit Phase"}
                    disabled={!canEdit}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {totalPhases > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (!canEdit) {
                          showLoginPrompt("xóa phase");
                          return;
                        }
                        handleDeletePhase(phase.id);
                      }}
                      title={!canEdit ? "Đăng nhập để xóa phase" : "Delete Phase"}
                      disabled={!canEdit}
                      className={cn("text-destructive hover:text-destructive", !canEdit && "opacity-50 cursor-not-allowed")}
                    >
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!canEdit) {
                  showLoginPrompt("thêm phase");
                  return;
                }
                setIsAddingPhase(true);
              }}
              title={!canEdit ? "Đăng nhập để thêm phase" : "Add Phase"}
              disabled={!canEdit}
              className={cn("mt-2", !canEdit && "opacity-50 cursor-not-allowed")}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Phase
            </Button>
          </div>
          {isAddingPhase && (
            <div className="w-full max-w-sm mx-auto">
              <PhaseEditor
                isNew
                phase={{ title: "New Phase", duration: 5, soundFile: audioLibrary[0] ? { url: audioLibrary[0].url, name: audioLibrary[0].name, type: audioLibrary[0].type || '' } : null }}
                onSave={handleAddPhase}
                onCancel={() => setIsAddingPhase(false)}
              />
            </div>
          )}
        </div>

        <div className="w-full max-w-sm mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="sessionsUntilLongRest" className="text-sm font-medium">
              Repeat Cycles
            </Label>
            <Input
              id="sessionsUntilLongRest"
              type="number"
              value={sessionsUntilLongRest}
              onChange={(e) => setSessionsUntilLongRest(Number(e.target.value))}
              className="w-20"
              min="1"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="endOfCycleSound" className="text-sm font-medium">
              End Sound
            </Label>
            <Select onValueChange={handleEndOfCycleSoundChange} value={endOfCycleSound?.url}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select end sound" />
              </SelectTrigger>
              <SelectContent>
                {audioLibrary.map((audio) => (
                  <SelectItem key={audio.id} value={audio.url}>
                    {audio.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground pt-2">Total duration: {totalDuration.toFixed(1)}m</div>
        </div>
        <div className="flex items-center justify-center gap-2 pt-4 border-t w-full max-w-sm mx-auto">
          <Button
            onClick={handleCreateNewCycle}
            size="sm"
            variant="outline"
            disabled={!canEdit}
            className={cn("w-full", !canEdit && "opacity-50 cursor-not-allowed")}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Cycle
          </Button>
          <Button
            onClick={() => {
              if (!canEdit) {
                showLoginPrompt("lưu thay đổi");
                return;
              }
              handleSaveChanges();
            }}
            size="sm"
            variant="outline"
            disabled={isTemplate || !isDirty || !canEdit}
            className="w-full"
          >
            <Save className="mr-2 h-4 w-4" />
            {isTemplate ? "Template" : "Save Changes"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}