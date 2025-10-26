// src/components/app/cycle-list.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCycle } from "@/contexts/cycle-context";
import { useAuth } from "@/contexts/auth-context"; // <-- Added this import
import { Cycle } from "@/lib/types";
import { Play, Trash } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";

// CycleItem Component: Now includes a conditional delete button
const CycleItem = ({ 
  cycle, 
  onSelect, 
  onDelete,
  isSelected
}: { 
  cycle: Cycle, 
  onSelect: (cycle: Cycle) => void, 
  onDelete?: (cycleId: string) => void, // Optional: only for private cycles
  isSelected: boolean
}) => (
  <Card
    className={cn(
      "flex items-center justify-between p-3 transition-all",
      isSelected ? "bg-muted" : "hover:bg-muted/50"
    )}
  >
    {/* Make the main body selectable */}
    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onSelect(cycle)}>
      <p className="font-semibold truncate">{cycle.name}</p>
      <p className="text-xs text-muted-foreground">
        {cycle.phases.length} phases
      </p>
    </div>
    <div className="flex items-center gap-1">
      {/* ✨ Delete Button: Only appears when onDelete is passed */}
      {onDelete && (
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation(); // Prevent selection when deleting
              onDelete(cycle.id);
            }}
            title={`Delete ${cycle.name}`}
          >
            <Trash className="h-4 w-4 text-destructive" />
            <span className="sr-only">Delete {cycle.name}</span>
          </Button>
      )}
      <Button
          size="icon"
          variant="ghost"
          onClick={() => onSelect(cycle)}
          title={`Select ${cycle.name}`}
      >
          <Play className="h-5 w-5" />
          <span className="sr-only">Select {cycle.name}</span>
      </Button>
    </div>
  </Card>
);

export function CycleList() {
  const { user } = useAuth();
  const {
    allCycles = [],
    currentCycle,
    setCurrentCycleById,
    deleteCycle, // Get the delete function from context
    isLoaded
  } = useCycle();

  // Loading Skeleton
  if (!isLoaded) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-6 w-1/2"/>
          <Skeleton className="h-4 w-1/3 mt-1"/>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
           <div className="space-y-2">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleSelectCycle = (cycle: Cycle) => {
      if (setCurrentCycleById) {
        setCurrentCycleById(cycle.id);
      }
  };

  // Handler to call the context function
  const handleDeleteCycle = (cycleId: string) => {
    if (deleteCycle) {
      deleteCycle(cycleId);
    }
  }
  
  // Separate cycles into private and public templates
  const privateCycles = allCycles.filter(c => !c.isPublic);
  const publicTemplates = allCycles.filter(c => c.isPublic);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Focus Cycles</CardTitle>
            <CardDescription>Select a cycle to begin.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* My Cycles Section */}
        <div className="space-y-2">
          <h3 className="font-semibold">My Cycles ({privateCycles.length})</h3>
          <ScrollArea className="h-32">
            <div className="space-y-2 pr-4">
              {privateCycles.length > 0 ? (
                privateCycles.map((cycle) => (
                  <CycleItem 
                    key={cycle.id} 
                    cycle={cycle} 
                    onSelect={handleSelectCycle} 
                    onDelete={handleDeleteCycle} // ✨ Pass delete handler here
                    isSelected={currentCycle?.id === cycle.id}
                  />
                ))
              ) : (
                <div className="text-center text-sm text-muted-foreground py-4">
                  <p>You have no personal cycles.</p>
                  <p>Edit a template to create one!</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Templates Section */}
        <div className="space-y-2">
          <h3 className="font-semibold">
            Templates ({publicTemplates.length})
          </h3>
          <ScrollArea className="h-32">
            <div className="space-y-2 pr-4">
              {publicTemplates.map((cycle) => (
                 <CycleItem 
                    key={cycle.id} 
                    cycle={cycle} 
                    onSelect={handleSelectCycle}
                    // No onDelete handler for public templates
                    isSelected={currentCycle?.id === cycle.id}
                  />
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
