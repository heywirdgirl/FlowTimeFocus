import type { Actor, SnapshotFrom } from 'xstate';
import type { timerMachine } from './machines/timer-machine';

/**
 * Timer events that can be sent to the state machine
 */
export type TimerEvent =
  | { type: 'TICK' }
  | { type: 'PAUSE' }
  | { type: 'START' }
  | { type: 'RESUME' }
  | { type: 'STOP_FOR_EDIT' }
  | { type: 'SELECT_PHASE'; duration: number }
  | { type: 'SELECT_CYCLE'; duration: number };

/**
 * Timer context state
 */
export interface TimerContext {
  duration: number;
  timeLeft: number;
}

/**
 * Timer machine actor type
 */
export type TimerActor = Actor<typeof timerMachine>;

/**
 * Timer machine snapshot type
 */
export type TimerSnapshot = SnapshotFrom<typeof timerMachine>;

/**
 * Timer state interface for Zustand store
 */
export interface TimerState {
  timerActor: TimerActor | null;
  snapshot: TimerSnapshot | null;
  send: (event: TimerEvent) => void;
  initializeTimer: () => void;
  stopTimer: () => void;
}
