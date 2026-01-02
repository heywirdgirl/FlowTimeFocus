
import { createMachine, assign, sendParent, fromCallback } from 'xstate';

export const timerMachine = createMachine({
  id: 'timer',
  initial: 'idle',
  context: ({ input }) => ({
    duration: input.duration, // Duration in seconds
    timeLeft: input.duration, // Time left in seconds
    interval: 1, // Tick interval in seconds
  }),
  states: {
    idle: {
      on: {
        START: 'running',
        RESET: {
          target: 'idle',
          internal: false, // Force re-entry to reset context
          actions: assign(({ context }) => ({ timeLeft: context.duration }))
        }
      }
    },
    running: {
      invoke: {
        id: 'interval-ticker',
        src: fromCallback(({ sendBack }) => {
          const id = setInterval(() => sendBack({ type: 'TICK' }), 1000);
          return () => clearInterval(id); // ✅ Cleanup cực kỳ quan trọng
        })
      },
      on: {
        TICK: {
          actions: assign({ 
            timeLeft: ({ context }) => context.timeLeft - context.interval 
          })
        },
        PAUSE: 'paused',
        STOP: 'idle',
        END: 'finished' // Transition to finished when timer ends
      },
      always: {
        target: 'finished',
        guard: ({ context }) => context.timeLeft <= 0
      }
    },
    paused: {
      on: {
        RESUME: 'running',
        STOP: 'idle'
      }
    },
    finished: {
      entry: 'onTimerEnd', // Custom action when timer finishes
      on: {
        RESET: 'idle' // Allow resetting from the finished state
      }
    }
  },
  // Global events that can be handled from any state
  on: {
    UPDATE_DURATION: {
        target: '.idle', // Go back to idle to reset everything
        internal: false, // CRITICAL: Force re-entry to apply new duration properly
        actions: assign({
          duration: ({ event }) => event.duration,
          timeLeft: ({ event }) => event.duration, // Reset timeLeft immediately
        }),
      },
    // Add the SKIP event handler with the correct relative target
    SKIP: '.finished' 
  },
});
