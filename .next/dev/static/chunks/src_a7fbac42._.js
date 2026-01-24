(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/store/use-auth-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/lib/firebase'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index.js [app-client] (ecmascript)");
;
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        user: null,
        isLoading: true,
        isInitialized: false,
        initialize: ()=>{
            // Prevent multiple listeners
            if (get().isInitialized) {
                return ()=>{};
            }
            const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onAuthStateChanged"])(auth, (user)=>{
                set({
                    user,
                    isLoading: false
                });
            });
            set({
                isInitialized: true
            });
            return unsubscribe;
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/cycle-templates.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_PHASE",
    ()=>DEFAULT_PHASE,
    "OFFICIAL_TEMPLATES",
    ()=>OFFICIAL_TEMPLATES
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/v4.js [app-client] (ecmascript) <export default as v4>");
;
const DEFAULT_PHASE = {
    title: 'New Phase',
    duration: 10,
    soundFile: null
};
// --- Helper function to create official cycles ---
// Giúp giảm bớt việc viết lặp lại các trường metadata của Cycle
const createOfficialCycle = (data)=>({
        id: data.id || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
        name: data.name || 'Untitled Cycle',
        phases: data.phases,
        isPublic: true,
        authorId: 'system-official',
        authorName: 'Gemini Focus',
        likes: 0,
        shares: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
    });
// --- Official Templates ---
const MEDI_TEMPLATE = createOfficialCycle({
    id: 'template-meditation',
    name: 'Meditation Training',
    phases: [
        {
            id: 'md-b1',
            title: 'Start',
            duration: 1.0,
            soundFile: null
        },
        {
            id: 'rl-r1',
            title: 'Breath Hold',
            duration: 1.0,
            soundFile: null
        },
        {
            id: 'md-rec2',
            title: 'Phase 2',
            duration: 2.0,
            soundFile: null
        },
        {
            id: 'rl-b2',
            title: 'Relax',
            duration: 2.0,
            soundFile: null
        }
    ]
});
const POMODORO_TEMPLATE = createOfficialCycle({
    id: 'template-pomodoro',
    name: 'Classic Pomodoro',
    phases: [
        {
            id: 'p-w1',
            title: 'Work',
            duration: 25,
            soundFile: null
        },
        {
            id: 'p-b1',
            title: 'Short Break',
            duration: 5,
            soundFile: null
        },
        {
            id: 'p-w2',
            title: 'Work',
            duration: 25,
            soundFile: null
        },
        {
            id: 'p-b2',
            title: 'Short Break',
            duration: 5,
            soundFile: null
        },
        {
            id: 'p-w3',
            title: 'Work',
            duration: 25,
            soundFile: null
        },
        {
            id: 'p-b3',
            title: 'Short Break',
            duration: 5,
            soundFile: null
        },
        {
            id: 'p-w4',
            title: 'Work',
            duration: 25,
            soundFile: null
        },
        {
            id: 'p-b4',
            title: 'Long Break',
            duration: 15,
            soundFile: null
        }
    ]
});
const WIMHOF_TEMPLATE = createOfficialCycle({
    id: 'template-wimhof',
    name: 'Wim Hof Breathing',
    phases: [
        {
            id: 'wh-b1',
            title: 'Power Breathing',
            duration: 1.25,
            soundFile: null
        },
        {
            id: 'wh-r1',
            title: 'Breath Hold',
            duration: 1.5,
            soundFile: null
        },
        {
            id: 'wh-rec1',
            title: 'Recovery Hold',
            duration: 0.25,
            soundFile: null
        },
        {
            id: 'wh-b2',
            title: 'Power Breathing',
            duration: 1.25,
            soundFile: null
        },
        {
            id: 'wh-r2',
            title: 'Breath Hold',
            duration: 2.0,
            soundFile: null
        },
        {
            id: 'wh-rec2',
            title: 'Recovery Hold',
            duration: 0.25,
            soundFile: null
        },
        {
            id: 'wh-b3',
            title: 'Power Breathing',
            duration: 1.25,
            soundFile: null
        },
        {
            id: 'wh-r3',
            title: 'Breath Hold',
            duration: 2.5,
            soundFile: null
        },
        {
            id: 'wh-rec3',
            title: 'Recovery Hold',
            duration: 0.25,
            soundFile: null
        }
    ]
});
const OFFICIAL_TEMPLATES = [
    MEDI_TEMPLATE,
    POMODORO_TEMPLATE,
    WIMHOF_TEMPLATE
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/ai/timer-machine.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "timerMachine",
    ()=>timerMachine
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xstate$2f$dist$2f$xstate$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/xstate/dist/xstate.development.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xstate$2f$dist$2f$assign$2d$ef1b62f6$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__a__as__assign$3e$__ = __turbopack_context__.i("[project]/node_modules/xstate/dist/assign-ef1b62f6.development.esm.js [app-client] (ecmascript) <export a as assign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xstate$2f$actors$2f$dist$2f$xstate$2d$actors$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/xstate/actors/dist/xstate-actors.development.esm.js [app-client] (ecmascript)");
;
const timerMachine = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xstate$2f$dist$2f$xstate$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["setup"])({
    types: {
        context: {},
        events: {},
        input: {}
    },
    actors: {
        intervalTicker: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xstate$2f$actors$2f$dist$2f$xstate$2d$actors$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromCallback"])(({ sendBack })=>{
            const id = setInterval(()=>sendBack({
                    type: 'TICK'
                }), 1000);
            return ()=>clearInterval(id);
        })
    },
    actions: {
        decrementTime: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xstate$2f$dist$2f$assign$2d$ef1b62f6$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__a__as__assign$3e$__["assign"])({
            timeLeft: ({ context })=>context.timeLeft - 1
        }),
        updateContext: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xstate$2f$dist$2f$assign$2d$ef1b62f6$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__a__as__assign$3e$__["assign"])({
            duration: ({ event })=>'duration' in event ? event.duration : 0,
            timeLeft: ({ event })=>'duration' in event ? event.duration : 0
        })
    }
}).createMachine({
    id: 'flow-timer',
    initial: 'idle',
    context: ({ input })=>({
            duration: input.duration,
            timeLeft: input.duration
        }),
    // GLOBAL EVENTS: Có thể gọi từ bất kỳ đâu
    on: {
        // Logic: Khi nhận phase mới (do user chọn hoặc auto-next), 
        // cập nhật context VÀ chuyển ngay sang trạng thái 'running'
        SELECT_PHASE: {
            target: '.running',
            reenter: true,
            actions: 'updateContext'
        },
        // Logic: Khi chọn 1 cycle mới, nạp phase đầu tiên vào nhưng KHÔNG chạy
        SELECT_CYCLE: {
            target: '.idle',
            reenter: true,
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
                START: 'running'
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
                PAUSE: 'paused'
            },
            // Tự động kiểm tra hết giờ
            always: {
                target: 'finished',
                guard: ({ context })=>context.timeLeft <= 0
            }
        },
        paused: {
            on: {
                RESUME: 'running'
            }
        },
        finished: {}
    }
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/useTimerStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTimerStore",
    ()=>useTimerStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xstate$2f$dist$2f$raise$2d$235fa0c7$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__c__as__createActor$3e$__ = __turbopack_context__.i("[project]/node_modules/xstate/dist/raise-235fa0c7.development.esm.js [app-client] (ecmascript) <export c as createActor>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ai$2f$timer$2d$machine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/ai/timer-machine.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useCycleStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useCycleStore.ts [app-client] (ecmascript)");
;
;
;
;
const useTimerStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        timerActor: null,
        snapshot: null,
        send: (event)=>{
            const { timerActor } = get();
            if (timerActor) {
                timerActor.send(event);
            } else {
                console.warn("Timer not initialized, cannot send event:", event);
                // Initialize and then send
                get().initializeTimer();
            // This is tricky because actor creation is async. A better approach
            // is to ensure initialization happens reliably on app start.
            // For now, we'll log a warning and the next user action will work.
            }
        },
        initializeTimer: ()=>{
            if (("TURBOPACK compile-time value", "object") === 'undefined' || get().timerActor) return;
            const { currentCycle, currentPhaseIndex, playSounds } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useCycleStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCycleStore"].getState();
            const initialPhase = currentCycle?.phases[currentPhaseIndex];
            const initialDuration = initialPhase?.duration ?? 25;
            const newActor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xstate$2f$dist$2f$raise$2d$235fa0c7$2e$development$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__c__as__createActor$3e$__["createActor"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$ai$2f$timer$2d$machine$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timerMachine"], {
                input: {
                    duration: initialDuration * 60
                }
            }).start();
            newActor.subscribe((snapshot)=>{
                // Update the store with the latest snapshot
                set({
                    snapshot
                });
                // The "Brain": Auto-next logic when a phase finishes
                if (snapshot.matches('finished')) {
                    const cycleStore = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useCycleStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCycleStore"].getState();
                    const { currentCycle, currentPhaseIndex } = cycleStore;
                    if (!currentCycle) {
                        newActor.send({
                            type: 'STOP_FOR_EDIT'
                        });
                        return;
                    }
                    // Play sound for the completed phase
                    const completedPhase = currentCycle.phases[currentPhaseIndex];
                    if (cycleStore.playSounds && completedPhase?.soundFile?.url) {
                        new Audio(completedPhase.soundFile.url).play().catch((err)=>console.error("Audio play failed:", err));
                    }
                    const nextIndex = currentPhaseIndex + 1;
                    const isLastPhase = nextIndex >= currentCycle.phases.length;
                    if (!isLastPhase) {
                        // Go to the next phase
                        const nextPhase = currentCycle.phases[nextIndex];
                        cycleStore.setCurrentPhaseIndex(nextIndex); // This will send the SELECT_PHASE event
                    } else {
                        // Here you could loop, or just stop. We'll stop.
                        newActor.send({
                            type: 'STOP_FOR_EDIT'
                        });
                        // Optionally, reset to the first phase visually
                        cycleStore.setCurrentPhaseIndex(0);
                    }
                }
            });
            set({
                timerActor: newActor,
                snapshot: newActor.getSnapshot()
            });
        },
        stopTimer: ()=>{
            get().timerActor?.stop();
            set({
                timerActor: null,
                snapshot: null
            });
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/useCycleStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCycleStore",
    ()=>useCycleStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/lib/firebase'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/v4.js [app-client] (ecmascript) <export default as v4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cycle$2d$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/cycle-templates.ts [app-client] (ecmascript)");
;
;
;
;
;
;
// --- Store Implementation ---
const initialState = {
    cycles: [],
    currentCycle: null,
    currentPhaseIndex: 0,
    isLoading: true,
    isGuestMode: true,
    userId: null,
    unsubscribe: null,
    playSounds: true
};
const useCycleStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        ...initialState,
        // --- ACTIONS ---
        loadGuestData: ()=>{
            const guestCycles = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cycle$2d$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OFFICIAL_TEMPLATES"].map((template)=>({
                    ...template,
                    createdAt: new Date()
                }));
            set({
                cycles: guestCycles,
                currentCycle: guestCycles[0] || null,
                currentPhaseIndex: 0,
                isLoading: false,
                isGuestMode: true,
                userId: null
            });
            const firstPhase = guestCycles[0]?.phases[0];
            if (firstPhase) {
                __turbopack_context__.r("[project]/src/store/useTimerStore.ts [app-client] (ecmascript)").useTimerStore.getState().send({
                    type: 'SELECT_CYCLE',
                    duration: firstPhase.duration * 60,
                    title: firstPhase.title
                });
            }
        },
        startSyncCycles: (uid)=>{
            const { unsubscribe } = get();
            if (unsubscribe) unsubscribe();
            set({
                isLoading: true,
                isGuestMode: false,
                userId: uid
            });
            const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(db, "users", uid, "cycles"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderBy"])("createdAt", "desc"));
            const newUnsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])(q, (snapshot)=>{
                if (snapshot.empty) {
                    console.log("User has no cycles, creating a default one.");
                    const defaultTemplate = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cycle$2d$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OFFICIAL_TEMPLATES"].find((t)=>t.id === 'template-pomodoro');
                    if (defaultTemplate) {
                        const newCycleData = {
                            ...defaultTemplate,
                            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
                        };
                        delete newCycleData.id;
                        delete newCycleData.isTemplate;
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(db, "users", uid, "cycles"), newCycleData);
                    }
                } else {
                    const cycles = snapshot.docs.map((doc)=>({
                            id: doc.id,
                            ...doc.data()
                        }));
                    const currentCycleId = get().currentCycle?.id;
                    const newCurrentCycle = cycles.find((c)=>c.id === currentCycleId) || cycles[0];
                    set({
                        cycles,
                        isLoading: false,
                        currentCycle: newCurrentCycle
                    });
                }
            }, (error)=>{
                console.error("Error syncing cycles:", error);
                set({
                    isLoading: false
                });
            });
            set({
                unsubscribe: newUnsubscribe
            });
        },
        stopSyncCycles: ()=>{
            get().unsubscribe?.();
            set({
                unsubscribe: null,
                userId: null
            });
            get().loadGuestData();
        },
        setCurrentCycle: (cycleId)=>{
            const cycle = get().cycles.find((c)=>c.id === cycleId) || null;
            set({
                currentCycle: cycle,
                currentPhaseIndex: 0
            });
            const firstPhase = cycle?.phases[0];
            if (firstPhase) {
                __turbopack_context__.r("[project]/src/store/useTimerStore.ts [app-client] (ecmascript)").useTimerStore.getState().send({
                    type: 'SELECT_CYCLE',
                    duration: firstPhase.duration * 60
                });
            }
        },
        setCurrentPhaseIndex: (index)=>{
            const { currentCycle } = get();
            const newPhase = currentCycle?.phases[index];
            set({
                currentPhaseIndex: index
            });
            if (newPhase) {
                __turbopack_context__.r("[project]/src/store/useTimerStore.ts [app-client] (ecmascript)").useTimerStore.getState().send({
                    type: 'SELECT_PHASE',
                    duration: newPhase.duration * 60
                });
            }
        },
        createNewCycle: async ()=>{
            const { userId, isGuestMode } = get();
            const newCycle = {
                name: "My New Cycle",
                isPublic: false,
                authorId: userId || 'guest',
                authorName: 'Guest',
                likes: 0,
                shares: 0,
                updatedAt: new Date().toISOString(),
                phases: [
                    {
                        ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cycle$2d$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_PHASE"],
                        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])()
                    }
                ]
            };
            if (isGuestMode || !userId) {
                const localCycle = {
                    ...newCycle,
                    id: `guest-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])()}`,
                    createdAt: new Date().toISOString()
                };
                set((state)=>({
                        cycles: [
                            ...state.cycles,
                            localCycle
                        ],
                        currentCycle: localCycle
                    }));
                return;
            }
            const docRef = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(db, "users", userId, "cycles"), {
                ...newCycle,
                createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
                updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
            });
            set((state)=>({
                    currentCycle: {
                        ...newCycle,
                        id: docRef.id,
                        createdAt: new Date().toISOString()
                    }
                }));
        },
        saveCurrentCycle: async ()=>{
            const { userId, isGuestMode, currentCycle } = get();
            if (isGuestMode || !userId || !currentCycle) return;
            const cycleInStore = get().cycles.find((c)=>c.id === currentCycle.id);
            if (cycleInStore && cycleInStore.isOfficial) return;
            const { id, ...cycleData } = currentCycle;
            const cycleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(db, "users", userId, "cycles", id);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])(cycleRef, {
                ...cycleData,
                updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])()
            }, {
                merge: true
            });
        },
        deleteCycle: async (cycleId)=>{
            __turbopack_context__.r("[project]/src/store/useTimerStore.ts [app-client] (ecmascript)").useTimerStore.getState().send({
                type: 'STOP_FOR_EDIT'
            });
            const { userId, isGuestMode, cycles, currentCycle } = get();
            if (isGuestMode || !userId) return;
            const cycleToDelete = cycles.find((c)=>c.id === cycleId);
            if (cycleToDelete && cycleToDelete.isOfficial) return;
            if (currentCycle?.id === cycleId) {
                const newCurrentCycle = cycles.find((c)=>c.id !== cycleId && !c.isOfficial) || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cycle$2d$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OFFICIAL_TEMPLATES"][0];
                set({
                    currentCycle: newCurrentCycle,
                    currentPhaseIndex: 0
                });
            }
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(db, "users", userId, "cycles", cycleId));
        },
        addPhase: ()=>{
            set((state)=>{
                if (!state.currentCycle || state.currentCycle.isOfficial) return {};
                const newPhase = {
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$cycle$2d$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DEFAULT_PHASE"],
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])()
                };
                const updatedPhases = [
                    ...state.currentCycle.phases,
                    newPhase
                ];
                const updatedCycle = {
                    ...state.currentCycle,
                    phases: updatedPhases
                };
                return {
                    currentCycle: updatedCycle,
                    cycles: state.cycles.map((c)=>c.id === updatedCycle.id ? updatedCycle : c)
                };
            });
        },
        updatePhase: (phaseId, updates)=>{
            __turbopack_context__.r("[project]/src/store/useTimerStore.ts [app-client] (ecmascript)").useTimerStore.getState().send({
                type: 'STOP_FOR_EDIT'
            });
            set((state)=>{
                if (!state.currentCycle || state.currentCycle.isOfficial) return {};
                const updatedPhases = state.currentCycle.phases.map((p)=>p.id === phaseId ? {
                        ...p,
                        ...updates
                    } : p);
                const updatedCycle = {
                    ...state.currentCycle,
                    phases: updatedPhases
                };
                return {
                    currentCycle: updatedCycle,
                    cycles: state.cycles.map((c)=>c.id === updatedCycle.id ? updatedCycle : c)
                };
            });
        },
        deletePhase: (phaseId)=>{
            __turbopack_context__.r("[project]/src/store/useTimerStore.ts [app-client] (ecmascript)").useTimerStore.getState().send({
                type: 'STOP_FOR_EDIT'
            });
            set((state)=>{
                if (!state.currentCycle || state.currentCycle.isOfficial) return {};
                const updatedPhases = state.currentCycle.phases.filter((p)=>p.id !== phaseId);
                const updatedCycle = {
                    ...state.currentCycle,
                    phases: updatedPhases
                };
                return {
                    currentCycle: updatedCycle,
                    cycles: state.cycles.map((c)=>c.id === updatedCycle.id ? updatedCycle : c)
                };
            });
        },
        updateCycle: (updates)=>{
            set((state)=>{
                if (!state.currentCycle) return {};
                const updatedCycle = {
                    ...state.currentCycle,
                    ...updates
                };
                return {
                    currentCycle: updatedCycle,
                    cycles: state.cycles.map((c)=>c.id === updatedCycle.id ? updatedCycle : c)
                };
            });
        },
        toggleSounds: ()=>set((state)=>({
                    playSounds: !state.playSounds
                }))
    }), {
    name: 'cycle-storage',
    onRehydrateStorage: ()=>(state)=>{
            if (state) {
                state.isLoading = true;
                state.playSounds = state.playSounds ?? true;
            }
        },
    partialize: (state)=>({
            cycles: [],
            currentCycleId: state.currentCycle?.id,
            currentPhaseIndex: state.currentPhaseIndex,
            userId: state.userId,
            isGuestMode: state.isGuestMode,
            playSounds: state.playSounds
        })
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/app/syncStoreGate.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SyncStoreGate",
    ()=>SyncStoreGate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$use$2d$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/use-auth-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useCycleStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useCycleStore.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function SyncStoreGate() {
    _s();
    // Initialize the auth listener when the app mounts
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SyncStoreGate.useEffect": ()=>{
            const unsubscribe = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$use$2d$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"].getState().initialize();
            // Cleanup the listener when the app unmounts
            return ({
                "SyncStoreGate.useEffect": ()=>unsubscribe()
            })["SyncStoreGate.useEffect"];
        }
    }["SyncStoreGate.useEffect"], []);
    // Select state values individually to prevent unnecessary re-renders
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$use$2d$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "SyncStoreGate.useAuthStore[user]": (s)=>s.user
    }["SyncStoreGate.useAuthStore[user]"]);
    const isInitialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$use$2d$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "SyncStoreGate.useAuthStore[isInitialized]": (s)=>s.isInitialized
    }["SyncStoreGate.useAuthStore[isInitialized]"]);
    // Select actions. These are stable and won't cause re-renders.
    const startSync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useCycleStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCycleStore"])({
        "SyncStoreGate.useCycleStore[startSync]": (s)=>s.startSyncCycles
    }["SyncStoreGate.useCycleStore[startSync]"]);
    const stopSync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useCycleStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCycleStore"])({
        "SyncStoreGate.useCycleStore[stopSync]": (s)=>s.stopSyncCycles
    }["SyncStoreGate.useCycleStore[stopSync]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SyncStoreGate.useEffect": ()=>{
            // Only proceed if the auth state has been initialized
            if (!isInitialized) return;
            if (user?.uid) {
                console.log("User detected, starting sync for UID:", user.uid);
                startSync(user.uid);
            } else {
                console.log("No user detected, loading guest data.");
                // Use stopSync to clean up any previous sync and load guest data
                stopSync();
            }
        }
    }["SyncStoreGate.useEffect"], [
        user,
        isInitialized,
        startSync,
        stopSync
    ]);
    return null; // This component does not render anything
}
_s(SyncStoreGate, "SuEQShGHuNcSJoKHtd7LgFJ85Ys=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$use$2d$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$use$2d$auth$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useCycleStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCycleStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useCycleStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCycleStore"]
    ];
});
_c = SyncStoreGate;
var _c;
__turbopack_context__.k.register(_c, "SyncStoreGate");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/store-initializer.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// This file is the SINGLE SOURCE OF TRUTH for connecting different stores.
// It is imported only once in the root layout to prevent circular dependencies
// and ensure that stores are initialized and connected in the correct order.
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useCycleStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useCycleStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useTimerStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useTimerStore.ts [app-client] (ecmascript)");
;
;
// This subscriber is responsible for initializing the timer when the app loads
// and cycle data becomes available for the first time.
__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useCycleStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCycleStore"].subscribe((state)=>state.currentCycle?.id, (currentCycleId, previousCycleId)=>{
    // If we just got a cycle for the first time, initialize the timer.
    if (currentCycleId && !previousCycleId) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useTimerStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTimerStore"].getState().initializeTimer();
    }
}, {
    fireImmediately: true
} // Ensures this runs on initial load
);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/app/client-initializer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClientInitializer",
    ()=>ClientInitializer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$store$2d$initializer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/store-initializer.ts [app-client] (ecmascript)");
"use client";
;
function ClientInitializer() {
    // This component renders nothing.
    return null;
}
_c = ClientInitializer;
var _c;
__turbopack_context__.k.register(_c, "ClientInitializer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_a7fbac42._.js.map