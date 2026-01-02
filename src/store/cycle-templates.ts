
import { Cycle, Phase } from '@/lib/types';

// Default data for a new phase when added by a user
export const DEFAULT_PHASE: Omit<Phase, 'id'> = {
    name: 'New Phase',
    duration: 600, // 10 minutes
    type: 'work',
};

// Default data for guest users who are not logged in
export const GUEST_CYCLE: Cycle = {
    id: 'guest-cycle',
    name: 'My First Cycle',
    isTemplate: false,
    phases: [
        { id: 'p1', name: 'Work', duration: 1500, type: 'work' },
        { id: 'p2', name: 'Short Break', duration: 300, type: 'break' },
        { id: 'p3', name: 'Work', duration: 1500, type: 'work' },
        { id: 'p4', name: 'Long Break', duration: 900, type: 'break' },
    ],
    createdAt: new Date(), // Use client-side date for guests
};
