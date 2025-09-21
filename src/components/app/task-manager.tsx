"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('flowtime-tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('flowtime-tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to localStorage", error);
    }
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim() === '') return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText,
      completed: false
    };
    setTasks(prev => [...prev, newTask]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tasks for this session</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
          <Input
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
          />
          <Button type="submit" size="icon">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add Task</span>
          </Button>
        </form>
        <div className="space-y-2">
            {tasks.length > 0 ? (
                tasks.map((task) => (
                <div
                    key={task.id}
                    className="flex items-center gap-2 group p-2 rounded-md hover:bg-accent/50 transition-colors"
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  <Label
                    htmlFor={`task-${task.id}`}
                    className={`flex-grow cursor-pointer transition-colors ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {task.text}
                  </Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete task"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))
            ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                    No tasks yet. Add one to get started!
                </p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

TaskManager.displayName = "TaskManager";
