
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
  const { currentCycle, currentPhaseIndex, currentPhase, advancePhase, resetCycle, logTraining, setCurrentPhaseIndex, audioLibrary, endOfCycleSound } = useCycle();
  
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

  const playSound = useCallback((soundUrl?: string | null) => {
    if (!settings.playSounds) return;

    // Determine the sound to play
    const urlToPlay = soundUrl || currentPhase?.soundFile?.url || audioLibrary[0]?.url;

    if (urlToPlay) {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
        soundRef.current = null;
      }
      
      const sound = new Howl({
        src: [urlToPlay],
        html5: true,
        volume: 0.8,
        onload: () => {
          console.log('Sound loaded successfully, playing...');
          sound.play();
        },
        onplay: () => console.log('Sound playing!'),
        onerror: (id, error) => {
          console.error('Howler error:', error);
          const fallbackAudio = new Audio(urlToPlay);
          fallbackAudio.volume = 0.8;
          fallbackAudio.play().catch(e => console.error('Fallback play error:', e));
        },
        onend: () => console.log('Sound ended'),
      });
      soundRef.current = sound;
    } else {
        console.log('No sound URL available');
    }
  }, [settings.playSounds, currentPhase, audioLibrary]);

  // Main timer tick effect
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  // Effect for when a phase timer ends
  useEffect(() => {
    if (timeLeft > 0 || !isActive) return;

    // This sequence runs when a phase ends
    setIsActive(false);

    // Record the completed phase
    setSessionPhaseRecords(prev => [...prev, {
      title: currentPhase!.title,
      duration: currentPhase!.duration,
      completionStatus: 'completed'
    }]);
    
    // Check if the cycle is over or continue
    const isLastPhase = currentPhaseIndex >= (currentCycle?.phases.length || 0) - 1;

    if (isLastPhase) {
      const newCyclesCompleted = cyclesCompleted + 1;
      setCyclesCompleted(newCyclesCompleted);

      // Check if all repeated cycles are done
      if (sessionsUntilLongRestRef.current > 0 && newCyclesCompleted >= sessionsUntilLongRestRef.current) {
        // All cycles finished, play end sound and stop
        playSound(endOfCycleSound?.url);
        logTraining({
          cycleId: currentCycle!.id,
          name: currentCycle!.name,
          cycleCount: newCyclesCompleted,
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
        setIsActive(false); // Stop timer
      } else {
        // Finished one cycle, but more to go.
        playSound(); // Play regular phase end sound
        setCurrentPhaseIndex(0);
        setIsActive(true); // Automatically start the next cycle
      }
    } else {
      // Not the last phase, just advance
      playSound(); // Play regular phase end sound
      advancePhase();
      setIsActive(true); // Automatically start the next phase
    }

  }, [timeLeft, isActive]);

  // Reset timer when phase or cycle changes from outside
  useEffect(() => {
    setTimeLeft(getDuration());
    // Don't change isActive here to avoid interrupting flow
  }, [currentPhase, currentCycle, getDuration]);


  const reset = useCallback(() => {
    setIsActive(false);
    resetCycle();
    setCyclesCompleted(0);
    setSessionPhaseRecords([]);
    setTimeLeft(getDuration());
  }, [resetCycle, getDuration]);
  
  const startPause = (sessionsUntilLongRest: number) => {
    sessionsUntilLongRestRef.current = sessionsUntilLongRest;
    if (cyclesCompleted >= sessionsUntilLongRest && sessionsUntilLongRest > 0) {
      reset();
    }
    setIsActive(prev => !prev);
  };

  const skip = (sessionsUntilLongRest: number) => {
    if (!currentCycle) return;
    
    sessionsUntilLongRestRef.current = sessionsUntilLongRest;
    setIsActive(false); 
    
    setSessionPhaseRecords(prev => [...prev, {
        title: currentPhase!.title,
        duration: currentPhase!.duration,
        completionStatus: 'skipped'
    }]);

    const isLastPhase = currentPhaseIndex >= currentCycle.phases.length - 1;

    if (isLastPhase) {
      const newCyclesCompleted = cyclesCompleted + 1;
      setCyclesCompleted(newCyclesCompleted);

      if (sessionsUntilLongRestRef.current > 0 && newCyclesCompleted >= sessionsUntilLongRestRef.current) {
        playSound(endOfCycleSound?.url);
        setIsActive(false);
        setCurrentPhaseIndex(0);
      } else {
        playSound();
        setCurrentPhaseIndex(0);
        setIsActive(true);
      }
    } else {
      playSound();
      advancePhase();
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

    