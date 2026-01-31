import { create } from 'zustand';
import { createActor, type ActorRefFrom, type SnapshotFrom } from 'xstate';
import { timerMachine } from '../machines/timer-machine';
import { useCycleStore } from '@/features/cycles';
import type { TimerEvent } from '../hooks/use-timer';

// The state of the timer store
export interface TimerState {
  timerActor: ActorRefFrom<typeof timerMachine> | null;
  snapshot: SnapshotFrom<typeof timerMachine> | null;
  send: (event: TimerEvent) => void;
  initializeTimer: () => void;
  stopTimer: () => void;
}

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

    newActor.subscribe((snapshot) => {
      set({ snapshot });

      // Auto-next logic when phase finishes
      if (snapshot.matches('finished')) {
        const cycleStore = useCycleStore.getState();
        const { cycles, currentCycleId, currentPhaseIndex, playSounds } = cycleStore;
        
        // ✅ Get fresh currentCycle reference
        const currentCycle = cycles.find(c => c.id === currentCycleId);

        if (!currentCycle) {
          newActor.send({ type: 'STOP_FOR_EDIT' });
          return;
        }
        
        // Play completion sound
        const completedPhase = currentCycle.phases[currentPhaseIndex];
        if (playSounds && completedPhase?.soundFile?.url) {
          new Audio(completedPhase.soundFile.url)
            .play()
            .catch(err => console.error("Audio play failed:", err));
        }

        const nextIndex = currentPhaseIndex + 1;
        const isLastPhase = nextIndex >= currentCycle.phases.length;

        if (!isLastPhase) {
          // ✅ Update index and send SELECT_PHASE
          const nextPhase = currentCycle.phases[nextIndex];
          cycleStore.setCurrentPhaseIndex(nextIndex);
          
          // 🔥 KEY FIX: Send SELECT_PHASE to restart timer
          newActor.send({ 
            type: 'SELECT_PHASE', 
            duration: nextPhase.duration * 60 
          });
          
        } else {
          // Cycle complete
          newActor.send({ type: 'STOP_FOR_EDIT' }); 
          cycleStore.setCurrentPhaseIndex(0);
        }
      }
    });

    set({ 
      timerActor: newActor, 
      snapshot: newActor.getSnapshot() 
    });
  },

  stopTimer: () => {
    get().timerActor?.stop();
    set({ timerActor: null, snapshot: null });
  },
}));
