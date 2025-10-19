// src/contexts/history-context.tsx - FINAL VERSION (Oct 19, 2025)
// 🔥 DAL INTEGRATED + CHARTS + STATS

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
import { TrainingHistory } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import defaultData from "@/lib/mock-data";
import { useCycle } from "./cycle-context";

const { mockTrainingHistory } = defaultData;

interface HistoryContextType {
  // Data
  trainingHistory: TrainingHistory[];
  stats: HistoryStats;
  recentSessions: TrainingHistory[];
  cycleStats: Record<string, { count: number; totalTime: number }>;
  
  // Actions
  logSession: (cycleId: string, status: 'completed' | 'interrupted') => Promise<void>;
  deleteSession: (historyId: string) => Promise<void>;
  getSessionsByCycle: (cycleId: string) => TrainingHistory[];
  
  // Loading
  isLoading: boolean;
  isEmpty: boolean;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) throw new Error("useHistory must be used within HistoryProvider");
  return context;
}

export function HistoryProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { currentCycle } = useCycle();
  const { toast } = useToast();
  
  const [trainingHistory, setTrainingHistory] = useState<TrainingHistory[]>([]);
  const [stats, setStats] = useState<HistoryStats>({
    totalSessions: 0,
    totalTime: 0,
    completedSessions: 0,
    avgSessionTime: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentSessions, setRecentSessions] = useState<TrainingHistory[]>([]);
  const [cycleStats, setCycleStats] = useState<Record<string, { count: number; totalTime: number }>>({});

  // 🔥 LOAD HISTORY + STATS - SỬ DỤNG DAL
  useEffect(() => {
    const loadHistory = async () => {
      if (authLoading) {
        setIsLoading(true);
        return;
      }

      setIsLoading(true);
      
      if (!user) {
        // GUEST: Mock data
        setTrainingHistory([]);
        setStats({ totalSessions: 0, totalTime: 0, completedSessions: 0, avgSessionTime: 0 });
        setRecentSessions([]);
        setCycleStats({});
        setIsLoading(false);
        return;
      }

      try {
        // 🔥 DAL CALLS - PARALLEL
        const [history, statsData] = await Promise.all([
          getTrainingHistory(),
          getHistoryStats()
        ]);
        
        setTrainingHistory(history);
        setStats(statsData);
        setRecentSessions(history.slice(0, 5));
        
        // Calculate cycle stats
        const cycleMap: Record<string, { count: number; totalTime: number }> = {};
        history.forEach(h => {
          if (!cycleMap[h.cycleId]) {
            cycleMap[h.cycleId] = { count: 0, totalTime: 0 };
          }
          cycleMap[h.cycleId].count++;
          cycleMap[h.cycleId].totalTime += h.totalDuration;
        });
        setCycleStats(cycleMap);
        
      } catch (error) {
        toast({ 
          title: "Load Error", 
          description: "Failed to load history", 
          variant: "destructive" 
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [user, authLoading, toast]);

  // 🔥 LOG SESSION - SỬ DỤNG DAL
  const logSession = async (cycleId: string, status: 'completed' | 'interrupted' = 'completed') => {
    if (!currentCycle || !user) return;
    
    try {
      const totalDuration = currentCycle.phases.reduce((sum, p) => sum + p.duration, 0);
      
      const historyData = {
        cycleId,
        name: currentCycle.name,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        totalDuration,
        cycleCount: 1,
        completedAt: new Date().toISOString(),
        status,
        notes: status === 'interrupted' ? 'Session interrupted' : undefined
      };

      // 🔥 DAL CALL
      const newHistory = await createTrainingHistory(historyData);
      
      // Update local state
      setTrainingHistory(prev => [newHistory, ...prev]);
      setRecentSessions(prev => [newHistory, ...prev.slice(0, 4)]);
      
      // Update stats
      const newStats = {
        ...stats,
        totalSessions: stats.totalSessions + 1,
        totalTime: stats.totalTime + totalDuration,
        completedSessions: status === 'completed' ? stats.completedSessions + 1 : stats.completedSessions
      };
      setStats(newStats);
      
      toast({ 
        title: status === 'completed' ? "🎉 Completed!" : "⏸️ Paused", 
        description: `${totalDuration}m session logged!` 
      });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to log session", 
        variant: "destructive" 
      });
    }
  };

  // 🔥 DELETE SESSION
  const deleteSession = async (historyId: string) => {
    try {
      // 🔥 DAL CALL
      await deleteTrainingHistory(historyId); // Wait, need to import this!
      
      // Update local state
      const deletedHistory = trainingHistory.find(h => h.id === historyId);
      if (!deletedHistory) return;
      
      setTrainingHistory(prev => prev.filter(h => h.id !== historyId));
      setRecentSessions(prev => prev.filter(h => h.id !== historyId));
      
      toast({ title: "Deleted ✅", description: "Session removed!" });
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Delete failed.", 
        variant: "destructive" 
      });
    }
  };

  // 🔥 GET SESSIONS BY CYCLE
  const getSessionsByCycle = (cycleId: string): TrainingHistory[] => {
    return trainingHistory.filter(h => h.cycleId === cycleId).slice(0, 10);
  };

  const isEmpty = trainingHistory.length === 0;

  const value: HistoryContextType = {
    // Data
    trainingHistory,
    stats,
    recentSessions,
    cycleStats,
    
    // Actions
    logSession,
    deleteSession,
    getSessionsByCycle,
    
    // State
    isLoading,
    isEmpty
  };

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
}