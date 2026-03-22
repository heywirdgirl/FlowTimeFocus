/**
 * Lightweight event bus for timer commands emitted by the cycle store.
 *
 * This breaks the cycle-store → timer-store circular dependency.
 * The cycle store emits events here; the timer store subscribes on init.
 */

export type TimerCommand =
  | { type: 'SELECT_CYCLE'; duration: number }
  | { type: 'SELECT_PHASE'; duration: number }
  | { type: 'STOP_FOR_EDIT' };

type Listener = (command: TimerCommand) => void;

const listeners = new Set<Listener>();

export const timerEvents = {
  emit(command: TimerCommand): void {
    listeners.forEach((l) => l(command));
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
