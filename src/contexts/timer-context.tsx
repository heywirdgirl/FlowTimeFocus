"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { FC, ReactNode } from 'react';
import { useSettings } from './settings-context';
import type * as Tone from 'tone';

type SessionType = 'focus' | 'shortRest' | 'longRest';

interface TimerContextType {
  sessionType: SessionType;
  timeLeft: number;
  isActive: boolean;
  sessionsCompleted: number;
  startPause: () => void;
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
  const [sessionType, setSessionType] = useState<SessionType>('focus');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const getDuration = useCallback((type: SessionType = sessionType) => {
    switch (type) {
      case 'focus':
        return settings.focusDuration * 60;
      case 'shortRest':
        return settings.shortRestDuration * 60;
      case 'longRest':
        return settings.longRestDuration * 60;
    }
  }, [settings, sessionType]);

  const [timeLeft, setTimeLeft] = useState(getDuration('focus'));

  const synth = useRef<Tone.Synth | null>(null);

  useEffect(() => {
    import('tone').then(Tone => {
      synth.current = new Tone.Synth().toDestination();
    });
  }, []);

  const playSound = (note: string) => {
    if (settings.playSounds && synth.current) {
      synth.current.triggerAttackRelease(note, "8n");
    }
  };

  const advanceSession = useCallback(() => {
    setIsActive(false);
    let nextSessionType: SessionType = 'focus';
    let nextSessionsCompleted = sessionsCompleted;

    if (sessionType === 'focus') {
        nextSessionsCompleted++;
        if (nextSessionsCompleted > 0 && nextSessionsCompleted % settings.sessionsUntilLongRest === 0) {
            nextSessionType = 'longRest';
        } else {
            nextSessionType = 'shortRest';
        }
        playSound('C5');
    } else {
        playSound('G4');
    }

    setSessionType(nextSessionType);
    setSessionsCompleted(nextSessionsCompleted);
    setTimeLeft(getDuration(nextSessionType));
  }, [sessionType, sessionsCompleted, settings.sessionsUntilLongRest, getDuration]);


  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      advanceSession();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, advanceSession]);

  useEffect(() => {
    // Reset timer when durations change
    if (!isActive) {
      setTimeLeft(getDuration(sessionType));
    }
  }, [settings, sessionType, isActive, getDuration]);

  const startPause = () => {
    if (timeLeft === 0) {
      advanceSession();
      setTimeout(() => setIsActive(true), 100);
    } else {
      setIsActive(!isActive);
    }
  };

  const reset = () => {
    setIsActive(false);
    setSessionType('focus');
    setSessionsCompleted(0);
    setTimeLeft(getDuration('focus'));
  };

  const skip = () => {
    advanceSession();
  };

  return (
    <TimerContext.Provider value={{ sessionType, timeLeft, isActive, sessionsCompleted, startPause, reset, skip }}>
      {children}
    </TimerContext.Provider>
  );
};
