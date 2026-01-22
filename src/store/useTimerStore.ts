
import { create } from 'zustand';
import { createActor, Actor } from 'xstate';
import { timerMachine } from '@/ai/timer-machine';
import { useCycleStore } from './useCycleStore';
import type { Timer, TimerSnapshot } from '@/lib/types';

// --- State and Store Types ---

interface TimerState {
    timerActor: Actor<typeof timerMachine> | null;
    snapshot: TimerSnapshot | null;
    send: (event: any) => void;
    initializeTimer: () => void;
    stopTimer: () => void;
}

// --- Store Implementation ---

export const useTimerStore = create<TimerState>((set, get) => ({
    timerActor: null,
    snapshot: null,
    send: (event) => {
        const { timerActor } = get();
        if (timerActor) {
            timerActor.send(event);
        } else {
            console.warn("Timer not initialized, cannot send event:", event);
            // Initialize and then send
            get().initializeTimer();
            // This is tricky because actor creation is async. A better approach
            // is to ensure initialization happens reliably on app start.
            // For now, we'll log a warning and the next user action will work.
        }
    },

    initializeTimer: () => {
        if (typeof window === 'undefined' || get().timerActor) return;

        const { currentCycle, currentPhaseIndex, playSounds } = useCycleStore.getState();
        const initialPhase = currentCycle?.phases[currentPhaseIndex];
        const initialDuration = initialPhase?.duration ?? 25;

        const newActor = createActor(timerMachine, {
            input: {
                duration: initialDuration * 60,

            }
        }).start();

        newActor.subscribe((snapshot) => {
            // Update the store with the latest snapshot
            set({ snapshot });

            // The "Brain": Auto-next logic when a phase finishes
            if (snapshot.matches('finished')) {
                const cycleStore = useCycleStore.getState();
                const { currentCycle, currentPhaseIndex } = cycleStore;

                if (!currentCycle) {
                    newActor.send({ type: 'STOP_FOR_EDIT' });
                    return;
                }
                
                // Play sound for the completed phase
                const completedPhase = currentCycle.phases[currentPhaseIndex];
                if (cycleStore.playSounds && completedPhase?.soundFile?.url) {
                    new Audio(completedPhase.soundFile.url).play().catch(err => console.error("Audio play failed:", err));
                }

                const nextIndex = currentPhaseIndex + 1;
                const isLastPhase = nextIndex >= currentCycle.phases.length;

                if (!isLastPhase) {
                    // Go to the next phase
                    const nextPhase = currentCycle.phases[nextIndex];
                    cycleStore.setCurrentPhaseIndex(nextIndex); // This will send the SELECT_PHASE event
                } else {

                    // Here you could loop, or just stop. We'll stop.
                    newActor.send({ type: 'STOP_FOR_EDIT' }); 
                    // Optionally, reset to the first phase visually
                    cycleStore.setCurrentPhaseIndex(0);
                }
            }
        });

        set({ timerActor: newActor, snapshot: newActor.getSnapshot() });
    },

    stopTimer: () => {
        get().timerActor?.stop();
        set({ timerActor: null, snapshot: null });
    },
}));
