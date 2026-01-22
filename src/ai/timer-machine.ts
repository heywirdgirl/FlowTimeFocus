import { setup, assign, fromCallback } from 'xstate';

export const timerMachine = setup({
  types: {
    context: {} as {
      duration: number;
      timeLeft: number;
    },
    events: {} as
      | { type: 'TICK' }
      | { type: 'PAUSE' } // Vẫn cần Pause nếu người dùng muốn nghỉ giữa chừng
      | { type: 'START' }
      | { type: 'RESUME' }
      | { type: 'STOP_FOR_EDIT' } // Sự kiện khi nhấn Edit/Delete
      | { type: 'SELECT_PHASE'; duration: number;  }, // Sự kiện chọn/auto-next phase
    input: {} as { duration: number; }
  },

  actors: {
    intervalTicker: fromCallback(({ sendBack }) => {
      const id = setInterval(() => sendBack({ type: 'TICK' }), 1000);
      return () => clearInterval(id);
    })
  },

  actions: {
    decrementTime: assign({
      timeLeft: ({ context }) => context.timeLeft - 1
    }),
    updateContext: assign({
      duration: ({ event }) => 'duration' in event ? event.duration : 0,
      timeLeft: ({ event }) => 'duration' in event ? event.duration : 0,

    })
  }
}).createMachine({
  id: 'flow-timer',
  initial: 'idle',
  
  context: ({ input }) => ({
    duration: input.duration,
    timeLeft: input.duration,

  }),

  // GLOBAL EVENTS: Có thể gọi từ bất kỳ đâu
  on: {
    // Logic: Khi nhận phase mới (do user chọn hoặc auto-next), 
    // cập nhật context VÀ chuyển ngay sang trạng thái 'running'
    SELECT_PHASE: {
      target: '.running', 
      reenter: true, // Reset lại timer nếu đang chạy
      actions: 'updateContext'
    },
    
    // Logic: Khi nhấn Edit/Delete, dừng mọi thứ về Idle
    STOP_FOR_EDIT: {
      target: '.idle',
      reenter: true // Đảm bảo thoát khỏi running/paused
    }
  },

  states: {
    idle: {
      // Ở trạng thái này, chỉ chờ SELECT_PHASE để bắt đầu
      // Hoặc có thể thêm nút Start thủ công nếu muốn chạy lại phase hiện tại
      on: {
        START: 'running',
      }
    },

    running: {
      invoke: {
        id: 'ticker',
        src: 'intervalTicker'
      },
      on: {
        TICK: {
          actions: 'decrementTime'
        },
        PAUSE: 'paused',
      },
      // Tự động kiểm tra hết giờ
      always: {
        target: 'finished',
        guard: ({ context }) => context.timeLeft <= 0
      }
    },

    paused: {
      on: {
        RESUME: 'running',
        // SELECT_PHASE ở Global sẽ tự động xử lý việc chọn phase khác khi đang pause
      }
    },

    finished: {

    }
  }
});