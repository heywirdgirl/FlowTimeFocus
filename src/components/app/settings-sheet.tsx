"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/contexts/settings-context";
import { ThemeToggle } from "./theme-toggle";
import { Label } from "@/components/ui/label";

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsSheet({ open, onOpenChange }: SettingsSheetProps) {
  const { settings, setSettings } = useSettings();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-sm">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize your FlowTime experience.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 py-6">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">General</h3>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="playSounds">Play Sounds</Label>
              <Switch
                id="playSounds"
                checked={settings.playSounds}
                onCheckedChange={(checked) => setSettings(s => ({ ...s, playSounds: checked }))}
              />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3">
              <p className="text-sm font-medium">Appearance</p>
              <ThemeToggle />
            </div>
          </div>
        </div>
        <SheetFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
