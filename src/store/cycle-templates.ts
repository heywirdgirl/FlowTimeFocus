import { v4 as uuidv4 } from 'uuid';
import type { Cycle, Phase } from '@/lib/types';

// --- Default Data ---
export const DEFAULT_PHASE: Omit<Phase, 'id'> = {
    title: 'New Phase',
    duration: 10,
    soundFile: null,
};

// --- Helper function to create official cycles ---
// Giúp giảm bớt việc viết lặp lại các trường metadata của Cycle
const createOfficialCycle = (data: Partial<Cycle> & { phases: Phase[] }): Cycle => ({
    id: data.id || uuidv4(),
    name: data.name || 'Untitled Cycle',
    phases: data.phases,
    isPublic: true,
    authorId: 'system-official',
    authorName: 'Gemini Focus',
    likes: 0,
    shares: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data
});

// --- Official Templates ---

const MEDI_TEMPLATE = createOfficialCycle({
    id: 'template-meditation',
    name: 'Meditation Training',
    phases: [
        { id: 'md-b1', title: 'Start', duration: 1.0, soundFile: null },
        { id: 'rl-r1', title: 'Breath Hold', duration: 1.0, soundFile: null },
        { id: 'md-rec2', title: 'Phase 2', duration: 2.0, soundFile: null },
        { id: 'rl-b2', title: 'Relax', duration: 2.0, soundFile: null },
    ],
});

const POMODORO_TEMPLATE = createOfficialCycle({
    id: 'template-pomodoro',
    name: 'Classic Pomodoro',
    phases: [
        { id: 'p-w1', title: 'Work', duration: 25, soundFile: null },
        { id: 'p-b1', title: 'Short Break', duration: 5, soundFile: null },
        { id: 'p-w2', title: 'Work', duration: 25, soundFile: null },
        { id: 'p-b2', title: 'Short Break', duration: 5, soundFile: null },
        { id: 'p-w3', title: 'Work', duration: 25, soundFile: null },
        { id: 'p-b3', title: 'Short Break', duration: 5, soundFile: null },
        { id: 'p-w4', title: 'Work', duration: 25, soundFile: null },
        { id: 'p-b4', title: 'Long Break', duration: 15, soundFile: null },
    ],
});

const WIMHOF_TEMPLATE = createOfficialCycle({
    id: 'template-wimhof',
    name: 'Wim Hof Breathing',
    phases: [
        { id: 'wh-b1', title: 'Power Breathing', duration: 1.25, soundFile: null },
        { id: 'wh-r1', title: 'Breath Hold', duration: 1.5, soundFile: null },
        { id: 'wh-rec1', title: 'Recovery Hold', duration: 0.25, soundFile: null },
        { id: 'wh-b2', title: 'Power Breathing', duration: 1.25, soundFile: null },
        { id: 'wh-r2', title: 'Breath Hold', duration: 2.0, soundFile: null },
        { id: 'wh-rec2', title: 'Recovery Hold', duration: 0.25, soundFile: null },
        { id: 'wh-b3', title: 'Power Breathing', duration: 1.25, soundFile: null },
        { id: 'wh-r3', title: 'Breath Hold', duration: 2.5, soundFile: null },
        { id: 'wh-rec3', title: 'Recovery Hold', duration: 0.25, soundFile: null },
    ],
});

export const OFFICIAL_TEMPLATES = [MEDI_TEMPLATE, POMODORO_TEMPLATE, WIMHOF_TEMPLATE];
