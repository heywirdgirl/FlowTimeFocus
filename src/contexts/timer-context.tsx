
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionsUntilLongRestRef = useRef(5);
  const isAudioInitialized = useRef(false);

  useEffect(() => {
    const initializeAudio = async () => {
        if (isAudioInitialized.current) return;
        try {
            const ToneModule = await import('tone');
            ToneRef.current = ToneModule;
            await ToneRef.current.start();
            if (!synth.current) {
                synth.current = new ToneModule.Synth().toDestination();
            }
            if (ToneRef.current.Transport.state !== 'started') {
                ToneRef.current.Transport.start();
            }
            isAudioInitialized.current = true;
        } catch (error) {
            console.error("Failed to initialize audio:", error);
        }
    };
    
    initializeAudio();

    return () => {
      if (synth.current) {
        synth.current.dispose();
        synth.current = null;
      }
      if (ToneRef.current && ToneRef.current.Transport.state === 'started') {
        ToneRef.current.Transport.stop();
        ToneRef.current.Transport.cancel();
      }
      isAudioInitialized.current = false;
    };
  }, []);

  const playSound = useCallback(() => {
    const tone = ToneRef.current;
    if (!settings.playSounds || !synth.current || !tone) return;

    if (tone.context.state !== 'running') {
      tone.context.resume();
    }
    
    // Schedule with a small delay to ensure the time is always in the future
    tone.Transport.scheduleOnce(time => {
      synth.current?.triggerAttackRelease("C5", "8n", time);
    }, tone.now() + 0.05); // 50ms delay
  }, [settings.playSounds]);
  
  const handleSessionEnd = useCallback((status: 'completed' | 'skipped') => {
    const tone = ToneRef.current;
    if(tone) {
      // Clear any pending transport events to prevent conflicts
      tone.Transport.cancel();
    }
    
    // Add a small buffer to ensure state updates don't collide with audio scheduling
    setTimeout(() => {
        if (currentPhase) {
          setSessionPhaseRecords(prev => [...prev, {
            title: currentPhase.title,
            duration: currentPhase.duration,
            completionStatus: status,
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
    }, 100); // 100ms buffer

  }, [playSound, advancePhase, currentCycle, cyclesCompleted, logTraining, currentPhase, sessionPhaseRecords, setCurrentPhaseIndex]);


  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft <= 0) {
      handleSessionEnd('completed');
    }
    
    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      // Also clear transport on pause/stop to be safe
      if (!isActive && ToneRef.current) {
        ToneRef.current.Transport.cancel();
      }
    };
  }, [isActive, timeLeft, handleSessionEnd]);

  useEffect(() => {
    if (!isActive) {
        setTimeLeft(getDuration());
    }
  }, [currentPhaseIndex, currentCycle, getDuration, isActive]);

  useEffect(() => {
    setTimeLeft(getDuration());
    setIsActive(false);
    setCyclesCompleted(0);
    setSessionPhaseRecords([]);
  }, [currentCycle, getDuration]);
  
  
  const startPause = (sessionsUntilLongRest: number) => {
    const tone = ToneRef.current;
    if (tone && tone.context.state !== 'running') {
        tone.context.resume();
    }
    // Make sure transport is started
    if(tone && tone.Transport.state !== 'started'){
        tone.Transport.start();
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
    if (ToneRef.current) {
        ToneRef.current.Transport.cancel();
    }
  };

  const skip = (sessionsUntilLongRest: number) => {
    sessionsUntilLongRestRef.current = sessionsUntilLongRest;
    handleSessionEnd('skipped');
    if (!isActive) {
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
