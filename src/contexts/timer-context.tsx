
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
  const { currentCycle, currentPhaseIndex, currentPhase, advancePhase, resetCycle, logTraining, setCurrentPhaseIndex, audioLibrary } = useCycle();
  
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
    
    // First, try to get the sound from the current phase
    let soundUrl = currentPhase?.soundFile?.url;

    // If not available, use the first sound in the library as a fallback
    if (!soundUrl && audioLibrary.length > 0) {
      soundUrl = audioLibrary[0].url;
    }
    
    if (soundUrl) {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
        soundRef.current = null;
      }
      
      const sound = new Howl({
        src: [soundUrl],
        html5: true,
        volume: 0.8,
        onload: () => {
          console.log('Sound loaded successfully, playing...');
          sound.play();
        },
        onplay: () => console.log('Sound playing!'),
        onerror: (id, error) => {
          console.error('Howler error:', error);
          const fallbackAudio = new Audio(soundUrl!);
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

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
            if (prev <= 1) {
                clearInterval(intervalRef.current!);
                return 0;
            }
            return prev - 1
        });
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

  useEffect(() => {
    if (timeLeft > 0 || !isActive) return;

    // This is the sequence that runs when a phase ends
    // 1. Stop the timer temporarily
    setIsActive(false);

    // 2. Play the sound
    console.log("Timer ended, playing sound...");
    playSound();

    // 3. Record the completed phase
    setSessionPhaseRecords(prev => [...prev, {
      title: currentPhase!.title,
      duration: currentPhase!.duration,
      completionStatus: 'completed'
    }]);
    
    // 4. Advance to the next phase
    const nextPhaseIndex = advancePhase();

    // 5. Check if the cycle is over or continue
    if (nextPhaseIndex >= (currentCycle?.phases.length || 0)) {
      // Cycle finished
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
      setCurrentPhaseIndex(0); // Reset for the next potential cycle run

      // Stop if we have completed all the repeat cycles
      if (sessionsUntilLongRestRef.current > 0 && newCyclesCompleted >= sessionsUntilLongRestRef.current) {
         setIsActive(false); 
      } else {
         setIsActive(true); // Automatically start the next cycle
      }

    } else {
      setIsActive(true); // Automatically start the next phase
    }

  }, [timeLeft]);

  useEffect(() => {
    setTimeLeft(getDuration());
    if(isActive) {
      // Let the end-of-phase effect handle the transition.
      // This stops the timer if the user manually clicks on a different phase button.
      setIsActive(false); 
    }
  }, [currentPhase?.id, currentCycle?.id]);

  const reset = useCallback(() => {
    setIsActive(false);
    resetCycle();
    setCyclesCompleted(0);
    setSessionPhaseRecords([]);
    // getDuration will be based on the reset cycle's first phase
  }, [resetCycle]);
  
  useEffect(() => {
      setTimeLeft(getDuration());
  }, [getDuration, cyclesCompleted, currentPhaseIndex])

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
    console.log('Skipping phase, playing sound...');
    playSound();
    
    setSessionPhaseRecords(prev => [...prev, {
        title: currentPhase!.title,
        duration: currentPhase!.duration,
        completionStatus: 'skipped'
    }]);

    const nextPhaseIndex = advancePhase();
    if (nextPhaseIndex >= currentCycle.phases.length) {
      const newCyclesCompleted = cyclesCompleted + 1;
      setCyclesCompleted(newCyclesCompleted);
      setCurrentPhaseIndex(0);
      if (sessionsUntilLongRestRef.current > 0 && newCyclesCompleted >= sessionsUntilLongRestRef.current) {
        setIsActive(false); 
      } else {
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
