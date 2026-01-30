import { CycleCard } from "./cycle-card";

export function CycleGrid({ cycles }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {cycles.map((cycle) => (
        <CycleCard key={cycle.id} cycle={cycle} onClone={() => {}} onViewDetails={() => {}} />
      ))}
    </div>
  );
}
