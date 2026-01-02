
import { create } from 'zustand';
import { createActor } from 'xstate';
import { timerMachine } from '@/ai/timer-machine';
import { useCycleStore } from './useCycleStore';
import type { Timer } from '@/lib/types';

// --- State and Store Types ---

interface TimerState {
    timerActor: Timer | null;
    timeLeft: number;
    isActive: boolean;
    send: (event: any) => void;
    initializeTimer: () => void;
}

// --- Store Implementation ---

export const useTimerStore = create<TimerState>((set, get) => ({
    timerActor: null,
    timeLeft: 0,
    isActive: false,
    send: (event) => get().timerActor?.send(event),

    initializeTimer: () => {
        // 1. Dừng actor cũ nếu có để tránh rò rỉ bộ nhớ và xung đột
        get().timerActor?.stop();

        const { currentCycle, currentPhaseIndex } = useCycleStore.getState();
        const currentPhase = currentCycle?.phases[currentPhaseIndex];

        // Nếu chưa có phase (đang load), thoát ra.
        // Logic subscribe bên ngoài sẽ kích hoạt lại khi có dữ liệu.
        if (!currentPhase) return;

        const newActor = createActor(timerMachine, {
            input: { duration: currentPhase.duration * 60 },
            actions: {
                onTimerEnd: () => {
                    // Lấy state mới nhất ngay trước khi thực thi
                    const cycleState = useCycleStore.getState();
                    // Phát âm thanh nếu được bật và có file âm thanh
                    const phaseOnEnd = cycleState.currentCycle?.phases[cycleState.currentPhaseIndex];
                    if (cycleState.playSounds && phaseOnEnd?.soundFile?.url) {
                        new Audio(phaseOnEnd.soundFile.url).play().catch(err => console.error("Audio play failed:", err));
                    }
                    // Chuyển sang phase tiếp theo
                    cycleState.goToNextPhase();
                },
            },
        }).start();

        newActor.subscribe((snapshot) => {
            set({ 
                timeLeft: snapshot.context.timeLeft, 
                isActive: snapshot.matches('running') 
            });
        });

        set({ timerActor: newActor });
    },
}));

// Lắng nghe sự thay đổi của Phase để ép Actor cập nhật một cách "reactive"
useCycleStore.subscribe(
    // Selector: Chỉ lắng nghe sự thay đổi của ID và duration của phase hiện tại
    (state) => ({
        phaseId: state.currentCycle?.phases[state.currentPhaseIndex]?.id,
        duration: state.currentCycle?.phases[state.currentPhaseIndex]?.duration,
    }),
    // Listener: Hành động khi dữ liệu thay đổi
    (newPhaseData, oldPhaseData) => {
        // Chỉ thực thi nếu phaseId thực sự thay đổi hoặc lúc khởi tạo
        if (newPhaseData.phaseId === oldPhaseData.phaseId && newPhaseData.duration === oldPhaseData.duration) return;
        
        const timerStore = useTimerStore.getState();

        // Nếu chưa có actor và giờ đã có phase, hãy khởi tạo nó
        if (!timerStore.timerActor && newPhaseData.phaseId) {
            timerStore.initializeTimer();
            return;
        }

        // Nếu đã có actor và duration đã sẵn sàng, gửi sự kiện cập nhật
        if (timerStore.timerActor && typeof newPhaseData.duration === 'number') {
            timerStore.send({ 
                type: 'UPDATE_DURATION', 
                duration: newPhaseData.duration * 60 
            });
        }
    },
    // Fire the listener immediately on subscription
    { fireImmediately: true }
);
