// src/components/app/player.tsx
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Copy, Save, X, Edit, SlidersHorizontal, Plus, MoreVertical } from "lucide-react";
import { PhaseList } from "./phase-list";
import { useCycle } from "@/contexts/cycle-context";
import { Skeleton } from "../ui/skeleton";
import { AudioSelector } from "./audio-selector";

export function Player() {
  const {
    currentCycle,
    currentPhase,
    isLoaded,
    cloneCycle,
    isDirty,      // ✨ New state from context
    saveChanges,  // ✨ New function
    discardChanges // ✨ New function
  } = useCycle();

  if (!isLoaded) {
    return <PlayerSkeleton />;
  }

  if (!currentCycle) {
    return <NoCycleSelected />;
  }

  const handleClone = () => {
    if (currentCycle) {
      cloneCycle(currentCycle.id);
    }
  };

  return (
    <Card className="w-full flex flex-col h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate">{currentCycle.name}</CardTitle>
            <CardDescription className="truncate">{currentCycle.authorName || 'Template'}</CardDescription>
          </div>
          <div className="flex items-center ml-2">
            {/* ✨ Conditional Save/Discard Buttons */}
            {isDirty ? (
              <div className="flex items-center gap-1">
                <Button size="sm" variant="default" onClick={saveChanges} title="Save Changes">
                  <Save className="h-4 w-4 mr-1" /> Save
                </Button>
                <Button size="sm" variant="ghost" onClick={discardChanges} title="Discard Changes">
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                  <Button size="sm" variant="secondary" onClick={handleClone} title="Create a personal copy">
                    <Copy className="h-4 w-4 mr-1" /> Copy
                  </Button>
                  {/* Add other non-edit buttons here if needed */}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 overflow-y-auto">
        <div className="text-center">
          <h2 className="text-5xl font-bold">
            {currentPhase ? `${Math.floor(currentPhase.duration / 60)}:${(currentPhase.duration % 60).toString().padStart(2, '0')}` : "0:00"}
          </h2>
          <p className="text-lg text-muted-foreground">{currentPhase?.title || "No phase selected"}</p>
        </div>
        <PhaseList />
      </CardContent>

      <CardFooter className="flex-col items-start gap-4 pt-4 border-t">
          <AudioSelector />
          <div className="flex justify-between w-full text-xs text-muted-foreground">
              <p>Cycle ID: {currentCycle.id}</p>
              <p>Original ID: {currentCycle.originalId || 'N/A'}</p>
          </div>
      </CardFooter>
    </Card>
  );
}

// --- Helper Components ---
const NoCycleSelected = () => (
  <Card className="w-full flex items-center justify-center h-full">
    <div className="text-center">
      <h2 className="text-lg font-semibold">No Cycle Selected</h2>
      <p className="text-muted-foreground">Please select a cycle from the list to start.</p>
    </div>
  </Card>
);

const PlayerSkeleton = () => (
  <Card className="w-full flex flex-col h-full">
    <CardHeader>
      <div className="flex justify-between">
        <div>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
    </CardHeader>
    <CardContent className="flex-1 flex flex-col gap-4 overflow-y-auto">
      <div className="text-center">
        <Skeleton className="h-14 w-40 mx-auto" />
        <Skeleton className="h-6 w-24 mx-auto mt-2" />
      </div>
      {/* Skeleton for PhaseList */}
      <div className="space-y-2 mt-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </CardContent>
    <CardFooter className="pt-4 border-t">
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);
