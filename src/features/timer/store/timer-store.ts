import { create } from 'zustand';
import { createActor } from 'xstate';
import { timerMachine } from '../machines/timer-machine';
import { useCycleStore } from '@/features/cycles';
import { timerEvents } from '@/shared/lib/timer-events';
import type { TimerState, TimerEvent } from '../types';

export const useTimerStore = create<TimerState>((set, get) => ({
  timerActor: null,
  snapshot: null,

  send: (event: TimerEvent) => {
    const { timerActor } = get();
    if (timerActor) {
      timerActor.send(event);
    } else {
      console.warn("Timer not initialized, cannot send event:", event);
      get().initializeTimer();
    }
  },

  initializeTimer: () => {
    if (typeof window === 'undefined' || get().timerActor) return;

    const { cycles, currentCycleId, currentPhaseIndex } = useCycleStore.getState();
    const currentCycle = cycles.find(c => c.id === currentCycleId);
    const initialPhase = currentCycle?.phases[currentPhaseIndex];
    const initialDuration = initialPhase?.duration ?? 25;

    const newActor = createActor(timerMachine, {
      input: {
        duration: initialDuration * 60,
      }
    }).start();

    // Forward cycle-store timer commands to the XState actor.
    // This replaces the require()-based calls in cycle-store and breaks
    // the cycle-store ↔ timer-store circular dependency.
    const unsubscribeEvents = timerEvents.subscribe((command) => {
      newActor.send(command);
    });

    newActor.subscribe((snapshot) => {
      set({ snapshot });

      // Auto-advance to the next phase when the current one finishes.
      if (snapshot.matches('finished')) {
        const cycleStore = useCycleStore.getState();
        const { cycles, currentCycleId, currentPhaseIndex, playSounds } = cycleStore;
        const currentCycle = cycles.find(c => c.id === currentCycleId);

        if (!currentCycle) {
          newActor.send({ type: 'STOP_FOR_EDIT' });
          return;
        }

        // Play the completed phase's sound if configured.
        const completedPhase = currentCycle.phases[currentPhaseIndex];
        if (playSounds && completedPhase?.soundFile?.url) {
          new Audio(completedPhase.soundFile.url)
            .play()
            .catch(err => console.error("Audio play failed:", err));
        }

        const nextIndex = currentPhaseIndex + 1;
        const isLastPhase = nextIndex >= currentCycle.phases.length;

        if (!isLastPhase) {
          // setCurrentPhaseIndex emits SELECT_PHASE via timerEvents, which the
          // subscription above forwards to newActor — no direct send needed.
          cycleStore.setCurrentPhaseIndex(nextIndex);
        } else {
          // All phases complete — reset to beginning.
          newActor.send({ type: 'STOP_FOR_EDIT' });
          cycleStore.setCurrentPhaseIndex(0);
        }
      }
    });

    set({
      timerActor: newActor,
      snapshot: newActor.getSnapshot(),
      _unsubscribeEvents: unsubscribeEvents,
    });
  },

  stopTimer: () => {
    get()._unsubscribeEvents?.();
    get().timerActor?.stop();
    set({ timerActor: null, snapshot: null, _unsubscribeEvents: undefined });
  },
}));