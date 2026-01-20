import { setup, assign, fromCallback } from 'xstate';

export const timerMachine = setup({
  types: {
    context: {} as {
      duration: number;
      timeLeft: number;
      title: string; // Nên giữ title để hiển thị đồng bộ
    },
    events: {} as
      | { type: 'TICK' }
      | { type: 'PAUSE' } // Vẫn cần Pause nếu người dùng muốn nghỉ giữa chừng
      | { type: 'RESUME' }
      | { type: 'STOP_FOR_EDIT' } // Sự kiện khi nhấn Edit/Delete
      | { type: 'SELECT_PHASE'; duration: number; title: string }, // Sự kiện chọn/auto-next phase
    input: {} as { duration: number; title: string }
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
      title: ({ event }) => 'title' in event ? event.title : '',
    })
  }
}).createMachine({
  id: 'flow-timer',
  initial: 'idle',
  
  context: ({ input }) => ({
    duration: input.duration,
    timeLeft: input.duration,
    title: input.title,
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
        RESUME: 'running' // Cho phép chạy lại nếu đang dừng
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
      // Trạng thái tạm thời (Transient State)
      // Máy sẽ nằm đây chờ Store gửi lệnh SELECT_PHASE tiếp theo
      entry: ({ context }) => {
        // 1. Phát tín hiệu cho UI biết đã xong
        console.log(`Phase ${context.title} completed`);
        // Side-effect thực tế sẽ nằm ở Store (xem phần dưới)
      }
      // Không cần 'on' event gì ở đây vì:
      // - Nếu Store gửi 'SELECT_PHASE' -> Global transition sẽ bắt lấy và đưa về 'running'
      // - Nếu hết Cycle -> Store không gửi gì -> Máy nằm im (hoặc Store gửi STOP_FOR_EDIT để về idle)
    }
  }
});