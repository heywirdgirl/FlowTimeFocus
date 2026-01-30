import { useCycleStore } from '../store/cycle-store';
import type { Cycle, Phase } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Custom hook for cycles business logic
 * Provides clean API for cycle operations
 */
export function useCycles() {
  const store = useCycleStore();
  
  const currentCycle = store.cycles.find(c => c.id === store.currentCycleId) || null;
  const currentPhase = currentCycle?.phases[store.currentPhaseIndex] || null;

  const updateCycle = (updatedCycle: Cycle) => {
    store.updateCycle(updatedCycle);
  };

  const addPhase = (cycleId: string, phase: Omit<Phase, 'id'>) => {
    const targetCycle = store.cycles.find(c => c.id === cycleId);
    if (targetCycle) {
      const newPhase = { ...phase, id: uuidv4() };
      const updatedCycle = {
        ...targetCycle,
        phases: [...targetCycle.phases, newPhase],
      };
      updateCycle(updatedCycle);
    }
  };

  const updatePhase = (cycleId: string, updatedPhase: Phase) => {
    const targetCycle = store.cycles.find(c => c.id === cycleId);
    if (targetCycle) {
      const updatedPhases = targetCycle.phases.map(p => 
        p.id === updatedPhase.id ? updatedPhase : p
      );
      const updatedCycle = {
        ...targetCycle,
        phases: updatedPhases,
      };
      updateCycle(updatedCycle);
    }
  };

  const deletePhase = (cycleId: string, phaseId: string) => {
    const targetCycle = store.cycles.find(c => c.id === cycleId);
    if (targetCycle) {
      const updatedPhases = targetCycle.phases.filter(p => p.id !== phaseId);
      const updatedCycle = {
        ...targetCycle,
        phases: updatedPhases,
      };
      updateCycle(updatedCycle);
    }
  };

  const canDeletePhase = (cycleId: string) => {
    const targetCycle = store.cycles.find(c => c.id === cycleId);
    return targetCycle ? targetCycle.phases.length > 1 : false;
  };
  
  return {
    // State
    cycles: store.cycles,
    currentCycle,
    currentPhase,
    currentPhaseIndex: store.currentPhaseIndex,
    isLoading: store.loading,
    error: store.error,
    
    // Computed
    isLastPhase: store.currentPhaseIndex === (currentCycle?.phases.length ?? 0) - 1,
    totalPhases: currentCycle?.phases.length ?? 0,
    canDeleteCycle: () => store.canDeleteCycle(),
    canDeletePhase,
    
    // Cycle actions
    setCurrentCycle: store.setCurrentCycle,
    createCycle: store.createCycle,
    updateCycle,
    deleteCycle: store.deleteCycle,
    
    // Phase actions
    setCurrentPhaseIndex: store.setCurrentPhaseIndex,
    addPhaseToCycle: addPhase,
    updatePhaseInCycle: updatePhase,
    deletePhaseFromCycle: deletePhase,
    
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
    
    // Data sync
    loadGuestData: store.loadGuestData,
    startSync: store.startSync,
    stopSync: store.stopSync,
  };
}
