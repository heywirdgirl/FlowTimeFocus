"use client";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { useCycles } from "../hooks/use-cycles";
import { Play, Trash } from "lucide-react";
import { Cycle } from "../types";

interface CycleCardProps {
    cycle: Cycle;
    isActive: boolean;
}

export function CycleCard({ cycle, isActive }: CycleCardProps) {
    const { selectCycle, deleteCycle } = useCycles();

    const handleDelete = () => {
        if (isActive) {
             if (window.confirm("This cycle is currently running. Are you sure you want to delete it? The timer will be reset.")) {
                deleteCycle(cycle.id);
            }
        } else {
            deleteCycle(cycle.id);
        }
    };

    return (
        <Card key={cycle.id} className="flex items-center justify-between p-3">
            <div>
                <p className="font-semibold">{cycle.name}</p>
            </div>
            <div className="flex items-center">
                <Button size="icon" variant="ghost" onClick={() => selectCycle(cycle.id)}>
                    <Play className="h-5 w-5" />
                    <span className="sr-only">Run {cycle.name}</span>
                </Button>
                <Button size="icon" variant="ghost" onClick={handleDelete}>
                    <Trash className="h-5 w-5 text-red-500" />
                    <span className="sr-only">Delete {cycle.name}</span>
                </Button>
            </div>
        </Card>
    );
}