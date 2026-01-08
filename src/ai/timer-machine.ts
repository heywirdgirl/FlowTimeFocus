import { setup, assign, fromCallback } from 'xstate';

export const timerMachine = setup({
  types: {
    context: {} as {
      duration: number;
      timeLeft: number;
      interval: number;
    },
    events: {} as
      | { type: 'START' }
      | { type: 'PAUSE' }
      | { type: 'RESUME' }
      | { type: 'STOP' }
      | { type: 'RESET' }
      | { type: 'TICK' }
      | { type: 'SKIP' }
      | { type: 'UPDATE_DURATION'; duration: number },
    input: {} as { duration: number }
  },
  
  // Định nghĩa actors (thay thế invoke.src trực tiếp)
  actors: {
    intervalTicker: fromCallback(({ sendBack }) => {
      const id = setInterval(() => {
        sendBack({ type: 'TICK' });
      }, 1000);
      
      return () => clearInterval(id);
    })
  },
  
  // Định nghĩa guards (thay thế cond)
  guards: {
    isTimeUp: ({ context }) => context.timeLeft <= 0
  },
  
  // Định nghĩa actions có thể tái sử dụng
  actions: {
    resetTimeLeft: assign({
      timeLeft: ({ context }) => context.duration
    }),
    
    decrementTime: assign({
      timeLeft: ({ context }) => context.timeLeft - context.interval
    }),
    
    updateDuration: assign({
      duration: ({ event }) => {
        // Type guard để đảm bảo event có property duration
        if ('duration' in event) {
          return event.duration;
        }
        return 0;
      },
      timeLeft: ({ event }) => {
        if ('duration' in event) {
          return event.duration;
        }
        return 0;
      }
    })
  }
}).createMachine({
  id: 'timer',
  initial: 'idle',
  
  // Context với input từ bên ngoài
  context: ({ input }) => ({
    duration: input.duration,
    timeLeft: input.duration,
    interval: 1
  }),
  
  states: {
    idle: {
      on: {
        START: 'running',
        RESET: {
          target: 'idle',
          reenter: true, // v5: thay thế internal: false
          actions: 'resetTimeLeft'
        }
      }
    },
    
    running: {
      invoke: {
        id: 'interval-ticker',
        src: 'intervalTicker' // Tham chiếu đến actor đã định nghĩa
      },
      
      on: {
        TICK: {
          actions: 'decrementTime'
        },
        PAUSE: 'paused',
        STOP: 'idle'
      },
      
      // v5: always transitions
      always: {
        target: 'finished',
        guard: 'isTimeUp'
      }
    },
    
    paused: {
      on: {
        RESUME: 'running',
        STOP: 'idle'
      }
    },
    
    finished: {
      entry: ({ context }) => {
        console.log('Timer finished!', context);
        // Có thể thêm custom logic ở đây
      },
      on: {
        RESET: 'idle'
      }
    }
  },
  
  // Global events - có thể xử lý từ bất kỳ state nào
  on: {
    UPDATE_DURATION: {
      target: '.idle', // Absolute target từ root
      reenter: true,
      actions: 'updateDuration'
    },
    
    SKIP: {
      target: '.finished'
    }
  }
});