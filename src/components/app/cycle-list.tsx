"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCycle } from "@/contexts/cycle-context";
import { useTimer } from "@/contexts/timer-context";
import { Play, Trash } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export function CycleList() {
  const { 
    privateCycles, 
    allCycles, 
    setCurrentCycle, 
    deleteCycle, 
    currentCycle 
  } = useCycle();
  const { isActive, reset } = useTimer();

  const handleDelete = (cycleId: string) => {
    if (isActive && currentCycle?.id === cycleId) {
      if (window.confirm("This cycle is currently running. Are you sure you want to delete it? The timer will be reset to the default cycle.")) {
        deleteCycle(cycleId);
        reset();
      }
    } else {
      if (window.confirm("Delete this cycle?")) {
        deleteCycle(cycleId);
      }
    }
  };

  const handleExploreTemplates = () => {
    console.log("Explore public templates");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Cycles</CardTitle>
            <CardDescription>
              Select a cycle to begin.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 🔥 PRIVATE CYCLES */}
        <div className="space-y-2">
          <h3 className="font-semibold">
            My Cycles ({privateCycles.length})
          </h3>
          <ScrollArea className="h-32">
            <div className="space-y-2 pr-4">
              {privateCycles.length > 0 ? (
                privateCycles.map(cycle => (
                  <Card key={cycle.id} className="flex items-center justify-between p-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{cycle.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {cycle.phases.length} phases
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => setCurrentCycle(cycle)}
                      >
                        <Play className="h-5 w-5" />
                        <span className="sr-only">Run {cycle.name}</span>
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleDelete(cycle.id)}
                      >
                        <Trash className="h-5 w-5 text-red-500" />
                        <span className="sr-only">Delete {cycle.name}</span>
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Create your first cycle!
                </p>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* 🔥 EXPLORE BUTTON */}
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleExploreTemplates}
        >
          Explore More Templates ({allCycles ? allCycles.filter(c => c.isPublic).length : 0})
        </Button>
      </CardContent>
    </Card>
  );
}