"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCycle } from "@/contexts/cycle-context";
import { useTimer } from "@/contexts/timer-context";
import { useHistory } from "@/contexts/history-context"; // 🔥 FIX 1: ADD IMPORT!
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
    const { trainingHistory } = useHistory(); // 🔥 FIX 2: GET HISTORY!

    // 🔥 FIX 3: TOTAL TIME TODAY FROM HISTORY CONTEXT
    const totalTimeToday = trainingHistory
        .filter(h => new Date(h.completedAt).toDateString() === new Date().toDateString())
        .reduce((acc, h) => acc + h.totalDuration, 0);

    // 🔥 FIX 4: HELPER - COUNT SESSIONS PER CYCLE
    const getHistoryCount = (cycleId: string) => 
        trainingHistory.filter(h => h.cycleId === cycleId).length;

    // 🔥 FIX 5: RECENT CYCLES FROM HISTORY
    const recentCycles = allCycles
        .filter(cycle => getHistoryCount(cycle.id) > 0)
        .sort((a, b) => {
            const lastA = trainingHistory.filter(h => h.cycleId === a.id)[0]?.completedAt;
            const lastB = trainingHistory.filter(h => h.cycleId === b.id)[0]?.completedAt;
            return new Date(lastB || 0).getTime() - new Date(lastA || 0).getTime();
        })
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
                                {recentCycles.map(cycle => {
                                    const lastSession = trainingHistory.filter(h => h.cycleId === cycle.id)[0];
                                    return (
                                        <Card key={cycle.id} className="flex items-center justify-between p-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold truncate">{cycle.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {lastSession?.totalDuration || 0}m • {cycle.phases.length} phases
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
                                    );
                                })}
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
                                                {cycle.phases.length} phases • {getHistoryCount(cycle.id)} sessions {/* 🔥 FIXED! */}
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