"use client";

import { useState, useEffect } from "react";
import type { Phase } from "../types";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { validatePhase } from '../utils/cycle-helpers';


const phaseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  duration: z.coerce.number().min(0.1, "Duration must be at least 0.1 minutes"),
});

interface PhaseEditorProps {
  phase: Partial<Phase>;
  onSave: (p: Partial<Phase>) => void;
  onCancel: () => void;
  isNew?: boolean;
}

export function PhaseEditor({ phase, onSave, onCancel, isNew }: PhaseEditorProps) {
    const { register, handleSubmit, formState: { errors, isValid }, control, reset } = useForm<Partial<Phase>>({
        resolver: zodResolver(phaseSchema),
        defaultValues: phase,
        mode: 'onChange',
    });

    useEffect(() => {
        reset(phase);
    }, [phase, reset]);

    const handleSave = (data: Partial<Phase>) => {
        if (validatePhase(data)) {
            onSave(data);
        }
    }

    return (
        <form onSubmit={handleSubmit(handleSave)} className="p-2 my-2 border rounded-lg bg-background space-y-2">
            <Controller
                name="title"
                control={control}
                render={({ field }) => <Input {...field} placeholder="Phase Title" />}
            />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            <Controller
                name="duration"
                control={control}
                render={({ field }) => <Input type="number" {...field} placeholder="Duration (min)" step="0.1" />}
            />
            {errors.duration && <p className="text-red-500 text-xs">{errors.duration.message}</p>}
            <div className="flex gap-2">
              <Button type="submit" size="sm" className="w-full" disabled={!isValid}>{isNew ? 'Add' : 'Save'}</Button>
              <Button onClick={onCancel} type="button" size="sm" variant="outline" className="w-full">Cancel</Button>
            </div>
        </form>
    );
}