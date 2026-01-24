/**
 * Timer Feature Public API
 * 
 * This is the ONLY file that should be imported from outside the timer feature.
 * All internal implementation details are encapsulated.
 */

// Components
export { TimerDisplay } from './components/timer-display';

// Hooks
export { useTimer } from './hooks/use-timer';

// Store
export { useTimerStore } from './store/timer-store';

// State Machine (for advanced usage)
export { timerMachine } from './machines/timer-machine';

// Types
export type {
  TimerEvent,
  TimerContext,
  TimerActor,
  TimerSnapshot,
  TimerState,
} from './types';
