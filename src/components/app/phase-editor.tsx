
"use client";

import { useState } from "react";
import type { Phase } from "@/types/cycle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PhaseEditorProps {
  phase: Partial<Phase>;
  onSave: (p: Partial<Phase>) => void;
  onCancel: () => void;
  isNew?: boolean;
}

export function PhaseEditor({ phase, onSave, onCancel, isNew }: PhaseEditorProps) {
    const [title, setTitle] = useState(phase?.title || "");
    const [duration, setDuration] = useState(String(phase?.duration || ""));

    const handleSave = () => {
        const newDuration = parseFloat(duration);
        if (title.trim() && !isNaN(newDuration) && newDuration >= 0.1) {
            onSave({ ...phase, title, duration: newDuration });
        }
    }

    return (
        <div className="p-2 my-2 border rounded-lg bg-background space-y-2">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Phase Title" />
            <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration (min)" step="0.1" />
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" className="w-full">{isNew ? 'Add' : 'Save'}</Button>
              <Button onClick={onCancel} size="sm" variant="outline" className="w-full">Cancel</Button>
            </div>
        </div>
    );
}
