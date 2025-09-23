"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { GripVertical, Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCycle } from "@/contexts/cycle-context";


interface SortablePhaseCardProps {
  id: string;
  index: number;
  remove: (index: number) => void;
}

export function SortablePhaseCard({ id, index, remove }: SortablePhaseCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const { control } = useFormContext(); // Gaining access to the form context
  const { audioLibrary } = useCycle();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} className="relative touch-none">
        <Button variant="ghost" size="icon" {...attributes} {...listeners} className="absolute top-1/2 -translate-y-1/2 left-1 cursor-grab">
            <GripVertical />
        </Button>
        <CardContent className="p-4 pl-12 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-2">
                 <FormField
                    control={control}
                    name={`phases.${index}.title`}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                        <Input placeholder="Phase title" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`phases.${index}.duration`}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                        <Input type="number" step="0.1" {...field} onChange={e => field.onChange(parseFloat(e.target.value))}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <div className="space-y-2">
                 <FormField
                    control={control}
                    name={`phases.${index}.description`}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                        <Textarea placeholder="Describe this phase" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={control}
                    name={`phases.${index}.soundFile`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sound</FormLabel>
                             <Select onValueChange={(value) => field.onChange(value === 'null' ? null : { url: value, name: audioLibrary.find(a => a.url === value)?.name } )} >
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a sound" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="null">None</SelectItem>
                                    {audioLibrary.map(audio => (
                                        <SelectItem key={audio.id} value={audio.url}>{audio.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>

            <div className="md:col-span-2 flex justify-end items-center gap-4">
                <FormField
                control={control}
                name={`phases.${index}.removable`}
                render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Removable</FormLabel>
                    </FormItem>
                )}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </div>

        </CardContent>
    </Card>
  );
}
