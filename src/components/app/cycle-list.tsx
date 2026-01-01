
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCycleStore } from "@/store/useCycleStore";
import { useTimerStore } from "@/store/useTimerStore";
import { Play, Trash } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export function CycleList() {
    const {
        cycles,       // Changed from privateCycles
        setCurrentCycle,
        deleteCycle,
        currentCycle,
        isLoading
    } = useCycleStore();
    const { isActive, send } = useTimerStore();

    const handleDelete = (cycleId: string) => {
        // No confirmation needed if another cycle is active or timer is paused
        if (isActive && currentCycle?.id === cycleId) {
             if (window.confirm("This cycle is currently running. Are you sure you want to delete it? The timer will be reset.")) {
                send({ type: 'RESET' }); // Stop the timer first
                deleteCycle(cycleId); // Then delete the cycle
            }
        } else {
            // If the deleted cycle is not the active one, just delete it
            deleteCycle(cycleId);
        }
    };

    const totalTimeToday = 0; 

    if (isLoading) {
        return (
            <Card className="w-full">
                 <CardHeader>
                    <CardTitle>Your Cycles</CardTitle>
                </CardHeader>
                <CardContent className="h-48 flex items-center justify-center">
                    <p>Loading cycles...</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Your Cycles</CardTitle>
                <CardDescription>
                    {totalTimeToday > 0 ? `${totalTimeToday}m practiced today.` : "Select a cycle to begin."}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <ScrollArea className="h-48">
                    <div className="space-y-2 pr-4">
                        {/* Add a check to ensure cycles is an array before mapping */}
                        {cycles && cycles.map(cycle => (
                            <Card key={cycle.id} className="flex items-center justify-between p-3">
                                <div>
                                    <p className="font-semibold">{cycle.name}</p>
                                </div>
                                <div className="flex items-center">
                                    {/* Pass cycle.id to setCurrentCycle */}
                                    <Button size="icon" variant="ghost" onClick={() => setCurrentCycle(cycle.id)}>
                                        <Play className="h-5 w-5" />
                                        <span className="sr-only">Run {cycle.name}</span>
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => handleDelete(cycle.id)}>
                                        <Trash className="h-5 w-5 text-red-500" />
                                        <span className="sr-only">Delete {cycle.name}</span>
                                    </Button>
                                </div>
                            </Card>
                        ))}
                         {(!cycles || cycles.length === 0) && (
                            <div className="text-center text-muted-foreground p-4">No cycles found.</div>
                        )}
                    </div>
                </ScrollArea>
                <Button variant="outline" className="w-full">
                    Explore More Templates
                </Button>
            </CardContent>
        </Card>
    );
}
