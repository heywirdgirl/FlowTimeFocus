// src/lib/mock-data.ts - FINAL VERSION (Oct 19, 2025) - DAL COMPATIBLE
import { Cycle, Phase, AudioAsset, TrainingHistory } from "@/lib/types";

export const mockAudioLibrary: AudioAsset[] = [
    {
        id: "audio_instant_win",
        name: "Instant Win",
        url: "/sounds/instant-win.wav",
        uploadedAt: "2025-09-26T17:58:00Z"
    },
    {
        id: "audio_winning_notification",
        name: "Winning Notification", 
        url: "/sounds/winning-notification.wav",
        uploadedAt: "2025-09-26T17:58:00Z"
    }
];

// 🔥 MOCK TRAINING HISTORY - RIÊNG BIỆT (CHO history-dal.ts)
export const mockTrainingHistory: TrainingHistory[] = [
    {
        id: "hist1",
        cycleId: "cycle_pomodoro",
        name: "Pomodoro Classic",
        startTime: "2025-09-26T09:00:00Z",
        endTime: "2025-09-26T11:15:00Z",
        totalDuration: 135,  // 2h15m = 8 phases
        cycleCount: 1,
        completedAt: "2025-09-26T11:15:00Z",
        status: 'completed',
        userId: "user123",
        notes: "Great focus today!"
    },
    {
        id: "hist2",
        cycleId: "cycle_template_wimhof",
        name: "Wim Hof Morning", 
        startTime: "2025-09-26T08:00:00Z",
        endTime: "2025-09-26T08:03:00Z",
        totalDuration: 3,    // 1 + 1.5 + 0.5 = 3m
        cycleCount: 1,
        completedAt: "2025-09-26T08:03:00Z",
        status: 'completed',
        userId: "user123"
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
        status: 'interrupted',
        userId: "user123",
        notes: "Got distracted by email"
    }
];

// 🔥 POMODORO CLASSIC - 8 PHASES - XÓA trainingHistory!
export const pomodoroCycle: Cycle = {
    id: "cycle_pomodoro",
    name: "Pomodoro Classic",
    phases: [
        { 
            id: "p1", 
            title: "Focus", 
            duration: 25, 
            soundFile: { 
                url: mockAudioLibrary[0].url, 
                name: mockAudioLibrary[0].name 
            }, 
            removable: false 
        },
        { 
            id: "p2", 
            title: "Break", 
            duration: 5, 
            soundFile: { 
                url: mockAudioLibrary[0].url, 
                name: mockAudioLibrary[0].name 
            }, 
            removable: false 
        },
        { 
            id: "p3", 
            title: "Focus", 
            duration: 25, 
            soundFile: { 
                url: mockAudioLibrary[0].url, 
                name: mockAudioLibrary[0].name 
            }, 
            removable: false 
        },
        { 
            id: "p4", 
            title: "Break", 
            duration: 5, 
            soundFile: { 
                url: mockAudioLibrary[0].url, 
                name: mockAudioLibrary[0].name 
            }, 
            removable: false 
        },
        { 
            id: "p5", 
            title: "Focus", 
            duration: 25, 
            soundFile: { 
                url: mockAudioLibrary[0].url, 
                name: mockAudioLibrary[0].name 
            }, 
            removable: false 
        },
        { 
            id: "p6", 
            title: "Break", 
            duration: 5, 
            soundFile: { 
                url: mockAudioLibrary[0].url, 
                name: mockAudioLibrary[0].name 
            }, 
            removable: false 
        },
        { 
            id: "p7", 
            title: "Focus", 
            duration: 25, 
            soundFile: { 
                url: mockAudioLibrary[0].url, 
                name: mockAudioLibrary[0].name 
            }, 
            removable: false 
        },
        { 
            id: "p8", 
            title: "Long Break", 
            duration: 15, 
            soundFile: { 
                url: mockAudioLibrary[1].url, 
                name: mockAudioLibrary[1].name 
            }, 
            removable: false 
        },
    ],
    isPublic: true,
    authorId: "user123",
    authorName: "User",
    likes: 150, 
    shares: 30,
    createdAt: "2025-09-23T10:00:00Z",
    updatedAt: "2025-09-23T10:00:00Z"
    // 🔥 XÓA trainingHistory - BÂY GIỜ RIÊNG!
};

// 🔥 WIM HOF MORNING - 3 PHASES - XÓA trainingHistory!
export const wimHofCycle: Cycle = {
    id: "cycle_template_wimhof",
    name: "Wim Hof Morning",
    phases: [
        {
            id: "phase_1",
            title: "Deep Breathing",
            duration: 1,
            soundFile: { 
                url: mockAudioLibrary[0].url, 
                name: mockAudioLibrary[0].name 
            },
            removable: false
        },
        {
            id: "phase_2",
            title: "Breath Hold",
            duration: 1.5,
            soundFile: { 
                url: mockAudioLibrary[0].url, 
                name: mockAudioLibrary[0].name 
            },
            removable: false
        },
        {
            id: "phase_3",
            title: "Recovery Breath",
            duration: 0.5,
            soundFile: { 
                url: mockAudioLibrary[1].url, 
                name: mockAudioLibrary[1].name 
            },
            removable: false
        },
    ],
    isPublic: true,
    authorId: "uid_system",
    authorName: "Timeflow Team",
    likes: 1337,
    shares: 42,
    createdAt: "2025-09-22T23:00:00Z",
    updatedAt: "2025-09-22T23:00:00Z"
    // 🔥 XÓA trainingHistory - BÂY GIỜ RIÊNG!
};

// 🔥 DEFAULT CYCLE = WIM HOF CLONE! (3 PHASES READY)
export const defaultCycle: Cycle = {
    id: "cycle_default_wimhof",
    name: "🏔️ Wim Hof Quick Start",
    phases: [...wimHofCycle.phases], // 🔥 COPY 3 PHASES TỪ WIM HOF
    isPublic: false,
    authorId: "system",
    authorName: "Your Quick Start",
    likes: 0,
    shares: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
    // 🔥 KHÔNG CÓ trainingHistory
};

// 🔥 MOCK USER PROFILE
export const mockUserProfile = {
    userId: "user123",
    email: "user@example.com",
    displayName: "John Doe",
    privateCycles: ["cycle_default_wimhof"],
    audioLibrary: mockAudioLibrary,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
};

// 🔥 DEFAULT EXPORT
export default {
    mockAudioLibrary,
    pomodoroCycle,
    wimHofCycle,
    defaultCycle,
    mockTrainingHistory, // 🔥 THÊM MỚI
    mockUserProfile       // 🔥 THÊM MỚI
};