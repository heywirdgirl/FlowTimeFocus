"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useCycles } from "../hooks/use-cycles";
import { useTimerStore } from "@/features/timer";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { CycleCard } from "./cycle-card";
import { calculateTotalDuration } from "../utils/cycle-helpers";

export function CycleList() {
    const { cycles, currentCycle, isLoading } = useCycles();
    const { isActive } = useTimerStore();

    const totalTimeToday = cycles.reduce((acc, cycle) => acc + calculateTotalDuration(cycle), 0);

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
                        {cycles && cycles.map(cycle => (
                            <CycleCard key={cycle.id} cycle={cycle} isActive={isActive && currentCycle?.id === cycle.id} />
                        ))}
                         {(!cycles || cycles.length === 0) && (
                            <div className="text-center text-muted-foreground p-4">No cycles found.</div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}