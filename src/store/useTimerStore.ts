
import { create } from 'zustand';
import { createActor } from 'xstate';
import { timerMachine } from '@/ai/timer-machine';
import { useCycleStore } from './useCycleStore';
import type { Timer, TimerSnapshot } from '@/lib/types';

// --- State and Store Types ---

interface TimerState {
    timerActor: Timer | null;
    snapshot: TimerSnapshot | null; // Store the entire snapshot
    send: (event: any) => void;
    initializeTimer: () => void;
    stopTimer: () => void;
}

// --- Store Implementation ---

export const useTimerStore = create<TimerState>((set, get) => ({
    timerActor: null,
    snapshot: null, // Initialize snapshot as null
    send: (event) => get().timerActor?.send(event),

    initializeTimer: () => {
        // Rule 8: Guard for SSR
        if (typeof window === 'undefined') return;

        const { timerActor } = get();
        if (timerActor) return; // Already initialized

        const { currentCycle, currentPhaseIndex } = useCycleStore.getState();
        const currentPhase = currentCycle?.phases[currentPhaseIndex];
        const initialDuration = currentPhase?.duration ?? 25;

        const newActor = createActor(timerMachine, {
            input: { duration: initialDuration * 60 },
            implementations: {
                actions: {
                    onTimerEnd: () => {
                        // To prevent circular dependencies, we use a dynamic require here.
                        const cycleStore = require('./useCycleStore').useCycleStore.getState();
                        const phaseOnEnd = cycleStore.currentCycle?.phases[cycleStore.currentPhaseIndex];
                        if (cycleStore.playSounds && phaseOnEnd?.soundFile?.url) {
                            new Audio(phaseOnEnd.soundFile.url).play().catch(err => console.error("Audio play failed:", err));
                        }
                        cycleStore.goToNextPhase();
                    },
                },
            }
        }).start();

        newActor.subscribe((snapshot) => {
            set({ snapshot }); // Update the store with the new snapshot
        });

        set({ timerActor: newActor, snapshot: newActor.getSnapshot() });
    },

    stopTimer: () => {
        get().timerActor?.stop();
        set({ timerActor: null, snapshot: null });
    },
}));
