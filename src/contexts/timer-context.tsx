"use client";

  import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, FC } from 'react';

  interface Phase {
    id?: string;
    title: string;
    duration: number;
    guidedAudio?: { url: string; type: 'ambient' | 'guided' };
  }

  interface TimerContextType {
    timeLeft: number;
    isActive: boolean;
    startPause: () => void;
    reset: () => void;
  }

  const TimerContext = createContext<TimerContextType | undefined>(undefined);

  export const useTimer = () => {
    const context = useContext(TimerContext);
    if (!context) throw new Error('useTimer must be used within a TimerProvider');
    return context;
  };

  export const TimerProvider: FC<{ children: ReactNode; currentPhase: Phase | null }> = ({ children, currentPhase }) => {
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (isActive && currentPhase?.guidedAudio?.url) {
        const audio = new Audio(currentPhase.guidedAudio.url);
        audio.loop = currentPhase.guidedAudio.type === 'ambient';
        audio.play().catch(e => console.error('Audio play error:', e));
        audioRef.current = audio;
      }
      return () => {
        if (audioRef.current) audioRef.current.pause();
      };
    }, [isActive, currentPhase]);

    useEffect(() => {
        if (isActive && currentPhase?.duration) {
          setTimeLeft(currentPhase.duration * 60); // Convert to seconds
          intervalRef.current = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
          }, 1000);
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          if (currentPhase?.duration) {
            setTimeLeft(currentPhase.duration * 60);
          }
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
      }, [isActive, currentPhase]);

    const startPause = () => setIsActive(prev => !prev);
    const reset = () => {
      setIsActive(false);
      if (currentPhase?.duration) {
        setTimeLeft(currentPhase.duration * 60);
      } else {
        setTimeLeft(0);
      }
      if (audioRef.current) audioRef.current.pause();
    };

    const value = { timeLeft, isActive, startPause, reset };
    return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
  };