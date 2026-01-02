
// src/ai/timer-machine.ts
import { createMachine, assign, fromCallback } from 'xstate';

interface TimerContext {
  timeLeft: number;
  duration: number; // đơn vị giây
}

// This state machine defines the behavior of the timer.
export const timerMachine = createMachine({
  id: 'timer',
  initial: 'idle',
  // The initial context is set from the input, which will be the duration
  // of the first phase when the application loads.
  context: ({ input }: { input: { duration: number } }) => ({
    timeLeft: input.duration,
    duration: input.duration,
  }),

  // This is a global event handler. It can respond to the UPDATE_DURATION
  // event regardless of the current state (idle, running, or paused).
  on: {
    UPDATE_DURATION: {
      // When the phase changes, we always want to go back to the 'idle' state.
      // The '.' prefix is required for targets from the root node.
      target: '.idle',
      // We then update the context, setting both the total duration and the
      // timeLeft to the new duration received from the event.
      actions: assign({
        duration: ({ event }) => event.duration,
        timeLeft: ({ event }) => event.duration,
      }),
    },
  },

  states: {
    idle: {
      on: {
        START: 'running',
        // A manual reset should only reset timeLeft, not the whole duration.
        RESET: {
          actions: assign({
            timeLeft: ({ context }) => context.duration,
          }),
        },
      },
    },
    running: {
      // This `invoke` creates a persistent process (an interval) that sends
      // a 'TICK' event every second.
      invoke: {
        src: fromCallback(({ sendBack }) => {
          const interval = setInterval(() => sendBack({ type: 'TICK' }), 1000);
          // The cleanup function clears the interval when the state is exited.
          return () => clearInterval(interval);
        }),
      },
      on: {
        TICK: [
          {
            // If time runs out, transition to the 'completed' state.
            target: 'completed',
            guard: ({ context }) => context.timeLeft <= 1,
          },
          {
            // Otherwise, just decrement timeLeft.
            actions: assign({ timeLeft: ({ context }) => context.timeLeft - 1 }),
          },
        ],
        PAUSE: 'paused',
        SKIP: 'completed',
        // RESET while running should stop the timer and reset timeLeft.
        RESET: {
          target: 'idle',
          actions: assign({ timeLeft: ({ context }) => context.duration }),
        },
      },
    },
    paused: {
      on: {
        RESUME: 'running',
        // RESET while paused should also go to idle and reset timeLeft.
        RESET: {
          target: 'idle',
          actions: assign({ timeLeft: ({ context }) => context.duration }),
        },
      },
    },
    completed: {
      // This state is entered briefly when the timer finishes.
      // It immediately transitions back to 'idle', creating a loop.
      always: {
        target: 'idle',
        actions: assign({
            // When the timer completes and loops, reset timeLeft for the next run.
            timeLeft: ({ context }) => context.duration,
        }),
      },
      entry: 'onTimerEnd', // Placeholder for side-effect logic
    },
  },
});
