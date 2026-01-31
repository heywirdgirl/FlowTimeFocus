import { useTimerStore } from '../store/timer-store';

// All possible events that can be sent to the timer machine
export type TimerEvent = 
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'STOP' } 
  | { type: 'STOP_FOR_EDIT' } 
  | { type: 'SELECT_PHASE'; duration: number }
  | { type: 'SELECT_CYCLE'; duration: number };


/**
 * Custom hook for timer business logic
 * Provides a clean API for components to interact with the timer
 */
export function useTimer() {
  const { snapshot, send, initializeTimer, stopTimer } = useTimerStore();

  // Computed values
  const timeLeft = snapshot?.context.timeLeft ?? 0;
  const duration = snapshot?.context.duration ?? 0;
  const isRunning = snapshot?.matches('running') ?? false;
  const isPaused = snapshot?.matches('paused') ?? false;
  const isIdle = snapshot?.matches('idle') ?? false;
  const isFinished = snapshot?.matches('finished') ?? false;

  // Helper functions
  const start = () => send({ type: 'START' });
  const pause = () => send({ type: 'PAUSE' });
  const resume = () => send({ type: 'RESUME' });
  const stopForEdit = () => send({ type: 'STOP_FOR_EDIT' });
  
  const selectPhase = (durationInMinutes: number) => {
    send({ type: 'SELECT_PHASE', duration: durationInMinutes * 60 });
  };
  
  const selectCycle = (durationInMinutes: number) => {
    send({ type: 'SELECT_CYCLE', duration: durationInMinutes * 60 });
  };

  /**
   * Toggle between play/pause/resume
   */
  const toggle = () => {
    if (isRunning) {
      pause();
    } else if (isPaused) {
      resume();
    } else {
      start();
    }
  };

  /**
   * Format time in MM:SS format
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  /**
   * Calculate progress percentage (0-100)
   */
  const progress = duration > 0 
    ? ((duration - timeLeft) / duration) * 100 
    : 0;

  return {
    // State
    timeLeft,
    duration,
    isRunning,
    isPaused,
    isIdle,
    isFinished,
    progress,
    snapshot,
    
    // Actions
    start,
    pause,
    resume,
    toggle,
    stopForEdit,
    selectPhase,
    selectCycle,
    send,
    
    // Utilities
    formatTime: (seconds?: number) => formatTime(seconds ?? timeLeft),
    
    // Lifecycle
    initializeTimer,
    stopTimer,
  };
}
