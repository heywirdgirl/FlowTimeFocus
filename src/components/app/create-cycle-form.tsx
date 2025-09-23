"use client";

import { useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Cycle, Phase } from "@/lib/types";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage }from "@/components/ui/form";
import { Plus, GripVertical, Loader2 } from "lucide-react";
import { SortablePhaseCard } from "./sortable-phase-card";

const phaseSchema = z.object({
  id: z.string().default(() => `phase_${Math.random().toString(36).substr(2, 9)}`),
  title: z.string().min(1, "Title is required"),
  duration: z.number().min(0.1, "Duration must be at least 0.1 minutes"),
  description: z.string().optional(),
  soundFile: z.object({ url: z.string(), name: z.string().optional(), type: z.string().optional() }).nullable().default(null),
  removable: z.boolean().optional().default(true),
});

const cycleSchema = z.object({
  name: z.string().min(1, "Cycle name is required"),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  phases: z.array(phaseSchema).min(1, "At least one phase is required"),
});

type CycleFormData = z.infer<typeof cycleSchema>;

const defaultPhase: Omit<Phase, 'id'> = {
    title: 'Focus',
    duration: 25,
    description: 'Work on your task',
    soundFile: null,
    removable: true,
};

export function CreateCycleForm() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const form = useForm<CycleFormData>({
    resolver: zodResolver(cycleSchema),
    defaultValues: {
      name: "",
      description: "",
      isPublic: false,
      phases: [{...defaultPhase, id: `phase_${Math.random().toString(36).substr(2, 9)}`}],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "phases",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over?.id);
      move(oldIndex, newIndex);
    }
  };

  const onSubmit = async (data: CycleFormData) => {
    setIsSaving(true);
    try {
      const cycleData: Omit<Cycle, 'id'> = {
        ...data,
        authorId: "user_placeholder", // Replace with actual user ID from auth
        authorName: "User Placeholder", // Replace with actual user name
        likes: 0,
        shares: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
      };

      const docRef = await addDoc(collection(db, 'cycleTemplates'), cycleData);
      console.log("Document written with ID: ", docRef.id);
      
      toast({
        title: "Cycle Saved Successfully!",
        description: `Your new cycle "${data.name}" has been saved.`,
      });

      form.reset();

    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        title: "Error Saving Cycle",
        description: "There was a problem saving your cycle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Cycle</CardTitle>
            <CardDescription>Design and share your own focus and rest routines.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cycle Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Wim Hof Method" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the purpose of this cycle." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                        <FormLabel>Public</FormLabel>
                        <CardDescription>Share this cycle with the community.</CardDescription>
                    </div>
                    <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phases</CardTitle>
            <CardDescription>Drag to reorder phases.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={fields} strategy={verticalListSortingStrategy}>
                  {fields.map((field, index) => (
                     <SortablePhaseCard key={field.id} index={index} id={field.id} remove={remove} />
                  ))}
                </SortableContext>
              </DndContext>
              <Button type="button" variant="outline" onClick={() => append({ ...defaultPhase, id: `phase_${Math.random().toString(36).substr(2, 9)}` })} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Phase
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Preview & Save</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium">Total Duration: {form.watch('phases').reduce((acc, phase) => acc + (phase.duration || 0), 0).toFixed(1)} minutes</h4>
                    <p className="text-sm text-muted-foreground">
                        {form.watch('phases').map(p => `${p.title} (${p.duration || 0}m)`).join(' → ')}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="secondary">Preview Timer</Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Cycle
                    </Button>
                </div>
            </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}
