"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { FC, ReactNode } from 'react';
import { useSettings } from './settings-context';
import type * as Tone from 'tone';
import { useCycle } from './cycle-context';

interface TimerContextType {
  timeLeft: number;
  isActive: boolean;
  cyclesCompleted: number;
  startPause: () => void;
  reset: () => void;
  skip: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

export const TimerProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const { currentCycle, currentPhaseIndex, advancePhase, resetCycle } = useCycle();
  const [isActive, setIsActive] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const getDuration = useCallback(() => {
    if (currentCycle && currentCycle.phases[currentPhaseIndex]) {
        const duration = currentCycle.phases[currentPhaseIndex].duration;
        return duration > 0 ? duration * 60 : 0;
    }
    return 0;
  }, [currentCycle, currentPhaseIndex]);

  const [timeLeft, setTimeLeft] = useState(getDuration());

  const synth = useRef<Tone.Synth | null>(null);
  const toneLoaded = useRef(false);

  useEffect(() => {
    if (toneLoaded.current) return;
    import('tone').then(Tone => {
      synth.current = new Tone.Synth().toDestination();
      toneLoaded.current = true;
    });
  }, []);

  const playSound = useCallback((note: string) => {
    if (settings.playSounds && synth.current) {
      synth.current.triggerAttackRelease(note, "8n");
    }
  }, [settings.playSounds]);
  
  const handleSessionEnd = useCallback(() => {
    playSound('C5'); // Sound for phase end
    
    if (currentCycle && currentPhaseIndex === currentCycle.phases.length - 1) {
        const newCyclesCompleted = cyclesCompleted + 1;
        setCyclesCompleted(newCyclesCompleted);

        if (settings.sessionsUntilLongRest > 0 && newCyclesCompleted >= settings.sessionsUntilLongRest) {
            setIsActive(false); // Stop the timer
            advancePhase(); // Go to first phase but don't start
            return;
        }
    }
    
    advancePhase();
  }, [playSound, advancePhase, currentCycle, currentPhaseIndex, cyclesCompleted, settings.sessionsUntilLongRest]);


  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft <= 0) {
      handleSessionEnd();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, handleSessionEnd]);

  useEffect(() => {
    setTimeLeft(getDuration());
  }, [currentPhaseIndex, currentCycle, getDuration]);
  
  const startPause = () => {
    if (cyclesCompleted >= settings.sessionsUntilLongRest && settings.sessionsUntilLongRest > 0) {
      reset();
      // Don't auto-start, let the user begin the new set of cycles.
    } else {
      setIsActive(!isActive);
    }
  };

  const reset = () => {
    setIsActive(false);
    resetCycle();
    setCyclesCompleted(0);
    setTimeLeft(getDuration());
  };

  const skip = () => {
    // a skip should not keep the timer running if it was paused
    handleSessionEnd();
    if (!isActive) {
        setTimeLeft(getDuration()); // Ensure new duration is set if paused
    }
  };

  const value = {
    timeLeft,
    isActive,
    cyclesCompleted,
    startPause,
    reset,
    skip
  }

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};
