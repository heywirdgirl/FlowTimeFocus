"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCycle } from "@/contexts/cycle-context";
import { useTimer } from "@/contexts/timer-context";
import { Play, Trash, Clock, TrendingUp } from "lucide-react";
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

    // 🔥 FIX: TÍNH TOTAL TIME TODAY TỪ ALL CYCLES' TRAINING HISTORY
    const totalTimeToday = allCycles
        .flatMap(cycle => cycle.trainingHistory) // 🔥 FLAT ALL histories
        .filter(h => new Date(h.completedAt).toDateString() === new Date().toDateString())
        .reduce((acc, h) => acc + h.totalDuration, 0);

    // 🔥 GET RECENT COMPLETED CYCLES (last 3)
    const recentCycles = allCycles
        .filter(cycle => cycle.trainingHistory.length > 0)
        .sort((a, b) => 
            new Date(b.trainingHistory[0].completedAt).getTime() - 
            new Date(a.trainingHistory[0].completedAt).getTime()
        )
        .slice(0, 3);

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
        // 🔥 TODO: Navigate to public templates page
        console.log("Explore public templates");
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Your Cycles</CardTitle>
                        <CardDescription>
                            {totalTimeToday > 0 
                                ? `${totalTimeToday}m practiced today.` 
                                : "Select a cycle to begin."
                            }
                        </CardDescription>
                    </div>
                    {totalTimeToday > 0 && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{totalTimeToday}m</span>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* 🔥 RECENTLY COMPLETED */}
                {recentCycles.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Recent
                        </h3>
                        <ScrollArea className="h-24">
                            <div className="space-y-2 pr-4">
                                {recentCycles.map(cycle => (
                                    <Card key={cycle.id} className="flex items-center justify-between p-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold truncate">{cycle.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {cycle.trainingHistory[0].totalDuration}m • {cycle.phases.length} phases
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
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                )}

                {/* 🔥 PRIVATE CYCLES */}
                <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
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
                                                {cycle.phases.length} phases • {cycle.trainingHistory.length} sessions
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
                    Explore More Templates ({allCycles.filter(c => c.isPublic).length})
                </Button>
            </CardContent>
        </Card>
    );
}