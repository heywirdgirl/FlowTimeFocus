"use client";

import { useTimer } from "@/contexts/timer-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSettings } from "@/contexts/settings-context";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export function TimerDisplay() {
  const { timeLeft, isActive, sessionType, startPause, reset, skip } = useTimer();
  const { settings } = useSettings();
  
  const getDuration = () => {
    switch (sessionType) {
      case 'focus': return settings.focusDuration * 60;
      case 'shortRest': return settings.shortRestDuration * 60;
      case 'longRest': return settings.longRestDuration * 60;
      default: return 0;
    }
  };

  const totalDuration = getDuration();
  const progress = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;

  const sessionTitles = {
    focus: "Focus",
    shortRest: "Short Break",
    longRest: "Long Break",
  };

  return (
    <Card className="w-full text-center border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-headline tracking-wider text-muted-foreground">
          {sessionTitles[sessionType]}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="relative font-mono text-8xl md:text-9xl font-bold tracking-tighter text-foreground tabular-nums mb-4">
          {formatTime(timeLeft)}
        </div>
        <Progress value={progress} className="w-full h-3" />
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
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
    </Card>
  );
}
