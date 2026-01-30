import { CycleCard } from "./cycle-card";
import type { PublicCycle } from "../types";

interface CycleGridProps {
  cycles: PublicCycle[];
  onClone: (cycleId: string) => void;
  onViewDetails: (cycleId: string) => void;
}

export function CycleGrid({ cycles, onClone, onViewDetails }: CycleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {cycles.map((cycle: PublicCycle) => (
        <CycleCard key={cycle.id} cycle={cycle} onClone={onClone} onViewDetails={onViewDetails} />
      ))}
    </div>
  );
}
