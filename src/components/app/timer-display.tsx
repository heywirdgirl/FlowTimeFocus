"use client";

import { useTimer } from "@/contexts/timer-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSettings } from "@/contexts/settings-context";
import { Play, Pause, RotateCcw, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useCycle } from "@/contexts/cycle-context";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export function TimerDisplay() {
  const { timeLeft, isActive, startPause, reset, skip } = useTimer();
  const { settings, setSettings } = useSettings();
  const { currentCycle, currentPhaseIndex } = useCycle();
  
  const currentPhase = currentCycle?.phases[currentPhaseIndex];
  const totalPhases = currentCycle?.phases.length ?? 0;

  const totalDuration = currentPhase ? currentPhase.duration * 60 : 0;
  const progress = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;

  const toggleSound = () => {
    setSettings(s => ({ ...s, playSounds: !s.playSounds }));
  };

  return (
    <Card className="w-full text-center border-2 shadow-lg">
      <CardHeader>
         <CardTitle className="text-3xl font-headline tracking-wider text-muted-foreground">
          {currentPhase?.title ?? "Ready?"}
        </CardTitle>
        <CardDescription>
          {totalPhases > 0 && `Phase ${currentPhaseIndex + 1}/${totalPhases}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="relative font-mono text-8xl md:text-9xl font-bold tracking-tighter text-foreground tabular-nums mb-4">
          {formatTime(timeLeft)}
        </div>
        <Progress value={progress} className="w-full h-3" />
        <div className="mt-4 text-center text-muted-foreground min-h-[40px] px-6">
          <p>{currentPhase?.description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center items-center gap-4">
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
      </CardFooter>
      <div className="absolute top-4 right-4">
         <Button onClick={toggleSound} variant="ghost" size="icon">
          {settings.playSounds ? <Volume2 /> : <VolumeX />}
          <span className="sr-only">Toggle Sound</span>
        </Button>
      </div>
    </Card>
  );
}
