
import { create } from 'zustand';
import { createActor, ActorRefFrom } from 'xstate';
import { timerMachine } from '@/ai/timer-machine';
import { useCycleStore } from './useCycleStore';

type TimerActor = ActorRefFrom<typeof timerMachine>;

interface TimerState {
  timerActor: TimerActor | null;
  timeLeft: number;
  isActive: boolean;
  send: (event: any) => void;
  initializeTimer: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => {
    let actor: TimerActor | null = null;

    // Lắng nghe sự thay đổi của cycle store để cập nhật máy timer
    useCycleStore.subscribe(
        (state) => ({
            currentPhase: state.currentCycle?.phases[state.currentPhaseIndex],
            playSounds: state.playSounds
        }),
        ({ currentPhase, playSounds }) => {
            const { timerActor, send } = get();
            if (currentPhase) {
                // Nếu máy đã chạy, gửi sự kiện cập nhật duration
                if (timerActor) {
                    send({ type: 'UPDATE_DURATION', duration: currentPhase.duration * 60 });
                }
            }
        }
    );

    return {
        timerActor: null,
        timeLeft: 0,
        isActive: false,
        send: (event) => {
            get().timerActor?.send(event);
        },
        initializeTimer: () => {
            // Lấy state MỚI NHẤT từ useCycleStore
            const { currentCycle, currentPhaseIndex, advancePhase, playSounds } = useCycleStore.getState();
            const currentPhase = currentCycle?.phases[currentPhaseIndex];

            if (!currentPhase) return;

            const newActor = createActor(timerMachine, {
                input: {
                    duration: currentPhase.duration * 60,
                },
                actions: {
                    onTimerEnd: () => {
                        console.log("Timer ended. Advancing phase.");
                        if (playSounds && currentPhase?.soundFile) {
                            new Audio(currentPhase.soundFile.url).play();
                        }
                        // Gọi action từ cycle store
                        advancePhase();
                    },
                },
            }).start();

            newActor.subscribe((snapshot) => {
                set({
                    timeLeft: snapshot.context.timeLeft,
                    isActive: snapshot.matches('running'),
                });
            });

            set({ timerActor: newActor, send: newActor.send });
        },
    };
});

// Khởi tạo máy timer khi ứng dụng bắt đầu
useTimerStore.getState().initializeTimer();
