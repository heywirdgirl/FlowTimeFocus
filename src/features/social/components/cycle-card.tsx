import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import type { PublicCycle, Phase } from "../types";
import { calculateTotalDuration } from "@/features/cycles/utils/cycle-helpers";

interface CycleCardProps {
  cycle: PublicCycle;
  onClone: (cycleId: string) => void;
  onViewDetails: (cycleId: string) => void;
}

export function CycleCard({ cycle, onClone, onViewDetails }: CycleCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{cycle.name}</CardTitle>
        <CardDescription>{cycle.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>By {cycle.authorName}</span>
          <span>·</span>
          <span>{new Date(cycle.publishedAt).toLocaleDateString()}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {cycle.phases.slice(0, 3).map((phase: Phase) => (
            <Badge key={phase.id} variant="secondary">{phase.title}</Badge>
          ))}
          {cycle.phases.length > 3 && <Badge variant="outline">...</Badge>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm font-semibold">
          {calculateTotalDuration(cycle as any)} min
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onViewDetails(cycle.id)}>
            Details
          </Button>
          <Button size="sm" onClick={() => onClone(cycle.id)}>
            Clone
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
