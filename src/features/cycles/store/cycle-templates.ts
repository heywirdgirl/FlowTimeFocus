import { v4 as uuidv4 } from 'uuid';
import type { Cycle, Phase } from "../types";

// --- Default Data ---
export const DEFAULT_PHASE: Omit<Phase, 'id'> = {
    title: 'New Phase',
    duration: 10,
    soundFile: undefined,
};

// --- Helper function to create official cycles ---
const createOfficialCycle = (data: Partial<Cycle> & { phases: Phase[] }): Cycle => ({
    id: data.id || uuidv4(),
    name: data.name || 'Untitled Cycle',
    phases: data.phases,
    userId: 'system-official',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...data,
});

// --- Official Templates ---

const MEDI_TEMPLATE = createOfficialCycle({
    id: 'template-meditation',
    name: 'Meditation Training',
    phases: [
        { id: 'md-b1', title: 'Start', duration: 1.0, soundFile: undefined },
        { id: 'rl-r1', title: 'Breath Hold', duration: 1.0, soundFile: undefined },
        { id: 'md-rec2', title: 'Phase 2', duration: 2.0, soundFile: undefined },
        { id: 'rl-b2', title: 'Relax', duration: 2.0, soundFile: undefined },
    ],
});

const POMODORO_TEMPLATE = createOfficialCycle({
    id: 'template-pomodoro',
    name: 'Classic Pomodoro',
    phases: [
        { id: 'p-w1', title: 'Work', duration: 25, soundFile: undefined },
        { id: 'p-b1', title: 'Short Break', duration: 5, soundFile: undefined },
        { id: 'p-w2', title: 'Work', duration: 25, soundFile: undefined },
        { id: 'p-b2', title: 'Short Break', duration: 5, soundFile: undefined },
        { id: 'p-w3', title: 'Work', duration: 25, soundFile: undefined },
        { id: 'p-b3', title: 'Short Break', duration: 5, soundFile: undefined },
        { id: 'p-w4', title: 'Work', duration: 25, soundFile: undefined },
        { id: 'p-b4', title: 'Long Break', duration: 15, soundFile: undefined },
    ],
});

const WIMHOF_TEMPLATE = createOfficialCycle({
    id: 'template-wimhof',
    name: 'Wim Hof Breathing',
    phases: [
        { id: 'wh-b1', title: 'Power Breathing', duration: 1.25, soundFile: undefined },
        { id: 'wh-r1', title: 'Breath Hold', duration: 1.5, soundFile: undefined },
        { id: 'wh-rec1', title: 'Recovery Hold', duration: 0.25, soundFile: undefined },
        { id: 'wh-b2', title: 'Power Breathing', duration: 1.25, soundFile: undefined },
        { id: 'wh-r2', title: 'Breath Hold', duration: 2.0, soundFile: undefined },
        { id: 'wh-rec2', title: 'Recovery Hold', duration: 0.25, soundFile: undefined },
        { id: 'wh-b3', title: 'Power Breathing', duration: 1.25, soundFile: undefined },
        { id: 'wh-r3', title: 'Breath Hold', duration: 2.5, soundFile: undefined },
        { id: 'wh-rec3', title: 'Recovery Hold', duration: 0.25, soundFile: undefined },
    ],
});

export const cycleTemplates = [MEDI_TEMPLATE, POMODORO_TEMPLATE, WIMHOF_TEMPLATE];