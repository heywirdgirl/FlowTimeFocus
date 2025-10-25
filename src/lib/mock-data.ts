// src/lib/mock-data.ts - FINAL VERSION (Oct 21, 2025) - DAL COMPATIBLE
import { Cycle, Phase, AudioAsset, TrainingHistory } from "@/lib/types";

export const mockAudioLibrary: AudioAsset[] = [
  {
    id: "audio_instant_win",
    name: "Instant Win",
    url: "/sounds/instant-win.wav",
    uploadedAt: "2025-09-26T17:58:00Z",
  },
  {
    id: "audio_winning_notification",
    name: "Winning Notification",
    url: "/sounds/winning-notification.wav",
    uploadedAt: "2025-09-26T17:58:00Z",
  },
];

// 🔥 MOCK TRAINING HISTORY - RIÊNG BIỆT
export const mockTrainingHistory: TrainingHistory[] = [
  {
    id: "hist1",
    cycleId: "cycle_pomodoro",
    name: "Pomodoro Classic",
    startTime: "2025-09-26T09:00:00Z",
    endTime: "2025-09-26T11:15:00Z",
    totalDuration: 135,
    cycleCount: 1,
    completedAt: "2025-09-26T11:15:00Z",
    status: "completed",
    userId: "user123",
    notes: "Great focus today!",
  },
  {
    id: "hist2",
    cycleId: "cycle_template_wimhof",
    name: "Wim Hof Morning",
    startTime: "2025-09-26T08:00:00Z",
    endTime: "2025-09-26T08:03:00Z",
    totalDuration: 3,
    cycleCount: 1,
    completedAt: "2025-09-26T08:03:00Z",
    status: "completed",
    userId: "user123",
  },
  {
    id: "hist3",
    cycleId: "cycle_pomodoro",
    name: "Pomodoro Classic",
    startTime: "2025-09-25T14:30:00Z",
    endTime: "2025-09-25T16:45:00Z",
    totalDuration: 135,
    cycleCount: 1,
    completedAt: "2025-09-25T16:45:00Z",
    status: "interrupted",
    userId: "user123",
    notes: "Got distracted by email",
  },
];

// 🔥 POMODORO CLASSIC - 8 PHASES
export const pomodoroCycle: Cycle = {
  id: "cycle_pomodoro",
  name: "Pomodoro Classic",
  phases: [
    { id: "p1", title: "Focus", duration: 25, soundFile: { url: mockAudioLibrary[0].url, name: mockAudioLibrary[0].name }, removable: false },
    { id: "p2", title: "Break", duration: 5, soundFile: { url: mockAudioLibrary[0].url, name: mockAudioLibrary[0].name }, removable: false },
    { id: "p3", title: "Focus", duration: 25, soundFile: { url: mockAudioLibrary[0].url, name: mockAudioLibrary[0].name }, removable: false },
    { id: "p4", title: "Break", duration: 5, soundFile: { url: mockAudioLibrary[0].url, name: mockAudioLibrary[0].name }, removable: false },
    { id: "p5", title: "Focus", duration: 25, soundFile: { url: mockAudioLibrary[0].url, name: mockAudioLibrary[0].name }, removable: false },
    { id: "p6", title: "Break", duration: 5, soundFile: { url: mockAudioLibrary[0].url, name: mockAudioLibrary[0].name }, removable: false },
    { id: "p7", title: "Focus", duration: 25, soundFile: { url: mockAudioLibrary[0].url, name: mockAudioLibrary[0].name }, removable: false },
    { id: "p8", title: "Long Break", duration: 15, soundFile: { url: mockAudioLibrary[1].url, name: mockAudioLibrary[1].name }, removable: false },
  ],
  isPublic: true,
  userId: null, // 🔥 NEW: Replace authorId
  createdAt: "2025-09-23T10:00:00Z",
  updatedAt: "2025-09-23T10:00:00Z",
};

// 🔥 WIM HOF MORNING - 3 PHASES
export const wimHofCycle: Cycle = {
  id: "cycle_template_wimhof",
  name: "Wim Hof Morning",
  phases: [
    { id: "phase_1", title: "Deep Breathing", duration: 1, soundFile: { url: mockAudioLibrary[0].url, name: mockAudioLibrary[0].name }, removable: false },
    { id: "phase_2", title: "Breath Hold", duration: 1.5, soundFile: { url: mockAudioLibrary[0].url, name: mockAudioLibrary[0].name }, removable: false },
    { id: "phase_3", title: "Recovery Breath", duration: 0.5, soundFile: { url: mockAudioLibrary[1].url, name: mockAudioLibrary[1].name }, removable: false },
  ],
  isPublic: true,
  userId: null, // 🔥 NEW: Replace authorId
  createdAt: "2025-09-22T23:00:00Z",
  updatedAt: "2025-09-22T23:00:00Z",
};

// 🔥 DEFAULT CYCLE - WIM HOF CLONE
export const defaultCycle: Cycle = {
  id: "cycle_default_wimhof",
  name: "🏔️ Wim Hof Quick Start",
  phases: [...wimHofCycle.phases],
  isPublic: false,
  userId: "user123", // 🔥 NEW: Private cycle
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// 🔥 MOCK USER PROFILE - REMOVE privateCycles
export const mockUserProfile = {
  userId: "user123",
  email: "user@example.com",
  displayName: "John Doe",
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
};

// 🔥 DEFAULT EXPORT - ADD mockCycles ARRAY
export default {
  mockAudioLibrary,
  mockCycles: [pomodoroCycle, wimHofCycle, defaultCycle], // 🔥 NEW: Export as array
  mockTrainingHistory,
  mockUserProfile,
};