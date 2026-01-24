import { create } from 'zustand';
import { createActor } from 'xstate';
import { timerMachine } from '../machines/timer-machine';
import { useCycleStore } from '@/features/cycles';
import type { TimerState, TimerEvent } from '../types';

/**
 * Timer store using Zustand
 * Manages XState actor lifecycle and auto-next logic
 */
export const useTimerStore = create<TimerState>((set, get) => ({
  timerActor: null,
  snapshot: null,

  /**
   * Send an event to the timer state machine
   */
  send: (event: TimerEvent) => {
    const { timerActor } = get();
    if (timerActor) {
      timerActor.send(event);
    } else {
      console.warn("Timer not initialized, cannot send event:", event);
      // Auto-initialize and retry would be complex here
      // Better to ensure initialization happens on app start
      get().initializeTimer();
    }
  },

  /**
   * Initialize the timer actor with the current phase
   * Sets up subscription for auto-next logic
   */
  initializeTimer: () => {
    // Guard: only run on client-side and if not already initialized
    if (typeof window === 'undefined' || get().timerActor) return;

    const { cycles, currentCycleId, currentPhaseIndex, playSounds } = useCycleStore.getState();
    const currentCycle = cycles.find(c => c.id === currentCycleId);
    const initialPhase = currentCycle?.phases[currentPhaseIndex];
    const initialDuration = initialPhase?.duration ?? 25;

    // Create and start the actor
    const newActor = createActor(timerMachine, {
      input: {
        duration: initialDuration * 60, // Convert minutes to seconds
      }
    }).start();

    // Subscribe to state changes
    newActor.subscribe((snapshot) => {
      // Update Zustand store with latest snapshot
      set({ snapshot });

      // THE "BRAIN": Auto-next logic when phase finishes
      if (snapshot.matches('finished')) {
        const cycleStore = useCycleStore.getState();
        const { cycles, currentCycleId, currentPhaseIndex } = cycleStore;

        // Safety check
        if (!currentCycle) {
          newActor.send({ type: 'STOP_FOR_EDIT' });
          return;
        }
        
        // Play completion sound for the finished phase
        const completedPhase = currentCycle.phases[currentPhaseIndex];
        if (cycleStore.playSounds && completedPhase?.soundFile?.url) {
          new Audio(completedPhase.soundFile.url)
            .play()
            .catch(err => console.error("Audio play failed:", err));
        }

        const nextIndex = currentPhaseIndex + 1;
        const isLastPhase = nextIndex >= currentCycle.phases.length;

        if (!isLastPhase) {
          // Auto-advance to next phase
          cycleStore.setCurrentPhaseIndex(nextIndex);
          // Note: setCurrentPhaseIndex will send SELECT_PHASE event
        } else {
          // Cycle complete - stop and reset to first phase
          newActor.send({ type: 'STOP_FOR_EDIT' }); 
          cycleStore.setCurrentPhaseIndex(0);
        }
      }
    });

    // Update store with initialized actor
    set({ 
      timerActor: newActor, 
      snapshot: newActor.getSnapshot() 
    });
  },

  /**
   * Stop the timer and clean up resources
   */
  stopTimer: () => {
    get().timerActor?.stop();
    set({ timerActor: null, snapshot: null });
  },
}));
