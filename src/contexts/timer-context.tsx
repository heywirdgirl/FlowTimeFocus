
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
  const { currentCycle, currentPhase, advancePhase, resetCycle, logTraining, setCurrentPhaseIndex, audioLibrary } = useCycle();
  
  const [isActive, setIsActive] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [sessionPhaseRecords, setSessionPhaseRecords] = useState<PhaseRecord[]>([]);
  
  const getDuration = useCallback(() => {
    return currentPhase?.duration ? currentPhase.duration * 60 : 0;
  }, [currentPhase]);

  const [timeLeft, setTimeLeft] = useState(getDuration());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const soundRef = useRef<Howl | null>(null);
  const sessionsUntilLongRestRef = useRef(5);

  const playSound = useCallback(() => {
    if (!settings.playSounds) return;
    
    // Use the phase-specific sound, or fallback to the first sound in the library
    const fallbackSoundUrl = audioLibrary.length > 0 ? audioLibrary[0].url : null;
    const soundUrl = currentPhase?.soundFile?.url || fallbackSoundUrl;
    
    if (soundUrl) {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
      const sound = new Howl({
        src: [soundUrl],
        html5: true,
        onerror: (id, error) => {
            console.error("Howler error:", error);
        }
      });
      sound.play();
      soundRef.current = sound;
    }
  }, [settings.playSounds, currentPhase, audioLibrary]);

  // Effect to handle the countdown timer
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  // Effect to handle phase completion when timer runs out
  useEffect(() => {
    if (isActive && timeLeft <= 0) {
      setIsActive(false); // Stop the timer
      playSound();

      setSessionPhaseRecords(prev => [...prev, {
        title: currentPhase!.title,
        duration: currentPhase!.duration,
        completionStatus: 'completed'
      }]);
      
      const nextPhaseIndex = advancePhase();

      if (nextPhaseIndex >= (currentCycle?.phases.length || 0)) {
        const newCyclesCompleted = cyclesCompleted + 1;
        setCyclesCompleted(newCyclesCompleted);

        logTraining({
          cycleId: currentCycle!.id,
          name: currentCycle!.name,
          cycleCount: 1,
          totalDuration: sessionPhaseRecords.reduce((acc, r) => acc + r.duration, 0) + (currentPhase?.duration ?? 0),
          status: 'completed',
          phaseRecords: [...sessionPhaseRecords, {
            title: currentPhase!.title,
            duration: currentPhase!.duration,
            completionStatus: 'completed',
          }]
        });

        setSessionPhaseRecords([]);
        setCurrentPhaseIndex(0);

        if (sessionsUntilLongRestRef.current > 0 && newCyclesCompleted < sessionsUntilLongRestRef.current) {
           setIsActive(true); // Automatically start next cycle
        }
      } else {
        setIsActive(true); // Automatically start next phase
      }
    }
  }, [timeLeft]);


  // Effect to reset time when phase or cycle changes
  useEffect(() => {
    setTimeLeft(getDuration());
  }, [currentPhase, getDuration]);

  const reset = useCallback(() => {
    setIsActive(false);
    resetCycle();
    setCyclesCompleted(0);
    setSessionPhaseRecords([]);
  }, [resetCycle]);
  
  const startPause = (sessionsUntilLongRest: number) => {
    sessionsUntilLongRestRef.current = sessionsUntilLongRest;
    if (cyclesCompleted >= sessionsUntilLongRest && sessionsUntilLongRest > 0) {
      reset();
    } else {
      setIsActive(prev => !prev);
    }
  };

  const skip = () => {
    if (!currentCycle) return;
    
    setIsActive(false);
    playSound();
    
    setSessionPhaseRecords(prev => [...prev, {
        title: currentPhase!.title,
        duration: currentPhase!.duration,
        completionStatus: 'skipped'
    }]);

    const nextPhaseIndex = advancePhase();
    if (nextPhaseIndex >= currentCycle.phases.length) {
      setCyclesCompleted(prev => prev + 1);
      setCurrentPhaseIndex(0);
       if (sessionsUntilLongRestRef.current > 0 && cyclesCompleted + 1 < sessionsUntilLongRestRef.current) {
           setIsActive(true);
        }
    } else {
      setIsActive(true);
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
