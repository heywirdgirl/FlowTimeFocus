"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCycle } from "@/contexts/cycle-context";
import { Play } from "lucide-react";

export function CycleList() {
    const { privateCycles, setCurrentCycle, trainingHistory } = useCycle();

    const totalTimeToday = trainingHistory
        .filter(h => new Date(h.completedAt).toDateString() === new Date().toDateString())
        .reduce((acc, h) => acc + h.totalDuration, 0);

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Your Cycles</CardTitle>
                <CardDescription>
                    {totalTimeToday > 0 ? `${totalTimeToday}m practiced today.` : "Select a cycle to begin."}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    {privateCycles.map(cycle => (
                        <Card key={cycle.id} className="flex items-center justify-between p-3">
                            <div>
                                <p className="font-semibold">{cycle.name}</p>
                                <p className="text-sm text-muted-foreground truncate">{cycle.description}</p>
                            </div>
                            <Button size="icon" variant="ghost" onClick={() => setCurrentCycle(cycle)}>
                                <Play className="h-5 w-5" />
                                <span className="sr-only">Run {cycle.name}</span>
                            </Button>
                        </Card>
                    ))}
                </div>
                <Button variant="outline" className="w-full">
                    Explore More Templates
                </Button>
            </CardContent>
        </Card>
    );
}
