/**
 * Helper functions for cycle operations
 */
import type { Cycle, Phase } from '@/schemas';

export function validatePhase(phase: Partial<Phase>): boolean {
  return !!(phase.title && phase.duration && phase.duration > 0);
}

export function calculateTotalDuration(cycle: Cycle): number {
  return cycle.phases.reduce((sum, phase) => sum + phase.duration, 0);
}

export function getNextPhaseIndex(currentIndex: number, totalPhases: number): number | null {
  const next = currentIndex + 1;
  return next < totalPhases ? next : null;
}