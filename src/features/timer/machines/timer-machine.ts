import { setup, assign, fromCallback } from 'xstate';

/**
 * Timer state machine for managing Pomodoro/Flow Time cycles
 * 
 * States:
 * - idle: Waiting to start
 * - running: Timer is actively counting down
 * - paused: Timer is paused, can be resumed
 * - finished: Timer has completed
 * 
 * Global Events (can be called from any state):
 * - SELECT_PHASE: Start a new phase immediately
 * - SELECT_CYCLE: Load a new cycle (but don't start)
 * - STOP_FOR_EDIT: Stop timer for editing
 */
export const timerMachine = setup({
  types: {
    context: {} as {
      duration: number;
      timeLeft: number;
    },
    events: {} as
      | { type: 'TICK' }
      | { type: 'PAUSE' }
      | { type: 'START' }
      | { type: 'RESUME' }
      | { type: 'STOP_FOR_EDIT' }
      | { type: 'SELECT_PHASE'; duration: number }
      | { type: 'SELECT_CYCLE'; duration: number },
    input: {} as { duration: number }
  },

  actors: {
    /**
     * Interval ticker that sends TICK events every second
     */
    intervalTicker: fromCallback(({ sendBack }) => {
      const id = setInterval(() => sendBack({ type: 'TICK' }), 1000);
      return () => clearInterval(id);
    })
  },

  actions: {
    /**
     * Decrement time by 1 second
     */
    decrementTime: assign({
      timeLeft: ({ context }) => context.timeLeft - 1
    }),
    
    /**
     * Update context with new duration and reset timeLeft
     */
    updateContext: assign({
      duration: ({ event }) => 'duration' in event ? event.duration : 0,
      timeLeft: ({ event }) => 'duration' in event ? event.duration : 0,
    })
  }
}).createMachine({
  id: 'flow-timer',
  initial: 'idle',
  
  context: ({ input }) => ({
    duration: input.duration,
    timeLeft: input.duration,
  }),

  // GLOBAL EVENTS: Can be triggered from any state
  on: {
    /**
     * SELECT_PHASE: User selects a phase or auto-next triggers
     * Updates context AND starts running immediately
     */
    SELECT_PHASE: {
      target: '.running', 
      reenter: true, // Reset timer if already running
      actions: 'updateContext'
    },
    
    /**
     * SELECT_CYCLE: User selects a new cycle
     * Load first phase but DON'T auto-start
     */
    SELECT_CYCLE: {
      target: '.idle',
      reenter: true, // Ensure exit from other states
      actions: 'updateContext'
    },

    /**
     * STOP_FOR_EDIT: User clicks Edit/Delete
     * Stop everything and return to idle
     */
    STOP_FOR_EDIT: {
      target: '.idle',
      reenter: true // Ensure exit from running/paused
    }
  },

  states: {
    idle: {
      on: {
        START: 'running',
      }
    },

    running: {
      invoke: {
        id: 'ticker',
        src: 'intervalTicker'
      },
      on: {
        TICK: {
          actions: 'decrementTime'
        },
        PAUSE: 'paused',
      },
      // Auto-check for completion
      always: {
        target: 'finished',
        guard: ({ context }) => context.timeLeft <= 0
      }
    },

    paused: {
      on: {
        RESUME: 'running',
      }
    },

    finished: {
      // Terminal state - waiting for next action
    }
  }
});
