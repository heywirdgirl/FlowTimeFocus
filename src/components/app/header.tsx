"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Cog } from "lucide-react";
import { SettingsSheet } from "./settings-sheet";

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <>
      <header className="container mx-auto max-w-2xl px-4 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-headline text-foreground">
            FlowTime Focus
          </h1>
          <Button variant="ghost" size="icon" onClick={() => setIsSheetOpen(true)}>
            <Cog className="h-6 w-6" />
            <span className="sr-only">Open Settings</span>
          </Button>
        </div>
      </header>
      <SettingsSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} />
    </>
  );
}
