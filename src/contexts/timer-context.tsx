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
  const { currentCycle, currentPhase, currentPhaseIndex, advancePhase, resetCycle, logTraining, setCurrentPhaseIndex } = useCycle();
  
  const [isActive, setIsActive] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [sessionPhaseRecords, setSessionPhaseRecords] = useState<PhaseRecord[]>([]);
  
  const getDuration = useCallback(() => {
    return currentPhase?.duration ? currentPhase.duration * 60 : 0;
  }, [currentPhase]);

  const [timeLeft, setTimeLeft] = useState(getDuration());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionsUntilLongRestRef = useRef(5);

  const playSound = useCallback(() => {
    if (!settings.playSounds) return;
    
    const soundUrl = currentPhase?.soundFile?.url || "/sounds/singing-bowl.mp3";
    
    if (soundUrl) {
      const sound = new Howl({
        src: [soundUrl],
        html5: true,
      });
      sound.play();
    }
  }, [settings.playSounds, currentPhase]);
  
  // Effect to reset timer when phase or cycle changes manually
  useEffect(() => {
    setTimeLeft(getDuration());
    setIsActive(false); // Always pause when phase changes
  }, [currentPhaseIndex, currentCycle, getDuration]);

  // Effect for the countdown interval
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  // Effect to handle phase/cycle completion when timer runs out
  useEffect(() => {
    if (isActive && timeLeft <= 0) {
      playSound();
      const nextPhaseIndex = advancePhase();

      // Check if the entire cycle is completed
      if (nextPhaseIndex >= (currentCycle?.phases.length || 0)) {
        const newCyclesCompleted = cyclesCompleted + 1;
        setCyclesCompleted(newCyclesCompleted);

        // Log the completed training session
        logTraining({
          cycleId: currentCycle!.id,
          name: currentCycle!.name,
          cycleCount: 1,
          totalDuration: sessionPhaseRecords.reduce((acc, r) => acc + r.duration, 0) + currentPhase!.duration,
          status: 'completed',
          phaseRecords: [...sessionPhaseRecords, {
              title: currentPhase!.title,
              duration: currentPhase!.duration,
              completionStatus: 'completed',
          }]
        });

        // Reset for the next cycle run
        setSessionPhaseRecords([]);
        setCurrentPhaseIndex(0); // Go back to the first phase

        // Stop if the desired number of cycles is completed
        if (sessionsUntilLongRestRef.current > 0 && newCyclesCompleted >= sessionsUntilLongRestRef.current) {
          setIsActive(false);
        }
      }
    }
  }, [timeLeft]);


  const reset = useCallback(() => {
    setIsActive(false);
    resetCycle();
    setCyclesCompleted(0);
    setSessionPhaseRecords([]);
    setTimeLeft(getDuration());
  }, [resetCycle, getDuration]);
  
  const startPause = (sessionsUntilLongRest: number) => {
    sessionsUntilLongRestRef.current = sessionsUntilLongRest;
    // If we've completed all cycles and press play again, reset the whole thing.
    if (cyclesCompleted >= sessionsUntilLongRest && sessionsUntilLongRest > 0) {
      reset();
    } else {
      setIsActive(!isActive);
    }
  };

  const skip = (sessionsUntilLongRest: number) => {
    sessionsUntilLongRestRef.current = sessionsUntilLongRest;
    
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }
    setIsActive(false); // Stop the timer
    playSound();
    
    // Log the skipped phase
    if (currentPhase) {
        setSessionPhaseRecords(prev => [...prev, {
            title: currentPhase.title,
            duration: currentPhase.duration,
            completionStatus: 'skipped',
        }]);
    }
    
    const nextPhaseIndex = advancePhase();

    if (nextPhaseIndex >= (currentCycle?.phases.length || 0)) {
        // Logic if skipping the last phase completes a cycle
        const newCyclesCompleted = cyclesCompleted + 1;
        setCyclesCompleted(newCyclesCompleted);
        logTraining({
            cycleId: currentCycle!.id,
            name: currentCycle!.name,
            cycleCount: 1,
            totalDuration: sessionPhaseRecords.reduce((acc, r) => acc + r.duration, 0),
            status: 'completed',
            phaseRecords: sessionPhaseRecords
        });
        setSessionPhaseRecords([]);
        setCurrentPhaseIndex(0);
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