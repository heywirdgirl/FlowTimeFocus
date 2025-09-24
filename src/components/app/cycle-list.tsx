"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCycle } from "@/contexts/cycle-context";
import { Play, Plus } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";

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
                <ScrollArea className="h-48">
                    <div className="space-y-2 pr-4">
                        {privateCycles.map(cycle => (
                            <Card key={cycle.id} className="flex items-center justify-between p-3">
                                <div>
                                    <p className="font-semibold">{cycle.name}</p>
                                </div>
                                <Button size="icon" variant="ghost" onClick={() => setCurrentCycle(cycle)}>
                                    <Play className="h-5 w-5" />
                                    <span className="sr-only">Run {cycle.name}</span>
                                </Button>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
                 <Link href="/create" passHref>
                    <Button variant="outline" className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Cycle
                    </Button>
                </Link>
                <Button variant="outline" className="w-full">
                    Explore More Templates
                </Button>
            </CardContent>
        </Card>
    );
}
