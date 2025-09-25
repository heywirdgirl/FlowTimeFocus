
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

    const fallbackSoundUrl = audioLibrary.length > 0 ? audioLibrary[0].url : "/sounds/sound1.wav";
    const soundUrl = currentPhase?.soundFile?.url || fallbackSoundUrl;

    if (soundUrl) {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
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
          // Retry with HTML5 audio fallback
          const fallbackAudio = new Audio(soundUrl);
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

  // Effect to handle the countdown timer
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


  // Effect for when timer runs out
  useEffect(() => {
    if (timeLeft > 0) return;
    if (!isActive) return;

    setIsActive(false);
    console.log("Timer ended, playing sound...");
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

      if (sessionsUntilLongRestRef.current > 0 && newCyclesCompleted >= sessionsUntilLongRestRef.current) {
         // Stop if we've completed all repeat cycles
         setIsActive(false);
      } else {
         setIsActive(true); // Automatically start next cycle
      }

    } else {
      setIsActive(true); // Automatically start next phase
    }

  }, [timeLeft]);

  // Effect to reset time when phase or cycle changes *manually*
  useEffect(() => {
    setTimeLeft(getDuration());
    if(isActive) {
      setIsActive(false); // Stop timer on manual phase change to prevent issues
    }
  }, [currentPhase?.id, currentCycle?.id]);

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
    } else {
      setIsActive(prev => !prev);
    }
  };

  const skip = () => {
    if (!currentCycle) return;
    
    // Stop any active timer
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
        setIsActive(false); // Stop if we've hit the end
      } else {
        setIsActive(true); // Start next cycle
      }
    } else {
      setIsActive(true); // Start next phase immediately
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
