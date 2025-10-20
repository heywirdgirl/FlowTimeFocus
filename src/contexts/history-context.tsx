// src/contexts/history-context.tsx - FIXED VERSION (Oct 19, 2025)
// 🔥 REMOVE useCycle() - PASS CYCLE AS PROP

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthContext } from "./auth-context";
import { 
  getTrainingHistory, 
  createTrainingHistory, 
  getHistoryByCycle, 
  getHistoryStats,
  HistoryStats 
} from "@/dal";
import { TrainingHistory, Cycle } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import defaultData from "@/lib/mock-data";

const { mockTrainingHistory } = defaultData;

interface HistoryContextType {
  trainingHistory: TrainingHistory[];
  stats: HistoryStats;
  recentSessions: TrainingHistory[];
  cycleStats: Record<string, { count: number; totalTime: number }>;
  logSession: (cycle: Cycle, status: 'completed' | 'interrupted') => Promise<void>;
  deleteSession: (historyId: string) => Promise<void>;
  getSessionsByCycle: (cycleId: string) => TrainingHistory[];
  isLoading: boolean;
  isEmpty: boolean;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) throw new Error("useHistory must be used within HistoryProvider");
  return context;
}

interface HistoryProviderProps {
  children: ReactNode;
  currentCycle?: Cycle | null; // 🔥 PASS AS PROP
}

export function HistoryProvider({ children, currentCycle }: HistoryProviderProps) {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { toast } = useToast();
  
  const [trainingHistory, setTrainingHistory] = useState<TrainingHistory[]>([]);
  const [stats, setStats] = useState<HistoryStats>({
    totalSessions: 0, totalTime: 0, completedSessions: 0, avgSessionTime: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentSessions, setRecentSessions] = useState<TrainingHistory[]>([]);
  const [cycleStats, setCycleStats] = useState<Record<string, { count: number; totalTime: number }>>({});

  // 🔥 LOAD HISTORY - SAME AS BEFORE
  useEffect(() => {
    const loadHistory = async () => {
      if (authLoading) { setIsLoading(true); return; }
      setIsLoading(true);
      
      if (!user) {
        setTrainingHistory([]); setStats({ totalSessions: 0, totalTime: 0, completedSessions: 0, avgSessionTime: 0 });
        setRecentSessions([]); setCycleStats({});
        setIsLoading(false); return;
      }

      try {
        const [history, statsData] = await Promise.all([getTrainingHistory(), getHistoryStats()]);
        setTrainingHistory(history); setStats(statsData); setRecentSessions(history.slice(0, 5));
        
        const cycleMap: Record<string, { count: number; totalTime: number }> = {};
        history.forEach(h => {
          if (!cycleMap[h.cycleId]) cycleMap[h.cycleId] = { count: 0, totalTime: 0 };
          cycleMap[h.cycleId].count++; cycleMap[h.cycleId].totalTime += h.totalDuration;
        });
        setCycleStats(cycleMap);
      } catch (error) {
        toast({ title: "Load Error", description: "Failed to load history", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, [user, authLoading, toast]);

  // 🔥 LOG SESSION - USE PASSED CYCLE
  const logSession = async (cycle: Cycle, status: 'completed' | 'interrupted' = 'completed') => {
    if (!user || !cycle) return;
    try {
      const totalDuration = cycle.phases.reduce((sum, p) => sum + p.duration, 0);
      const historyData = {
        cycleId: cycle.id, name: cycle.name, startTime: new Date().toISOString(),
        endTime: new Date().toISOString(), totalDuration, cycleCount: 1,
        completedAt: new Date().toISOString(), status,
        notes: status === 'interrupted' ? 'Session interrupted' : undefined
      };
      const newHistory = await createTrainingHistory(historyData);
      
      setTrainingHistory(prev => [newHistory, ...prev]);
      setRecentSessions(prev => [newHistory, ...prev.slice(0, 4)]);
      const newStats = {
        ...stats, totalSessions: stats.totalSessions + 1,
        totalTime: stats.totalTime + totalDuration,
        completedSessions: status === 'completed' ? stats.completedSessions + 1 : stats.completedSessions
      };
      setStats(newStats);
      
      toast({ title: status === 'completed' ? "🎉 Completed!" : "⏸️ Paused", description: `${totalDuration}m session logged!` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to log session", variant: "destructive" });
    }
  };

  // 🔥 DELETE SESSION - ADD MISSING IMPORT
  const deleteSession = async (historyId: string) => {
    try {
      await deleteTrainingHistory(historyId); // 🔥 NOW IMPORTED!
      setTrainingHistory(prev => prev.filter(h => h.id !== historyId));
      setRecentSessions(prev => prev.filter(h => h.id !== historyId));
      toast({ title: "Deleted ✅", description: "Session removed!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Delete failed.", variant: "destructive" });
    }
  };

  const getSessionsByCycle = (cycleId: string): TrainingHistory[] => {
    return trainingHistory.filter(h => h.cycleId === cycleId).slice(0, 10);
  };

  const isEmpty = trainingHistory.length === 0;

  const value: HistoryContextType = {
    trainingHistory, stats, recentSessions, cycleStats,
    logSession, deleteSession, getSessionsByCycle, isLoading, isEmpty
  };

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}