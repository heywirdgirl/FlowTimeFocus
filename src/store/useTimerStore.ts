
import { create } from 'zustand';
import { createActor } from 'xstate';
import { timerMachine } from '@/ai/timer-machine';
import { useCycleStore } from './useCycleStore';
import type { Timer } from '@/lib/types';

// --- State and Store Types ---

interface TimerState {
    timerActor: Timer | null;
    timeLeft: number;
    isActive: boolean;
    send: (event: any) => void;
    initializeTimer: () => void;
}

// --- Store Implementation ---

export const useTimerStore = create<TimerState>((set, get) => ({
    timerActor: null,
    timeLeft: 0,
    isActive: false,
    send: (event) => get().timerActor?.send(event),

    initializeTimer: () => {
        get().timerActor?.stop();

        const { currentCycle, currentPhaseIndex } = useCycleStore.getState();
        const currentPhase = currentCycle?.phases[currentPhaseIndex];

        if (!currentPhase) return;

        const newActor = createActor(timerMachine, {
            input: { duration: currentPhase.duration * 60 },
            actions: {
                onTimerEnd: () => {
                    const cycleState = useCycleStore.getState();
                    const phaseOnEnd = cycleState.currentCycle?.phases[cycleState.currentPhaseIndex];
                    if (cycleState.playSounds && phaseOnEnd?.soundFile?.url) {
                        new Audio(phaseOnEnd.soundFile.url).play().catch(err => console.error("Audio play failed:", err));
                    }
                    cycleState.goToNextPhase();
                },
            },
        }).start();

        newActor.subscribe((snapshot) => {
            set({ 
                timeLeft: snapshot.context.timeLeft, 
                isActive: snapshot.matches('running') 
            });
        });

        set({ timerActor: newActor });
    },
}));

// The subscription logic has been removed from this file to prevent circular dependencies.
// It is now located in 'src/store/store-initializer.ts' and imported in the root layout.
