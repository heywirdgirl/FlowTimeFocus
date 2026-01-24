import { useCycleStore } from '../store/cycle-store';
import type { Cycle, Phase } from '../types';

/**
 * Custom hook for cycles business logic
 * Provides clean API for cycle operations
 */
export function useCycles() {
  const store = useCycleStore();
  
  const currentCycle = store.cycles.find(c => c.id === store.currentCycleId) || null;
  const currentPhase = currentCycle?.phases[store.currentPhaseIndex] || null;
  
  return {
    // State
    cycles: store.cycles,
    currentCycle,
    currentPhase,
    currentPhaseIndex: store.currentPhaseIndex,
    playSounds: store.playSounds,
    isLoading: store.isLoading,
    error: store.error,
    
    // Computed
    isLastPhase: store.currentPhaseIndex === (currentCycle?.phases.length ?? 0) - 1,
    totalPhases: currentCycle?.phases.length ?? 0,
    canDeletePhase: (cycleId: string) => store.canDeletePhase(cycleId), // ✅ NEW
    
    // Cycle actions
    setCurrentCycle: store.setCurrentCycle,
    createCycle: store.createNewCycle,
    updateCycle: store.updateCycle,
    deleteCycle: store.deleteCycle,
    saveCyclesToStorage: store.saveCurrentCycle,
    
    // Phase actions
    setCurrentPhaseIndex: store.setCurrentPhaseIndex,
    addPhaseToCycle: store.addPhase,
    updatePhaseInCycle: store.updatePhase,
    deletePhaseFromCycle: store.deletePhase,
    
    // Phase navigation
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
    
    // Settings
    toggleSounds: store.toggleSounds,
    
    // Data sync
    loadGuestData: store.loadGuestData,
    startSync: store.startSync,
    stopSync: store.stopSync,
  };
}
