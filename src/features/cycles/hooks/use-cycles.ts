import { useCycleStore } from '../store/cycle-store';

/**
 * Custom hook for cycles business logic
 * Provides a clean API for cycle operations, abstracting away the Zustand store details.
 */
export function useCycles() {
  const store = useCycleStore();
  const currentCycle = store.cycles.find(c => c.id === store.currentCycleId)

  return {
    // State
    cycles: store.cycles,
    currentCycle: currentCycle,
    currentPhase: currentCycle?.phases[store.currentPhaseIndex],
    currentPhaseIndex: store.currentPhaseIndex,
    isLoading: store.isLoading,
    error: store.error,

    // Computed
    isLastPhase: store.currentPhaseIndex === (currentCycle?.phases.length ?? 0) - 1,
    totalPhases: currentCycle?.phases.length ?? 0,
    
    // Actions
    selectCycle: store.setCurrentCycle,
    nextPhase: () => {
      if (!currentCycle) return;
      const nextIndex = store.currentPhaseIndex + 1;
      if (nextIndex < currentCycle.phases.length) {
        store.setCurrentPhaseIndex(nextIndex);
      }
    },
    previousPhase: () => {
      const prevIndex = store.currentPhaseIndex - 1;
      if (prevIndex >= 0) {
        store.setCurrentPhaseIndex(prevIndex);
      }
    },
    addPhase: store.addPhase,
    updatePhase: store.updatePhase,
    deletePhase: store.deletePhase,
    saveCycle: store.saveCurrentCycle,
    createCycle: store.createNewCycle,
    deleteCycle: store.deleteCycle,
    updateCycle: store.updateCycle,
  };
}