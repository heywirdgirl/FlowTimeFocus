
import { createMachine, assign, fromCallback } from 'xstate';

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
          return () => clearInterval(id);
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
        target: '.idle', // CORRECTED: Use absolute target from root
        internal: false, 
        actions: assign({
          duration: ({ event }) => event.duration,
          timeLeft: ({ event }) => event.duration, 
        }),
      },
    SKIP: {
        target: '.finished' // CORRECTED: Use absolute target from root
    }
  },
});
