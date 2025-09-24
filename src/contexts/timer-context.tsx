
"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { FC, ReactNode } from 'react';
import { useSettings } from './settings-context';
import type { PhaseRecord } from '@/lib/types';
import { useCycle } from './cycle-context';
import type * as Tone from 'tone';

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
    if (currentCycle && currentCycle.phases[currentPhaseIndex]) {
        const duration = currentCycle.phases[currentPhaseIndex].duration;
        return duration > 0 ? duration * 60 : 0;
    }
    return 0;
  }, [currentCycle, currentPhaseIndex]);

  const [timeLeft, setTimeLeft] = useState(getDuration());

  const synth = useRef<Tone.Synth | null>(null);
  const ToneRef = useRef<typeof import('tone') | null>(null);
  const sessionsUntilLongRestRef = useRef(5);
  const isAudioInitialized = useRef(false);

  useEffect(() => {
    const initializeAudio = async () => {
      if (isAudioInitialized.current) return;
      const ToneModule = await import('tone');
      ToneRef.current = ToneModule;
      if (!synth.current) {
        synth.current = new ToneModule.Synth().toDestination();
      }
      isAudioInitialized.current = true;
    };
    initializeAudio();

    return () => {
      if (synth.current) {
        synth.current.dispose();
        synth.current = null;
        isAudioInitialized.current = false;
      }
    };
  }, []);

  const playSound = useCallback((note: string) => {
    if (settings.playSounds && synth.current && ToneRef.current) {
        const tone = ToneRef.current;
        if (tone.context.state !== 'running') {
            tone.context.resume();
        }
        // Schedule the sound to play at the current time in the audio context
        synth.current.triggerAttackRelease(note, "8n", tone.now());
    }
  }, [settings.playSounds]);
  
  const handleSessionEnd = useCallback((status: 'completed' | 'skipped') => {
    if (currentPhase) {
      setSessionPhaseRecords(prev => [...prev, {
        title: currentPhase.title,
        duration: currentPhase.duration,
        completionStatus: status,
      }]);
    }

    playSound('C5');
    
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
          completionStatus: status,
        }]
      })
      setSessionPhaseRecords([]);
      
      setCurrentPhaseIndex(0);

      if (sessionsUntilLongRestRef.current > 0 && newCyclesCompleted >= sessionsUntilLongRestRef.current) {
          setIsActive(false);
          return;
      }
    }
  }, [playSound, advancePhase, currentCycle, cyclesCompleted, logTraining, currentPhase, sessionPhaseRecords, setCurrentPhaseIndex]);


  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft <= 0) {
      handleSessionEnd('completed');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, handleSessionEnd]);

  useEffect(() => {
    // When the phase changes, reset the timer to the new duration
    // Only reset if the timer isn't already active from a previous phase
    if (!isActive) {
        setTimeLeft(getDuration());
    }
  }, [currentPhaseIndex, currentCycle, getDuration, isActive]);

  useEffect(() => {
    // This effect ensures the timer is correctly set when a new cycle is loaded
    setTimeLeft(getDuration());
    setIsActive(false);
    setCyclesCompleted(0);
    setSessionPhaseRecords([]);
  }, [currentCycle, getDuration]);
  
  
  const startPause = (sessionsUntilLongRest: number) => {
    if (ToneRef.current && ToneRef.current.context.state !== 'running') {
        ToneRef.current.context.resume();
    }
    sessionsUntilLongRestRef.current = sessionsUntilLongRest;
    if (cyclesCompleted >= sessionsUntilLongRest && sessionsUntilLongRest > 0) {
      reset();
    } else {
      setIsActive(!isActive);
    }
  };

  const reset = () => {
    setIsActive(false);
    resetCycle();
    setCyclesCompleted(0);
    setTimeLeft(getDuration());
    setSessionPhaseRecords([]);
  };

  const skip = (sessionsUntilLongRest: number) => {
    sessionsUntilLongRestRef.current = sessionsUntilLongRest;
    handleSessionEnd('skipped');
    // If skipping while paused, need to manually update timer for next phase
    if (!isActive) {
      // Temporarily create a new getDuration based on what the next phase *will be*
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
