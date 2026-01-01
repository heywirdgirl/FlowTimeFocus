
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCycleStore } from "@/store/useCycleStore";
import { useTimerStore } from "@/store/useTimerStore";
import { Play, Trash } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export function CycleList() {
    const {
        privateCycles,
        setCurrentCycle,
        deleteCycle,
        currentCycle
    } = useCycleStore();
    const { isActive, send } = useTimerStore();

    const handleDelete = (cycleId: string) => {
        if (isActive && currentCycle?.id === cycleId) {
            if (window.confirm("This cycle is currently running. Are you sure you want to delete it? The timer will be reset to the default cycle.")) {
                deleteCycle(cycleId);
                send({ type: 'RESET' });
            }
        } else {
            deleteCycle(cycleId);
        }
    };

    const totalTimeToday = 0; 

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
                        {privateCycles.map(cycle => (
                            <Card key={cycle.id} className="flex items-center justify-between p-3">
                                <div>
                                    <p className="font-semibold">{cycle.name}</p>
                                </div>
                                <div className="flex items-center">
                                    <Button size="icon" variant="ghost" onClick={() => setCurrentCycle(cycle)}>
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
                    </div>
                </ScrollArea>
                <Button variant="outline" className="w-full">
                    Explore More Templates
                </Button>
            </CardContent>
        </Card>
    );
}
