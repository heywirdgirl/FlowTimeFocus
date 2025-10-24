"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { FC, ReactNode } from 'react';
import { useCycle } from './cycle-context';
import { useHistory } from './history-context';
import { useAuth } from './auth-context';
import type { PhaseRecord, Cycle } from '@/lib/types';
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
  if (!context) throw new Error('useTimer must be used within a TimerProvider');
  return context;
};

export const TimerProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { currentCycle, currentPhaseIndex, currentPhase, advancePhase, resetCycle, audioLibrary, endOfCycleSound, setCurrentPhaseIndex } = useCycle();
  const { logSession } = useHistory();
  
  const [isActive, setIsActive] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [sessionPhaseRecords, setSessionPhaseRecords] = useState<PhaseRecord[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  const getDuration = useCallback(() => {
    return currentPhase?.duration ? currentPhase.duration * 60 : 0;
  }, [currentPhase]);

  const [timeLeft, setTimeLeft] = useState(getDuration());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const soundRef = useRef<Howl | null>(null);
  const sessionsUntilLongRestRef = useRef(5);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const playSound = useCallback((soundUrl?: string | null) => {
    if (!isMounted) return; // Loại bỏ kiểm tra settings.playSounds

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
        onload: () => { console.log('Sound loaded!'); sound.play(); },
        onerror: (id, error) => {
          console.error('Howler error:', error);
          const fallback = new Audio(urlToPlay);
          fallback.volume = 0.8;
          fallback.play().catch(e => console.error('Fallback error:', e));
        },
      });
      soundRef.current = sound;
    }
  }, [currentPhase, audioLibrary, isMounted]);

  useEffect(() => {
    if (!isMounted || !isActive) return;
    
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isActive, isMounted]);

  useEffect(() => {
    if (!isMounted || timeLeft > 0 || !isActive) return;

    setIsActive(false);
    setSessionPhaseRecords(prev => [...prev, {
      title: currentPhase!.title,
      duration: currentPhase!.duration,
      completionStatus: 'completed'
    }]);
    
    const isLastPhase = currentPhaseIndex >= (currentCycle?.phases.length || 0) - 1;

    if (isLastPhase) {
      const newCyclesCompleted = cyclesCompleted + 1;
      setCyclesCompleted(newCyclesCompleted);

      if (sessionsUntilLongRestRef.current > 0 && newCyclesCompleted >= sessionsUntilLongRestRef.current) {
        playSound(endOfCycleSound?.url);
        if (currentCycle) logSession(currentCycle, 'completed');
        setSessionPhaseRecords([]);
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
  }, [timeLeft, isActive, isMounted, playSound, currentCycle, currentPhaseIndex, currentPhase, advancePhase, logSession, setCurrentPhaseIndex, endOfCycleSound]);

  useEffect(() => {
    if (!isMounted) return;
    setTimeLeft(getDuration());
  }, [currentPhase, currentCycle, getDuration, isMounted]);

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
    if (!currentCycle || !currentPhase) return;
    
    sessionsUntilLongRestRef.current = sessionsUntilLongRest;
    setIsActive(false); 
    
    setSessionPhaseRecords(prev => [...prev, {
      title: currentPhase.title,
      duration: currentPhase.duration,
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
  } as const;

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};