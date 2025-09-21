"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/contexts/settings-context";
import { ThemeToggle } from "./theme-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
// import { smartSessionRecommendation } from "@/ai/flows/smart-session-recommendation";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsSheet({ open, onOpenChange }: SettingsSheetProps) {
  const { settings, setSettings } = useSettings();
  const [aiTask, setAiTask] = useState("");
  const [isRecommending, setIsRecommending] = useState(false);
  const { toast } = useToast();

  const handleSmartRecommendation = async () => {
    // if (!aiTask.trim()) {
    //   toast({
    //     title: "Task is empty",
    //     description: "Please enter a task to get a recommendation.",
    //     variant: "destructive",
    //   });
    //   return;
    // }
    // setIsRecommending(true);
    // try {
    //   const hours = new Date().getHours();
    //   const timeOfDay =
    //     hours < 12 ? "Morning" :
    //     hours < 18 ? "Afternoon" :
    //     hours < 21 ? "Evening" : "Night";
    //   const recommendation = await smartSessionRecommendation({
    //     task: aiTask,
    //     timeOfDay,
    //   });
    //   setSettings(prev => ({
    //     ...prev,
    //     focusDuration: recommendation.focusDuration,
    //     shortRestDuration: recommendation.shortRestDuration,
    //     longRestDuration: recommendation.longRestDuration,
    //   }));
    //   toast({
    //     title: "AI Recommendation Applied",
    //     description: "Your session durations have been updated.",
    //   });
    // } catch (error) {
    //   console.error("AI recommendation failed", error);
    //   toast({
    //     title: "Recommendation Failed",
    //     description: "Could not get a recommendation. Please try again.",
    //     variant: "destructive",
    //   });
    // } finally {
    //   setIsRecommending(false);
    // }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-sm">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize your FlowTime experience.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 py-6">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Timer Durations (minutes)</h3>
            <div className="space-y-2">
              <Label htmlFor="focusDuration">Focus Session</Label>
              <Input
                id="focusDuration"
                type="number"
                value={settings.focusDuration}
                onChange={(e) => setSettings(s => ({ ...s, focusDuration: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortRestDuration">Short Rest</Label>
              <Input
                id="shortRestDuration"
                type="number"
                value={settings.shortRestDuration}
                onChange={(e) => setSettings(s => ({ ...s, shortRestDuration: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longRestDuration">Long Rest</Label>
              <Input
                id="longRestDuration"
                type="number"
                value={settings.longRestDuration}
                onChange={(e) => setSettings(s => ({ ...s, longRestDuration: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionsUntilLongRest">Focus sessions until long rest</Label>
              <Input
                id="sessionsUntilLongRest"
                type="number"
                value={settings.sessionsUntilLongRest}
                onChange={(e) => setSettings(s => ({ ...s, sessionsUntilLongRest: Number(e.target.value) }))}
              />
            </div>
          </div>
          
          {/*
          <Card>
            <CardHeader>
              <CardTitle>Smart Recommendation</CardTitle>
              <CardDescription>Let AI suggest optimal durations for your task.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                placeholder="What are you working on?" 
                value={aiTask}
                onChange={(e) => setAiTask(e.target.value)}
              />
              <Button onClick={handleSmartRecommendation} disabled={isRecommending} className="w-full">
                {isRecommending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Get AI Suggestion
              </Button>
            </CardContent>
          </Card>
          */}

          <div className="space-y-4">
            <h3 className="font-medium text-lg">General</h3>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="playSounds">Play Sounds</Label>
              <Switch
                id="playSounds"
                checked={settings.playSounds}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, playSounds: checked }))}
              />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3">
              <p className="text-sm font-medium">Appearance</p>
              <ThemeToggle />
            </div>
          </div>
        </div>
        <SheetFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
