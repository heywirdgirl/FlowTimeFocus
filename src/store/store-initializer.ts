
// This file is the SINGLE SOURCE OF TRUTH for connecting different stores.
// It is imported only once in the root layout to prevent circular dependencies
// and ensure that stores are initialized and connected in the correct order.

import { useCycleStore } from './useCycleStore';
import { useTimerStore } from './useTimerStore';

// This subscriber is responsible for initializing the timer when the app loads
// and cycle data becomes available for the first time.
useCycleStore.subscribe(
    (state) => state.currentCycle?.id, // Only need to know if a cycle is loaded
    (currentCycleId, previousCycleId) => {
        // If we just got a cycle for the first time, initialize the timer.
        if (currentCycleId && !previousCycleId) {
            useTimerStore.getState().initializeTimer();
        }
    },
    { fireImmediately: true } // Ensures this runs on initial load
);
