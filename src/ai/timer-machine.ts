// src/ai/timer-machine.ts
import { createMachine, assign, fromCallback } from 'xstate';

interface TimerContext {
  timeLeft: number;
  duration: number; // đơn vị giây
}

export const timerMachine = createMachine({
  id: 'timer',
  initial: 'idle',
  context: ({ input }: { input: { duration: number } }) => ({
    timeLeft: input.duration,
    duration: input.duration,
  }),
  states: {
    idle: {
      on: {
        START: 'running',
        RESET: {
          actions: assign({
            timeLeft: ({ context }) => context.duration
          })
        },
        UPDATE_DURATION: {
          actions: assign({
            duration: ({ event }) => event.duration,
            timeLeft: ({ event }) => event.duration
          })
        }
      }
    },
    running: {
      // Tự động đếm ngược mỗi giây
      invoke: {
        src: fromCallback(({ sendBack }) => {
          const interval = setInterval(() => sendBack({ type: 'TICK' }), 1000);
          return () => clearInterval(interval);
        })
      },
      on: {
        TICK: [
          {
            // Nếu hết giờ
            target: 'completed',
            guard: ({ context }) => context.timeLeft <= 1
          },
          {
            // Nếu còn thời gian
            actions: assign({ timeLeft: ({ context }) => context.timeLeft - 1 })
          }
        ],
        PAUSE: 'paused',
        SKIP: 'completed',
        RESET: 'idle'
      }
    },
    paused: {
      on: {
        RESUME: 'running',
        RESET: 'idle'
      }
    },
    completed: {
      // Trạng thái trung gian để kích hoạt logic chuyển phase
      always: 'idle',
      entry: 'onTimerEnd'
    }
  }
});
