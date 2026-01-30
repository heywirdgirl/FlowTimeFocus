/**
 * Cycle and Phase related types
 */
export interface Phase {
  id: string;
  title: string;
  duration: number; // in minutes
  soundFile?: {
    url: string;
    name: string;
  };
  color?: string;
  description?: string;
}

export interface Cycle {
  id: string;
  name: string;
  phases: Phase[];
  userId?: string;
  createdAt?: any;
  updatedAt?: any;
}

export const DEFAULT_PHASE: Omit<Phase, 'id'> = {
  title: 'Focus',
  duration: 25,
};


export interface CycleState {
  cycles: Cycle[];
  currentCycleId: string | null;
  currentPhaseIndex: number;
  playSounds: boolean;
  // ... other state
}
