
"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { FC, ReactNode } from 'react';
import { useSettings } from './settings-context';
import type { PhaseRecord } from '@/lib/types';
import { useCycle } from './cycle-context';
import { Howl } from 'howler';

interface TimerContextType {
  timeLeft: number;
  isActive: boolean;
  cyclesCompleted: number;
  sessionPhaseRecords: PhaseRecord[];
  startPause: (sessionsUntilLongRest: number) => void;
  reset: () => void;
  skip: (sessionsUntilLongRest: number) => void;
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
  const { currentCycle, currentPhaseIndex, advancePhase, resetCycle, logTraining, setCurrentPhaseIndex, currentPhase } = useCycle();
  
  const [isActive, setIsActive] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [sessionPhaseRecords, setSessionPhaseRecords] = useState<PhaseRecord[]>([]);

  const getDuration = useCallback(() => {
    if (currentCycle && currentPhaseIndex < currentCycle.phases.length) {
      const duration = currentCycle.phases[currentPhaseIndex].duration;
      return duration > 0 ? duration * 60 : 0;
    }
    return 0;
  }, [currentCycle, currentPhaseIndex]);

  const [timeLeft, setTimeLeft] = useState(getDuration());

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionsUntilLongRestRef = useRef(5);
  const soundRef = useRef<Howl | null>(null);

  const playSound = useCallback(() => {
    if (!settings.playSounds) return;
    
    const soundUrl = currentPhase?.soundFile?.url || "/sounds/singing-bowl.mp3";
    
    if (soundUrl) {
      if (soundRef.current) {
        soundRef.current.stop();
      }
      soundRef.current = new Howl({
        src: [soundUrl],
        html5: true,
      });
      soundRef.current.play();
    }
  }, [settings.playSounds, currentPhase]);
  
  // Main timer loop
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft <= 0) {
      // Phase ended automatically
      if (currentPhase) {
        setSessionPhaseRecords(prev => [...prev, {
          title: currentPhase.title,
          duration: currentPhase.duration,
          completionStatus: 'completed',
        }]);
      }
      
      playSound();
      
      const nextPhaseIndex = advancePhase();

      if (currentCycle && nextPhaseIndex >= currentCycle.phases.length) {
        // Cycle completed
        const newCyclesCompleted = cyclesCompleted + 1;
        setCyclesCompleted(newCyclesCompleted);

        logTraining({
            cycleId: currentCycle.id,
            name: currentCycle.name,
            cycleCount: 1,
            totalDuration: sessionPhaseRecords.reduce((acc, r) => acc + r.duration, 0) + (currentPhase?.duration || 0),
            status: 'completed',
            phaseRecords: [...sessionPhaseRecords, {
                title: currentPhase!.title,
                duration: currentPhase!.duration,
                completionStatus: 'completed',
            }]
        });
        setSessionPhaseRecords([]);
        setCurrentPhaseIndex(0);

        if (sessionsUntilLongRestRef.current > 0 && newCyclesCompleted >= sessionsUntilLongRestRef.current) {
            setIsActive(false); // Stop timer if all repeat cycles are done
        }
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, currentCycle, currentPhase, cyclesCompleted, sessionPhaseRecords, advancePhase, logTraining, playSound, setCurrentPhaseIndex]);

  // Reset timer value when phase changes
  useEffect(() => {
    setTimeLeft(getDuration());
  }, [currentPhaseIndex, getDuration]);

  // Full reset when cycle is changed
  useEffect(() => {
    reset();
  }, [currentCycle]);

  const startPause = (sessionsUntilLongRest: number) => {
    sessionsUntilLongRestRef.current = sessionsUntilLongRest;
    if (cyclesCompleted >= sessionsUntilLongRest && sessionsUntilLongRest > 0) {
      reset();
    } else {
      setIsActive(!isActive);
    }
  };

  const reset = useCallback(() => {
    setIsActive(false);
    resetCycle();
    setCyclesCompleted(0);
    setSessionPhaseRecords([]);
    setTimeLeft(getDuration());
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [getDuration, resetCycle]);

  const handleSkip = useCallback(() => {
    if (currentPhase) {
      setSessionPhaseRecords(prev => [...prev, {
        title: currentPhase.title,
        duration: currentPhase.duration,
        completionStatus: 'skipped',
      }]);
    }

    playSound();
    
    const nextPhaseIndex = advancePhase();

    if (currentCycle && nextPhaseIndex >= currentCycle.phases.length) {
      const newCyclesCompleted = cyclesCompleted + 1;
      setCyclesCompleted(newCyclesCompleted);

      logTraining({
        cycleId: currentCycle.id,
        name: currentCycle.name,
        cycleCount: 1,
        totalDuration: sessionPhaseRecords.reduce((acc, r) => acc + r.duration, 0) + (currentPhase?.duration || 0),
        status: 'completed',
        phaseRecords: [...sessionPhaseRecords, {
          title: currentPhase!.title,
          duration: currentPhase!.duration,
          completionStatus: 'skipped',
        }]
      })
      setSessionPhaseRecords([]);
      
      setCurrentPhaseIndex(0);

      if (sessionsUntilLongRestRef.current > 0 && newCyclesCompleted >= sessionsUntilLongRestRef.current) {
          setIsActive(false);
          return true; // Indicate that the timer should stop
      }
    }
    return false; // Indicate that the timer should continue
  }, [playSound, advancePhase, currentCycle, cyclesCompleted, logTraining, currentPhase, sessionPhaseRecords, setCurrentPhaseIndex]);


  const skip = (sessionsUntilLongRest: number) => {
    sessionsUntilLongRestRef.current = sessionsUntilLongRest;
    setIsActive(false); // Stop the timer when skipping
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    const shouldStop = handleSkip();

    if (shouldStop) {
      setTimeLeft(getDuration());
    } else {
      // Set timer to next phase duration, but don't start it.
      const nextIndex = currentCycle ? (currentPhaseIndex + 1) % currentCycle.phases.length : 0;
      const nextPhaseDuration = currentCycle?.phases[nextIndex]?.duration ?? 0;
      setTimeLeft(nextPhaseDuration * 60);
    }
  };

  const value = {
    timeLeft,
    isActive,
    cyclesCompleted,
    sessionPhaseRecords,
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
