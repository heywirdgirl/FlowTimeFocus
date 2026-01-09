
import { Cycle, Phase } from '@/lib/types';

// Default data for a new phase when added by a user
export const DEFAULT_PHASE: Omit<Phase, 'id'> = {
    name: 'New Phase',
    duration: 10, // Default duration in minutes
    type: 'work',
};

// --- Official Templates ---
// All durations are in minutes. The timer store will convert them to seconds.
const MEDI_TEMPLATE: Cycle = {
    id: 'template-meditation',
    name: 'meditation teainning',
    isTemplate: true,
    phases: [
        { id: 'md-b1', name: 'start', duration: 1.00, type: 'work' }, // 75 seconds
        { id: 'rl-r1', name: 'Breath Hold', duration: 1.00, type: 'break' },      // 90 seconds
        { id: 'md-rec2', name: 'phase 2', duration: 2.00, type: 'work' }, // 15 seconds
        { id: 'rl-b2', name: 'relax 2.00', duration: 2.00, type: 'work' },

    ],
    createdAt: new Date(),
};

const POMODORO_TEMPLATE: Cycle = {
    id: 'template-pomodoro',
    name: 'Classic Pomodoro',
    isTemplate: true,
    phases: [
        { id: 'p-w1', name: 'Work', duration: 25, type: 'work' },
        { id: 'p-b1', name: 'Short Break', duration: 5, type: 'break' },
        { id: 'p-w2', name: 'Work', duration: 25, type: 'work' },
        { id: 'p-b2', name: 'Short Break', duration: 5, type: 'break' },
        { id: 'p-w3', name: 'Work', duration: 25, type: 'work' },
        { id: 'p-b3', name: 'Short Break', duration: 5, type: 'break' },
        { id: 'p-w4', name: 'Work', duration: 25, type: 'work' },
        { id: 'p-b4', name: 'Long Break', duration: 15, type: 'break' },
    ],
    createdAt: new Date(),
};

const WIMHOF_TEMPLATE: Cycle = {
    id: 'template-wimhof',
    name: 'Wim Hof Breathing',
    isTemplate: true,
    phases: [
        { id: 'wh-b1', name: 'Power Breathing', duration: 1.25, type: 'work' }, // 75 seconds
        { id: 'wh-r1', name: 'Breath Hold', duration: 1.5, type: 'break' },      // 90 seconds
        { id: 'wh-rec1', name: 'Recovery Hold', duration: 0.25, type: 'work' }, // 15 seconds
        { id: 'wh-b2', name: 'Power Breathing', duration: 1.25, type: 'work' },
        { id: 'wh-r2', name: 'Breath Hold', duration: 2, type: 'break' },        // 120 seconds
        { id: 'wh-rec2', name: 'Recovery Hold', duration: 0.25, type: 'work' },
        { id: 'wh-b3', name: 'Power Breathing', duration: 1.25, type: 'work' },
        { id: 'wh-r3', name: 'Breath Hold', duration: 2.5, type: 'break' },      // 150 seconds
        { id: 'wh-rec3', name: 'Recovery Hold', duration: 0.25, type: 'work' },
    ],
    createdAt: new Date(),
};

export const OFFICIAL_TEMPLATES = [MEDI_TEMPLATE,POMODORO_TEMPLATE, WIMHOF_TEMPLATE];
