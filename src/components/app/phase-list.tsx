// src/components/app/phase-list.tsx
"use client";

import { useCycle } from "@/contexts/cycle-context";
import { Phase } from "@/lib/types";
import { Button } from "../ui/button";
import { GripVertical, Trash2, Plus, Pen } from "lucide-react";
import { Input } from "../ui/input";

export function PhaseList() {
  const {
    currentCycle,
    currentPhaseIndex,
    // ✨ Use the new temporary editing functions
    addPhase,
    updatePhase,
    deletePhase,
    updateCycleInfo
  } = useCycle();

  if (!currentCycle) return null;

  const handleAddPhase = () => {
    // A default new phase
    addPhase({ title: "New Work Phase", duration: 25 * 60, type: 'work' });
  };

  const handleDeletePhase = (phaseId: string) => {
    deletePhase(phaseId);
  };

  const handlePhaseUpdate = (phaseId: string, updates: Partial<Phase>) => {
    updatePhase(phaseId, updates);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentCycle) {
      updateCycleInfo({ name: e.target.value });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-4">
          <Pen className="h-5 w-5"/>
          <Input 
            value={currentCycle.name}
            onChange={handleTitleChange}
            className="text-lg font-semibold border-0 border-b-2 rounded-none focus:ring-0 focus:border-primary"
            placeholder="Cycle Name"
          />
      </div>

      {currentCycle.phases.map((phase, index) => (
        <div
          key={phase.id}
          className={`flex items-center gap-2 p-2 rounded-md ${
            index === currentPhaseIndex ? "bg-primary/10" : ""
          }`}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
          <Input
            value={phase.title}
            onChange={(e) => handlePhaseUpdate(phase.id, { title: e.target.value })}
            className="flex-1 border-none bg-transparent focus:ring-0"
          />
          <Input
            type="number"
            value={Math.floor(phase.duration / 60)} // Display minutes
            onChange={(e) => handlePhaseUpdate(phase.id, { duration: parseInt(e.target.value) * 60 })}
            className="w-20 border-none bg-transparent focus:ring-0"
            min="1"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeletePhase(phase.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button variant="secondary" className="w-full mt-2" onClick={handleAddPhase}>
        <Plus className="h-4 w-4 mr-2" />
        Add Phase
      </Button>
    </div>
  );
}
