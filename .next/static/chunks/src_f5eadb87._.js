(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/hooks/use-toast.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "reducer": (()=>reducer),
    "toast": (()=>toast),
    "useToast": (()=>useToast)
});
// Inspired by react-hot-toast library
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST"
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId)=>{
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(()=>{
        toastTimeouts.delete(toastId);
        dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId
        });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action)=>{
    switch(action.type){
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [
                    action.toast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT)
            };
        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t)=>t.id === action.toast.id ? {
                        ...t,
                        ...action.toast
                    } : t)
            };
        case "DISMISS_TOAST":
            {
                const { toastId } = action;
                // ! Side effects ! - This could be extracted into a dismissToast() action,
                // but I'll keep it here for simplicity
                if (toastId) {
                    addToRemoveQueue(toastId);
                } else {
                    state.toasts.forEach((toast)=>{
                        addToRemoveQueue(toast.id);
                    });
                }
                return {
                    ...state,
                    toasts: state.toasts.map((t)=>t.id === toastId || toastId === undefined ? {
                            ...t,
                            open: false
                        } : t)
                };
            }
        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: []
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t)=>t.id !== action.toastId)
            };
    }
};
const listeners = [];
let memoryState = {
    toasts: []
};
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener)=>{
        listener(memoryState);
    });
}
function toast({ ...props }) {
    const id = genId();
    const update = (props)=>dispatch({
            type: "UPDATE_TOAST",
            toast: {
                ...props,
                id
            }
        });
    const dismiss = ()=>dispatch({
            type: "DISMISS_TOAST",
            toastId: id
        });
    dispatch({
        type: "ADD_TOAST",
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open)=>{
                if (!open) dismiss();
            }
        }
    });
    return {
        id: id,
        dismiss,
        update
    };
}
function useToast() {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(memoryState);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useToast.useEffect": ()=>{
            listeners.push(setState);
            return ({
                "useToast.useEffect": ()=>{
                    const index = listeners.indexOf(setState);
                    if (index > -1) {
                        listeners.splice(index, 1);
                    }
                }
            })["useToast.useEffect"];
        }
    }["useToast.useEffect"], [
        state
    ]);
    return {
        ...state,
        toast,
        dismiss: (toastId)=>dispatch({
                type: "DISMISS_TOAST",
                toastId
            })
    };
}
_s(useToast, "SPWE98mLGnlsnNfIwu/IAKTSZtk=");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/utils.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "cn": (()=>cn)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/toast.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Toast": (()=>Toast),
    "ToastAction": (()=>ToastAction),
    "ToastClose": (()=>ToastClose),
    "ToastDescription": (()=>ToastDescription),
    "ToastProvider": (()=>ToastProvider),
    "ToastTitle": (()=>ToastTitle),
    "ToastViewport": (()=>ToastViewport)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
const ToastProvider = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Provider"];
const ToastViewport = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 16,
        columnNumber: 3
    }, this));
_c1 = ToastViewport;
ToastViewport.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"].displayName;
const toastVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full", {
    variants: {
        variant: {
            default: "border bg-background text-foreground",
            destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
const Toast = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c2 = ({ className, variant, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(toastVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
});
_c3 = Toast;
Toast.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
const ToastAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Action"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 62,
        columnNumber: 3
    }, this));
_c5 = ToastAction;
ToastAction.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Action"].displayName;
const ToastClose = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600", className),
        "toast-close": "",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/toast.tsx",
            lineNumber: 86,
            columnNumber: 5
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 77,
        columnNumber: 3
    }, this));
_c7 = ToastClose;
ToastClose.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"].displayName;
const ToastTitle = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 95,
        columnNumber: 3
    }, this));
_c9 = ToastTitle;
ToastTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"].displayName;
const ToastDescription = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm opacity-90", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/toast.tsx",
        lineNumber: 107,
        columnNumber: 3
    }, this));
_c11 = ToastDescription;
ToastDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "ToastViewport$React.forwardRef");
__turbopack_context__.k.register(_c1, "ToastViewport");
__turbopack_context__.k.register(_c2, "Toast$React.forwardRef");
__turbopack_context__.k.register(_c3, "Toast");
__turbopack_context__.k.register(_c4, "ToastAction$React.forwardRef");
__turbopack_context__.k.register(_c5, "ToastAction");
__turbopack_context__.k.register(_c6, "ToastClose$React.forwardRef");
__turbopack_context__.k.register(_c7, "ToastClose");
__turbopack_context__.k.register(_c8, "ToastTitle$React.forwardRef");
__turbopack_context__.k.register(_c9, "ToastTitle");
__turbopack_context__.k.register(_c10, "ToastDescription$React.forwardRef");
__turbopack_context__.k.register(_c11, "ToastDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/toaster.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Toaster": (()=>Toaster)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/toast.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function Toaster() {
    _s();
    const { toasts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastProvider"], {
        children: [
            toasts.map(function({ id, title, description, action, ...props }) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toast"], {
                    ...props,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-1",
                            children: [
                                title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastTitle"], {
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/toaster.tsx",
                                    lineNumber: 22,
                                    columnNumber: 25
                                }, this),
                                description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastDescription"], {
                                    children: description
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/toaster.tsx",
                                    lineNumber: 24,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/toaster.tsx",
                            lineNumber: 21,
                            columnNumber: 13
                        }, this),
                        action,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastClose"], {}, void 0, false, {
                            fileName: "[project]/src/components/ui/toaster.tsx",
                            lineNumber: 28,
                            columnNumber: 13
                        }, this)
                    ]
                }, id, true, {
                    fileName: "[project]/src/components/ui/toaster.tsx",
                    lineNumber: 20,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastViewport"], {}, void 0, false, {
                fileName: "[project]/src/components/ui/toaster.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/toaster.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_s(Toaster, "1YTCnXrq2qRowe0H/LBWLjtXoYc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = Toaster;
var _c;
__turbopack_context__.k.register(_c, "Toaster");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/lib/firebase.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/lib/firebase.ts - FIXED VERSION (Oct 19, 2025) - NO DUPLICATES!
__turbopack_context__.s({
    "app": (()=>app),
    "auth": (()=>auth),
    "cyclesCollection": (()=>cyclesCollection),
    "db": (()=>db),
    "getUserDoc": (()=>getUserDoc),
    "getUserTrainingHistoriesQuery": (()=>getUserTrainingHistoriesQuery),
    "storage": (()=>storage),
    "trainingHistoriesCollection": (()=>trainingHistoriesCollection),
    "usersCollection": (()=>usersCollection)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm2017.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$storage$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/storage/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/storage/dist/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$35c79a8a$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__p__as__getAuth$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index-35c79a8a.js [app-client] (ecmascript) <export p as getAuth>");
;
;
;
;
const firebaseConfig = {
    projectId: ("TURBOPACK compile-time value", "studio-7242952701-d91b7"),
    appId: ("TURBOPACK compile-time value", "1:38049613185:web:e22afec7ccf8ef0e4c1480"),
    apiKey: ("TURBOPACK compile-time value", "AIzaSyDNbU6GsF43hHVbfuNJprugyB9_q4gSit0"),
    authDomain: ("TURBOPACK compile-time value", "studio-7242952701-d91b7.firebaseapp.com"),
    messagingSenderId: ("TURBOPACK compile-time value", "38049613185")
};
// Initialize Firebase
const app = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getApps"])().length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["initializeApp"])(firebaseConfig) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getApp"])();
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(app);
const storage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$storage$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStorage"])(app);
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$35c79a8a$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__p__as__getAuth$3e$__["getAuth"])(app);
;
const cyclesCollection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(db, 'cycles');
const trainingHistoriesCollection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(db, 'trainingHistories');
const usersCollection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(db, 'users');
const getUserDoc = (userId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(db, 'users', userId);
const getUserTrainingHistoriesQuery = (userId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(trainingHistoriesCollection, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('userId', '==', userId));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/contexts/auth-context.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/contexts/auth-context.tsx - FINAL VERSION (Oct 19, 2025)
__turbopack_context__.s({
    "AuthContext": (()=>AuthContext),
    "AuthProvider": (()=>AuthProvider),
    "useAuth": (()=>useAuth)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$35c79a8a$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__p__as__getAuth$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index-35c79a8a.js [app-client] (ecmascript) <export p as getAuth>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$35c79a8a$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__z__as__onAuthStateChanged$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index-35c79a8a.js [app-client] (ecmascript) <export z as onAuthStateChanged>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    user: null,
    loading: true,
    getCurrentUser: ()=>null
});
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$35c79a8a$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__p__as__getAuth$3e$__["getAuth"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["app"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$35c79a8a$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__z__as__onAuthStateChanged$3e$__["onAuthStateChanged"])(auth, {
                "AuthProvider.useEffect.unsubscribe": (user)=>{
                    setUser(user);
                    setLoading(false);
                }
            }["AuthProvider.useEffect.unsubscribe"]);
            return ({
                "AuthProvider.useEffect": ()=>unsubscribe()
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], [
        auth
    ]);
    // 🔥 THÊM HELPER
    const getCurrentUser = ()=>user;
    const value = {
        user,
        loading,
        getCurrentUser
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/auth-context.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "NiO5z6JIqzX62LS5UWDgIqbZYyY=");
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
};
_s1(useAuth, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/dal/user-dal.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/dal/user-dal.ts - FINAL VERSION (Oct 19, 2025)
__turbopack_context__.s({
    "addAudioAsset": (()=>addAudioAsset),
    "addPrivateCycleToUser": (()=>addPrivateCycleToUser),
    "createOrUpdateUserProfile": (()=>createOrUpdateUserProfile),
    "getPrivateCycleIds": (()=>getPrivateCycleIds),
    "getUserProfile": (()=>getUserProfile),
    "removePrivateCycleFromUser": (()=>removePrivateCycleFromUser)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/auth-context.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
;
;
;
async function getUserProfile() {
    _s();
    const { getCurrentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const user = getCurrentUser();
    if (!user) return null;
    const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserDoc"])(user.uid));
    return snap.exists() ? snap.data() : null;
}
_s(getUserProfile, "Ap5p+jiBKTKkTJW+1Xsm8YuKASI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
async function createOrUpdateUserProfile(profile) {
    _s1();
    const { getCurrentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    const fullProfile = {
        userId: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Anonymous',
        privateCycles: [],
        audioLibrary: [],
        createdAt: new Date().toISOString(),
        ...profile
    };
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserDoc"])(user.uid), fullProfile, {
        merge: true
    });
}
_s1(createOrUpdateUserProfile, "Ap5p+jiBKTKkTJW+1Xsm8YuKASI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
async function addPrivateCycleToUser(cycleId) {
    _s2();
    const { getCurrentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserDoc"])(user.uid), {
        privateCycles: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayUnion"])(cycleId)
    });
}
_s2(addPrivateCycleToUser, "Ap5p+jiBKTKkTJW+1Xsm8YuKASI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
async function removePrivateCycleFromUser(cycleId) {
    _s3();
    const { getCurrentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserDoc"])(user.uid), {
        privateCycles: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayRemove"])(cycleId)
    });
}
_s3(removePrivateCycleFromUser, "Ap5p+jiBKTKkTJW+1Xsm8YuKASI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
async function addAudioAsset(asset) {
    _s4();
    const { getCurrentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserDoc"])(user.uid), {
        audioLibrary: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayUnion"])(asset)
    });
}
_s4(addAudioAsset, "Ap5p+jiBKTKkTJW+1Xsm8YuKASI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
async function getPrivateCycleIds() {
    const profile = await getUserProfile();
    return profile?.privateCycles || [];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/dal/cycle-dal.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/dal/cycle-dal.ts - FINAL VERSION (Oct 19, 2025)
__turbopack_context__.s({
    "addPhaseToCycle": (()=>addPhaseToCycle),
    "createCycle": (()=>createCycle),
    "deleteCycle": (()=>deleteCycle),
    "getAllCycles": (()=>getAllCycles),
    "getCycleById": (()=>getCycleById),
    "getPrivateCycles": (()=>getPrivateCycles),
    "getPublicCycles": (()=>getPublicCycles),
    "removePhaseFromCycle": (()=>removePhaseFromCycle),
    "updateCycle": (()=>updateCycle)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$user$2d$dal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/dal/user-dal.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature();
;
;
;
;
async function getPublicCycles() {
    const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cyclesCollection"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('isPublic', '==', true), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderBy"])('createdAt', 'desc'));
    const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(q);
    return snapshot.docs.map((d)=>({
            id: d.id,
            ...d.data()
        }));
}
async function getPrivateCycles() {
    _s();
    const { getCurrentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cyclesCollection"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('authorId', '==', user.uid), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('isPublic', '==', false));
    const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(q);
    return snapshot.docs.map((d)=>({
            id: d.id,
            ...d.data()
        }));
}
_s(getPrivateCycles, "Ap5p+jiBKTKkTJW+1Xsm8YuKASI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
async function getAllCycles() {
    const [publicCycles, privateCycles] = await Promise.all([
        getPublicCycles(),
        getPrivateCycles()
    ]);
    return [
        ...publicCycles,
        ...privateCycles
    ];
}
async function getCycleById(cycleId) {
    _s1();
    const cycleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cyclesCollection"], cycleId);
    const snap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(cycleRef);
    if (!snap.exists()) return null;
    const cycle = {
        id: snap.id,
        ...snap.data()
    };
    // Permission check
    const { getCurrentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const user = getCurrentUser();
    if (!cycle.isPublic && user?.uid !== cycle.authorId) {
        throw new Error('Access denied: Private cycle');
    }
    return cycle;
}
_s1(getCycleById, "Ap5p+jiBKTKkTJW+1Xsm8YuKASI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
async function createCycle(cycleData) {
    _s2();
    const { getCurrentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    const newCycle = {
        ...cycleData,
        id: `cycle_${Date.now()}`,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous',
        likes: 0,
        shares: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    const cycleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cyclesCollection"], newCycle.id);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDoc"])(cycleRef, newCycle);
    // Add to user's privateCycles nếu private
    if (!newCycle.isPublic) {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$user$2d$dal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addPrivateCycleToUser"])(newCycle.id);
    }
    return newCycle;
}
_s2(createCycle, "Ap5p+jiBKTKkTJW+1Xsm8YuKASI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
async function updateCycle(cycleId, updates) {
    _s3();
    const cycle = await getCycleById(cycleId);
    if (!cycle) throw new Error('Cycle not found');
    const { getCurrentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const user = getCurrentUser();
    if (user?.uid !== cycle.authorId) throw new Error('Access denied');
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cyclesCollection"], cycleId), {
        ...updates,
        updatedAt: new Date().toISOString()
    });
}
_s3(updateCycle, "Ap5p+jiBKTKkTJW+1Xsm8YuKASI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
async function deleteCycle(cycleId) {
    _s4();
    const cycle = await getCycleById(cycleId);
    if (!cycle) throw new Error('Cycle not found');
    const { getCurrentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const user = getCurrentUser();
    if (user?.uid !== cycle.authorId) throw new Error('Access denied');
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cyclesCollection"], cycleId));
    // Remove from user's privateCycles nếu private
    if (!cycle.isPublic) {
        await removePrivateCycleFromUser(cycleId);
    }
}
_s4(deleteCycle, "Ap5p+jiBKTKkTJW+1Xsm8YuKASI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
async function addPhaseToCycle(cycleId, phase) {
    _s5();
    const cycle = await getCycleById(cycleId);
    if (!cycle) throw new Error('Cycle not found');
    const { getCurrentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const user = getCurrentUser();
    if (user?.uid !== cycle.authorId) throw new Error('Access denied');
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cyclesCollection"], cycleId), {
        phases: [
            ...cycle.phases,
            phase
        ],
        updatedAt: new Date().toISOString()
    });
}
_s5(addPhaseToCycle, "Ap5p+jiBKTKkTJW+1Xsm8YuKASI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
async function removePhaseFromCycle(cycleId, phaseId) {
    _s6();
    const cycle = await getCycleById(cycleId);
    if (!cycle) throw new Error('Cycle not found');
    const { getCurrentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const user = getCurrentUser();
    if (user?.uid !== cycle.authorId) throw new Error('Access denied');
    const newPhases = cycle.phases.filter((p)=>p.id !== phaseId);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cyclesCollection"], cycleId), {
        phases: newPhases,
        updatedAt: new Date().toISOString()
    });
}
_s6(removePhaseFromCycle, "Ap5p+jiBKTKkTJW+1Xsm8YuKASI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/dal/history-dal.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/dal/history-dal.ts - FINAL VERSION (Oct 19, 2025)
__turbopack_context__.s({
    "createTrainingHistory": (()=>createTrainingHistory),
    "deleteTrainingHistory": (()=>deleteTrainingHistory),
    "getHistoryByCycle": (()=>getHistoryByCycle),
    "getHistoryStats": (()=>getHistoryStats),
    "getTrainingHistory": (()=>getTrainingHistory)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/auth-context.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
;
;
;
async function createTrainingHistory(history) {
    _s();
    const { getCurrentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    const newHistory = {
        ...history,
        id: `hist_${Date.now()}`,
        userId: user.uid
    };
    const docRef = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trainingHistoriesCollection"], newHistory);
    return {
        ...newHistory,
        id: docRef.id
    };
}
_s(createTrainingHistory, "Ap5p+jiBKTKkTJW+1Xsm8YuKASI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
async function getTrainingHistory() {
    _s1();
    const { getCurrentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const user = getCurrentUser();
    if (!user) return [];
    const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trainingHistoriesCollection"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('userId', '==', user.uid), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderBy"])('completedAt', 'desc'));
    const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(q);
    return snapshot.docs.map((d)=>({
            id: d.id,
            ...d.data()
        }));
}
_s1(getTrainingHistory, "Ap5p+jiBKTKkTJW+1Xsm8YuKASI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
async function getHistoryByCycle(cycleId) {
    _s2();
    const { getCurrentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const user = getCurrentUser();
    if (!user) return [];
    const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["query"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trainingHistoriesCollection"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('userId', '==', user.uid), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["where"])('cycleId', '==', cycleId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["orderBy"])('completedAt', 'desc'));
    const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDocs"])(q);
    return snapshot.docs.map((d)=>({
            id: d.id,
            ...d.data()
        }));
}
_s2(getHistoryByCycle, "Ap5p+jiBKTKkTJW+1Xsm8YuKASI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
async function deleteTrainingHistory(historyId) {
    _s3();
    const { getCurrentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trainingHistoriesCollection"], historyId));
}
_s3(deleteTrainingHistory, "Ap5p+jiBKTKkTJW+1Xsm8YuKASI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
async function getHistoryStats() {
    const history = await getTrainingHistory();
    const completed = history.filter((h)=>h.status === 'completed');
    return {
        totalSessions: history.length,
        totalTime: history.reduce((sum, h)=>sum + h.totalDuration, 0),
        completedSessions: completed.length,
        avgSessionTime: completed.length > 0 ? Math.round(completed.reduce((sum, h)=>sum + h.totalDuration, 0) / completed.length) : 0
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/dal/index.ts [app-client] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/dal/index.ts - EXPORT TẤT CẢ
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$cycle$2d$dal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/dal/cycle-dal.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$history$2d$dal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/dal/history-dal.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$user$2d$dal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/dal/user-dal.ts [app-client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/dal/index.ts [app-client] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$cycle$2d$dal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/dal/cycle-dal.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$history$2d$dal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/dal/history-dal.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$user$2d$dal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/dal/user-dal.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/dal/index.ts [app-client] (ecmascript) <locals>");
}}),
"[project]/src/lib/mock-data.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/lib/mock-data.ts - FINAL VERSION (Oct 19, 2025) - DAL COMPATIBLE
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "defaultCycle": (()=>defaultCycle),
    "mockAudioLibrary": (()=>mockAudioLibrary),
    "mockTrainingHistory": (()=>mockTrainingHistory),
    "mockUserProfile": (()=>mockUserProfile),
    "pomodoroCycle": (()=>pomodoroCycle),
    "wimHofCycle": (()=>wimHofCycle)
});
const mockAudioLibrary = [
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
const mockTrainingHistory = [
    {
        id: "hist1",
        cycleId: "cycle_pomodoro",
        name: "Pomodoro Classic",
        startTime: "2025-09-26T09:00:00Z",
        endTime: "2025-09-26T11:15:00Z",
        totalDuration: 135,
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
        totalDuration: 3,
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
const pomodoroCycle = {
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
        }
    ],
    isPublic: true,
    authorId: "user123",
    authorName: "User",
    likes: 150,
    shares: 30,
    createdAt: "2025-09-23T10:00:00Z",
    updatedAt: "2025-09-23T10:00:00Z"
};
const wimHofCycle = {
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
        }
    ],
    isPublic: true,
    authorId: "uid_system",
    authorName: "Timeflow Team",
    likes: 1337,
    shares: 42,
    createdAt: "2025-09-22T23:00:00Z",
    updatedAt: "2025-09-22T23:00:00Z"
};
const defaultCycle = {
    id: "cycle_default_wimhof",
    name: "🏔️ Wim Hof Quick Start",
    phases: [
        ...wimHofCycle.phases
    ],
    isPublic: false,
    authorId: "system",
    authorName: "Your Quick Start",
    likes: 0,
    shares: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};
const mockUserProfile = {
    userId: "user123",
    email: "user@example.com",
    displayName: "John Doe",
    privateCycles: [
        "cycle_default_wimhof"
    ],
    audioLibrary: mockAudioLibrary,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
};
const __TURBOPACK__default__export__ = {
    mockAudioLibrary,
    pomodoroCycle,
    wimHofCycle,
    defaultCycle,
    mockTrainingHistory,
    mockUserProfile
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/contexts/cycle-context.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/contexts/cycle-context.tsx - DAL INTEGRATED (Oct 19, 2025)
// 🔥 100% SỬ DỤNG DAL - KHÔNG CÒN FIRESTORE DIRECT CALLS!
__turbopack_context__.s({
    "CycleProvider": (()=>CycleProvider),
    "useCycle": (()=>useCycle)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/dal/index.ts [app-client] (ecmascript) <module evaluation>"); // 🔥 DAL IMPORTS
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$cycle$2d$dal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/dal/cycle-dal.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$history$2d$dal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/dal/history-dal.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mock-data.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const { mockAudioLibrary, pomodoroCycle, wimHofCycle, defaultCycle } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
const CycleContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function useCycle() {
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CycleContext);
    if (!context) throw new Error("useCycle must be used within a CycleProvider");
    return context;
}
_s(useCycle, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function CycleProvider({ children }) {
    _s1();
    const { user, loading: authLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthContext"]);
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const [allCycles, setAllCycles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [privateCycles, setPrivateCycles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [currentCycle, setCurrentCycleState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [currentPhaseIndex, setCurrentPhaseIndexState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [audioLibrary, setAudioLibrary] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(mockAudioLibrary);
    const [endOfCycleSound, setEndOfCycleSound] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(mockAudioLibrary[0] || null);
    // 🔥 LOAD CYCLES - SỬ DỤNG DAL
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CycleProvider.useEffect": ()=>{
            const loadCycles = {
                "CycleProvider.useEffect.loadCycles": async ()=>{
                    if (authLoading) {
                        setIsLoading(true);
                        return;
                    }
                    setIsLoading(true);
                    if (!user) {
                        // GUEST: Mock public cycles
                        const publicCycles = [
                            pomodoroCycle,
                            wimHofCycle
                        ];
                        setAllCycles(publicCycles);
                        setPrivateCycles([]);
                        setCurrentCycleState(defaultCycle);
                        setIsLoading(false);
                        return;
                    }
                    try {
                        // 🔥 DAL CALLS - PARALLEL
                        const [publicCycles, privateCycles] = await Promise.all([
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$cycle$2d$dal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPublicCycles"])(),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$cycle$2d$dal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrivateCycles"])()
                        ]);
                        setAllCycles([
                            ...publicCycles,
                            ...privateCycles
                        ]);
                        setPrivateCycles(privateCycles);
                        // Set default cycle
                        if (!currentCycle) {
                            setCurrentCycleState(defaultCycle);
                        }
                    } catch (error) {
                        toast({
                            title: "Load Error",
                            description: "Failed to load cycles",
                            variant: "destructive"
                        });
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["CycleProvider.useEffect.loadCycles"];
            loadCycles();
        }
    }["CycleProvider.useEffect"], [
        user,
        authLoading,
        toast
    ]);
    // 🔥 LOG TRAINING - SỬ DỤNG HISTORY DAL
    const logTraining = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CycleProvider.useCallback[logTraining]": async ()=>{
            if (!currentCycle || !user) return;
            try {
                const totalDuration = currentCycle.phases.reduce({
                    "CycleProvider.useCallback[logTraining].totalDuration": (sum, p)=>sum + p.duration
                }["CycleProvider.useCallback[logTraining].totalDuration"], 0);
                const historyData = {
                    cycleId: currentCycle.id,
                    name: currentCycle.name,
                    startTime: new Date().toISOString(),
                    endTime: new Date().toISOString(),
                    totalDuration,
                    cycleCount: 1,
                    completedAt: new Date().toISOString(),
                    status: 'completed'
                };
                // 🔥 DAL CALL
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$history$2d$dal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTrainingHistory"])(historyData);
                toast({
                    title: "🎉 Completed!",
                    description: `${totalDuration}m session logged!`
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to log session",
                    variant: "destructive"
                });
            }
        }
    }["CycleProvider.useCallback[logTraining]"], [
        currentCycle,
        user,
        toast
    ]);
    // 🔥 SAVE CYCLE CHANGES - SỬ DỤNG DAL
    const saveCycleChanges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CycleProvider.useCallback[saveCycleChanges]": async ()=>{
            if (!user || !currentCycle || currentCycle.id.startsWith('cycle_template_')) {
                toast({
                    title: "Error",
                    description: "Cannot save template.",
                    variant: "destructive"
                });
                return;
            }
            try {
                const cycleToSave = {
                    ...currentCycle,
                    updatedAt: new Date().toISOString(),
                    authorId: user.uid,
                    isPublic: false
                };
                // 🔥 DAL CALL
                await updateCycle(currentCycle.id, cycleToSave);
                toast({
                    title: "Saved ✅",
                    description: "Cycle updated!"
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: error.message || "Save failed.",
                    variant: "destructive"
                });
            }
        }
    }["CycleProvider.useCallback[saveCycleChanges]"], [
        user,
        currentCycle,
        toast
    ]);
    // 🔥 CREATE NEW CYCLE - SỬ DỤNG DAL
    const createNewCycle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CycleProvider.useCallback[createNewCycle]": async ()=>{
            if (!user || !currentCycle) return;
            try {
                const { id, ...cycleData } = currentCycle;
                const newCycleData = {
                    ...cycleData,
                    authorId: user.uid,
                    isPublic: false,
                    likes: 0,
                    shares: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                // 🔥 DAL CALL
                const savedCycle = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$cycle$2d$dal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCycle"])(newCycleData);
                setCurrentCycleState(savedCycle);
                setPrivateCycles({
                    "CycleProvider.useCallback[createNewCycle]": (prev)=>[
                            ...prev,
                            savedCycle
                        ]
                }["CycleProvider.useCallback[createNewCycle]"]);
                setAllCycles({
                    "CycleProvider.useCallback[createNewCycle]": (prev)=>[
                            ...prev,
                            savedCycle
                        ]
                }["CycleProvider.useCallback[createNewCycle]"]);
                toast({
                    title: "Created ✅",
                    description: `New cycle "${newCycleData.name}" saved!`
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: error.message || "Failed to create cycle.",
                    variant: "destructive"
                });
            }
        }
    }["CycleProvider.useCallback[createNewCycle]"], [
        user,
        currentCycle,
        toast
    ]);
    // 🔥 DELETE CYCLE - SỬ DỤNG DAL
    const deleteCycle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CycleProvider.useCallback[deleteCycle]": async (cycleId)=>{
            if (cycleId.startsWith("cycle_template_")) return;
            try {
                // 🔥 DAL CALL
                await deleteCycle(cycleId);
                setAllCycles({
                    "CycleProvider.useCallback[deleteCycle]": (prev)=>prev.filter({
                            "CycleProvider.useCallback[deleteCycle]": (c)=>c.id !== cycleId
                        }["CycleProvider.useCallback[deleteCycle]"])
                }["CycleProvider.useCallback[deleteCycle]"]);
                setPrivateCycles({
                    "CycleProvider.useCallback[deleteCycle]": (prev)=>prev.filter({
                            "CycleProvider.useCallback[deleteCycle]": (c)=>c.id !== cycleId
                        }["CycleProvider.useCallback[deleteCycle]"])
                }["CycleProvider.useCallback[deleteCycle]"]);
                if (currentCycle?.id === cycleId) {
                    const newCurrent = allCycles.find({
                        "CycleProvider.useCallback[deleteCycle]": (c)=>c.id !== cycleId
                    }["CycleProvider.useCallback[deleteCycle]"]) || defaultCycle;
                    setCurrentCycleState(newCurrent);
                    setCurrentPhaseIndexState(0);
                }
                toast({
                    title: "Deleted ✅",
                    description: "Cycle removed!"
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: error.message || "Delete failed.",
                    variant: "destructive"
                });
            }
        }
    }["CycleProvider.useCallback[deleteCycle]"], [
        currentCycle,
        allCycles,
        toast
    ]);
    // 🔥 LOCAL STATE FUNCTIONS (không cần DAL)
    const setCurrentCycle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CycleProvider.useCallback[setCurrentCycle]": (cycle)=>{
            setCurrentCycleState(cycle);
            setCurrentPhaseIndexState(0);
        }
    }["CycleProvider.useCallback[setCurrentCycle]"], []);
    const advancePhase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CycleProvider.useCallback[advancePhase]": ()=>{
            if (!currentCycle) return 0;
            const nextIndex = Math.min(currentPhaseIndex + 1, currentCycle.phases.length - 1);
            setCurrentPhaseIndexState(nextIndex);
            return nextIndex;
        }
    }["CycleProvider.useCallback[advancePhase]"], [
        currentCycle,
        currentPhaseIndex
    ]);
    const setCurrentPhaseIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CycleProvider.useCallback[setCurrentPhaseIndex]": (index)=>{
            if (!currentCycle) return;
            const validIndex = Math.max(0, Math.min(index, currentCycle.phases.length - 1));
            setCurrentPhaseIndexState(validIndex);
        }
    }["CycleProvider.useCallback[setCurrentPhaseIndex]"], [
        currentCycle
    ]);
    const resetCycle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CycleProvider.useCallback[resetCycle]": ()=>{
            setCurrentPhaseIndexState(0);
        }
    }["CycleProvider.useCallback[resetCycle]"], []);
    const updateCycle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CycleProvider.useCallback[updateCycle]": (updates)=>{
            setCurrentCycleState({
                "CycleProvider.useCallback[updateCycle]": (prev)=>prev ? {
                        ...prev,
                        ...updates
                    } : null
            }["CycleProvider.useCallback[updateCycle]"]);
        }
    }["CycleProvider.useCallback[updateCycle]"], []);
    const updatePhase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CycleProvider.useCallback[updatePhase]": (phaseId, updates)=>{
            setCurrentCycleState({
                "CycleProvider.useCallback[updatePhase]": (prev)=>{
                    if (!prev) return null;
                    const newPhases = prev.phases.map({
                        "CycleProvider.useCallback[updatePhase].newPhases": (p)=>p.id === phaseId ? {
                                ...p,
                                ...updates
                            } : p
                    }["CycleProvider.useCallback[updatePhase].newPhases"]);
                    return {
                        ...prev,
                        phases: newPhases
                    };
                }
            }["CycleProvider.useCallback[updatePhase]"]);
        }
    }["CycleProvider.useCallback[updatePhase]"], []);
    const addPhase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CycleProvider.useCallback[addPhase]": (newPhaseData)=>{
            setCurrentCycleState({
                "CycleProvider.useCallback[addPhase]": (prev)=>{
                    if (!prev) return null;
                    if (!newPhaseData.title || newPhaseData.duration === undefined) return prev;
                    const newPhase = {
                        id: `phase_${Math.random().toString(36).substr(2, 9)}`,
                        title: newPhaseData.title,
                        duration: newPhaseData.duration,
                        soundFile: audioLibrary[0] || null,
                        removable: true,
                        ...newPhaseData
                    };
                    return {
                        ...prev,
                        phases: [
                            ...prev.phases,
                            newPhase
                        ]
                    };
                }
            }["CycleProvider.useCallback[addPhase]"]);
        }
    }["CycleProvider.useCallback[addPhase]"], [
        audioLibrary
    ]);
    const deletePhase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CycleProvider.useCallback[deletePhase]": (phaseId)=>{
            setCurrentCycleState({
                "CycleProvider.useCallback[deletePhase]": (prev)=>{
                    if (!prev || prev.phases.length <= 1) return prev;
                    const newPhases = prev.phases.filter({
                        "CycleProvider.useCallback[deletePhase].newPhases": (p)=>p.id !== phaseId
                    }["CycleProvider.useCallback[deletePhase].newPhases"]);
                    const newIndex = Math.min(currentPhaseIndex, newPhases.length - 1);
                    setCurrentPhaseIndexState(newIndex);
                    return {
                        ...prev,
                        phases: newPhases
                    };
                }
            }["CycleProvider.useCallback[deletePhase]"]);
        }
    }["CycleProvider.useCallback[deletePhase]"], [
        currentPhaseIndex
    ]);
    // 🔥 PHASE CRUD - SỬ DỤNG DAL (khi save)
    const savePhaseChanges = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CycleProvider.useCallback[savePhaseChanges]": async (phaseId)=>{
            if (!currentCycle || !user) return;
            const phase = currentCycle.phases.find({
                "CycleProvider.useCallback[savePhaseChanges].phase": (p)=>p.id === phaseId
            }["CycleProvider.useCallback[savePhaseChanges].phase"]);
            if (!phase) return;
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$cycle$2d$dal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addPhaseToCycle"])(currentCycle.id, phase);
                toast({
                    title: "Phase saved!"
                });
            } catch (error) {
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive"
                });
            }
        }
    }["CycleProvider.useCallback[savePhaseChanges]"], [
        currentCycle,
        user,
        toast
    ]);
    const currentPhase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CycleProvider.useMemo[currentPhase]": ()=>{
            if (!currentCycle) return null;
            const index = Math.min(currentPhaseIndex, currentCycle.phases.length - 1);
            return currentCycle.phases[index] || null;
        }
    }["CycleProvider.useMemo[currentPhase]"], [
        currentCycle,
        currentPhaseIndex
    ]);
    const value = {
        privateCycles,
        allCycles,
        currentCycle,
        currentPhaseIndex,
        currentPhase,
        audioLibrary,
        endOfCycleSound,
        isLoading,
        setEndOfCycleSound,
        setCurrentCycle,
        setCurrentPhaseIndex,
        advancePhase,
        resetCycle,
        updateCycle,
        updatePhase,
        addPhase,
        deletePhase,
        deleteCycle,
        logTraining,
        saveCycleChanges,
        createNewCycle
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CycleContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/cycle-context.tsx",
        lineNumber: 331,
        columnNumber: 5
    }, this);
}
_s1(CycleProvider, "a3k8YBtAzD+tKMyc5a7u2NKjDwk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = CycleProvider;
var _c;
__turbopack_context__.k.register(_c, "CycleProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/contexts/history-context.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/contexts/history-context.tsx - FIXED VERSION (Oct 19, 2025)
// 🔥 REMOVE useCycle() - PASS CYCLE AS PROP
__turbopack_context__.s({
    "HistoryProvider": (()=>HistoryProvider),
    "useHistory": (()=>useHistory)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/dal/index.ts [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$history$2d$dal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/dal/history-dal.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/use-toast.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mock-data.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const { mockTrainingHistory } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
const HistoryContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function useHistory() {
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(HistoryContext);
    if (!context) throw new Error("useHistory must be used within HistoryProvider");
    return context;
}
_s(useHistory, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function HistoryProvider({ children, currentCycle }) {
    _s1();
    const { user, loading: authLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthContext"]);
    const { toast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"])();
    const [trainingHistory, setTrainingHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        totalSessions: 0,
        totalTime: 0,
        completedSessions: 0,
        avgSessionTime: 0
    });
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [recentSessions, setRecentSessions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [cycleStats, setCycleStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    // 🔥 LOAD HISTORY - SAME AS BEFORE
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HistoryProvider.useEffect": ()=>{
            const loadHistory = {
                "HistoryProvider.useEffect.loadHistory": async ()=>{
                    if (authLoading) {
                        setIsLoading(true);
                        return;
                    }
                    setIsLoading(true);
                    if (!user) {
                        setTrainingHistory([]);
                        setStats({
                            totalSessions: 0,
                            totalTime: 0,
                            completedSessions: 0,
                            avgSessionTime: 0
                        });
                        setRecentSessions([]);
                        setCycleStats({});
                        setIsLoading(false);
                        return;
                    }
                    try {
                        const [history, statsData] = await Promise.all([
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$history$2d$dal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTrainingHistory"])(),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$history$2d$dal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getHistoryStats"])()
                        ]);
                        setTrainingHistory(history);
                        setStats(statsData);
                        setRecentSessions(history.slice(0, 5));
                        const cycleMap = {};
                        history.forEach({
                            "HistoryProvider.useEffect.loadHistory": (h)=>{
                                if (!cycleMap[h.cycleId]) cycleMap[h.cycleId] = {
                                    count: 0,
                                    totalTime: 0
                                };
                                cycleMap[h.cycleId].count++;
                                cycleMap[h.cycleId].totalTime += h.totalDuration;
                            }
                        }["HistoryProvider.useEffect.loadHistory"]);
                        setCycleStats(cycleMap);
                    } catch (error) {
                        toast({
                            title: "Load Error",
                            description: "Failed to load history",
                            variant: "destructive"
                        });
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["HistoryProvider.useEffect.loadHistory"];
            loadHistory();
        }
    }["HistoryProvider.useEffect"], [
        user,
        authLoading,
        toast
    ]);
    // 🔥 LOG SESSION - USE PASSED CYCLE
    const logSession = async (cycle, status = 'completed')=>{
        if (!user || !cycle) return;
        try {
            const totalDuration = cycle.phases.reduce((sum, p)=>sum + p.duration, 0);
            const historyData = {
                cycleId: cycle.id,
                name: cycle.name,
                startTime: new Date().toISOString(),
                endTime: new Date().toISOString(),
                totalDuration,
                cycleCount: 1,
                completedAt: new Date().toISOString(),
                status,
                notes: status === 'interrupted' ? 'Session interrupted' : undefined
            };
            const newHistory = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$dal$2f$history$2d$dal$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTrainingHistory"])(historyData);
            setTrainingHistory((prev)=>[
                    newHistory,
                    ...prev
                ]);
            setRecentSessions((prev)=>[
                    newHistory,
                    ...prev.slice(0, 4)
                ]);
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
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to log session",
                variant: "destructive"
            });
        }
    };
    // 🔥 DELETE SESSION - ADD MISSING IMPORT
    const deleteSession = async (historyId)=>{
        try {
            await deleteTrainingHistory(historyId); // 🔥 NOW IMPORTED!
            setTrainingHistory((prev)=>prev.filter((h)=>h.id !== historyId));
            setRecentSessions((prev)=>prev.filter((h)=>h.id !== historyId));
            toast({
                title: "Deleted ✅",
                description: "Session removed!"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Delete failed.",
                variant: "destructive"
            });
        }
    };
    const getSessionsByCycle = (cycleId)=>{
        return trainingHistory.filter((h)=>h.cycleId === cycleId).slice(0, 10);
    };
    const isEmpty = trainingHistory.length === 0;
    const value = {
        trainingHistory,
        stats,
        recentSessions,
        cycleStats,
        logSession,
        deleteSession,
        getSessionsByCycle,
        isLoading,
        isEmpty
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HistoryContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/history-context.tsx",
        lineNumber: 140,
        columnNumber: 10
    }, this);
}
_s1(HistoryProvider, "+BeBWZ3AqY89kQtZ79tB9yq48a0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToast"]
    ];
});
_c = HistoryProvider;
var _c;
__turbopack_context__.k.register(_c, "HistoryProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/contexts/settings-context.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/contexts/settings-context.tsx - OPTIMIZED VERSION (Oct 19, 2025)
__turbopack_context__.s({
    "SettingsProvider": (()=>SettingsProvider),
    "useSettings": (()=>useSettings)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const defaultSettings = {
    playSounds: true,
    theme: "system"
};
const SettingsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function useSettings() {
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
_s(useSettings, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function SettingsProvider({ children }) {
    _s1();
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "SettingsProvider.useState": ()=>defaultSettings
    }["SettingsProvider.useState"]);
    // 🔥 OPTIMIZE 1: DEBOUNCE SAVE
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SettingsProvider.useEffect": ()=>{
            let timeoutId;
            const saveToStorage = {
                "SettingsProvider.useEffect.saveToStorage": ()=>{
                    try {
                        localStorage.setItem("flowtime-settings", JSON.stringify(settings));
                    } catch (error) {
                        console.error("Failed to save settings", error);
                    }
                }
            }["SettingsProvider.useEffect.saveToStorage"];
            timeoutId = setTimeout(saveToStorage, 300); // Debounce 300ms
            return ({
                "SettingsProvider.useEffect": ()=>clearTimeout(timeoutId)
            })["SettingsProvider.useEffect"];
        }
    }["SettingsProvider.useEffect"], [
        settings
    ]);
    // 🔥 LOAD FROM STORAGE
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SettingsProvider.useEffect": ()=>{
            try {
                const stored = localStorage.getItem("flowtime-settings");
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setSettings({
                        "SettingsProvider.useEffect": (prev)=>({
                                ...prev,
                                ...parsed
                            })
                    }["SettingsProvider.useEffect"]);
                }
            } catch (error) {
                console.error("Failed to load settings", error);
            }
        }
    }["SettingsProvider.useEffect"], []);
    // 🔥 OPTIMIZE 2: INITIAL THEME + SYNC
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SettingsProvider.useEffect": ()=>{
            const root = document.documentElement;
            // Set initial theme (no flash)
            const applyTheme = {
                "SettingsProvider.useEffect.applyTheme": ()=>{
                    root.classList.remove("light", "dark");
                    if (settings.theme === "system") {
                        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                        root.classList.add(systemTheme);
                    } else {
                        root.classList.add(settings.theme);
                    }
                }
            }["SettingsProvider.useEffect.applyTheme"];
            // Initial apply
            applyTheme();
            // Listen for system changes
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleChange = {
                "SettingsProvider.useEffect.handleChange": ()=>settings.theme === "system" && applyTheme()
            }["SettingsProvider.useEffect.handleChange"];
            mediaQuery.addEventListener("change", handleChange);
            return ({
                "SettingsProvider.useEffect": ()=>mediaQuery.removeEventListener("change", handleChange)
            })["SettingsProvider.useEffect"];
        }
    }["SettingsProvider.useEffect"], [
        settings.theme
    ]);
    // 🔥 HELPER FUNCTIONS
    const toggleSounds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SettingsProvider.useCallback[toggleSounds]": ()=>{
            setSettings({
                "SettingsProvider.useCallback[toggleSounds]": (prev)=>({
                        ...prev,
                        playSounds: !prev.playSounds
                    })
            }["SettingsProvider.useCallback[toggleSounds]"]);
        }
    }["SettingsProvider.useCallback[toggleSounds]"], []);
    const setTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SettingsProvider.useCallback[setTheme]": (theme)=>{
            setSettings({
                "SettingsProvider.useCallback[setTheme]": (prev)=>({
                        ...prev,
                        theme
                    })
            }["SettingsProvider.useCallback[setTheme]"]);
        }
    }["SettingsProvider.useCallback[setTheme]"], []);
    const value = {
        settings,
        setSettings,
        toggleSounds,
        setTheme
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SettingsContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/settings-context.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
_s1(SettingsProvider, "wFHVezLXxlrOMS2yT3OjIdoLqvI=");
_c = SettingsProvider;
var _c;
__turbopack_context__.k.register(_c, "SettingsProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/contexts/timer-context.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/contexts/timer-context.tsx - FIXED 100% (Oct 19, 2025)
__turbopack_context__.s({
    "TimerProvider": (()=>TimerProvider),
    "useTimer": (()=>useTimer)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$settings$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/settings-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$cycle$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/cycle-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$history$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/history-context.tsx [app-client] (ecmascript)"); // 🔥 FIX 1: ADD IMPORT
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/auth-context.tsx [app-client] (ecmascript)"); // 🔥 FIX 2: ADD USER
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$howler$2f$dist$2f$howler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/howler/dist/howler.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const TimerContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const useTimer = ()=>{
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(TimerContext);
    if (!context) throw new Error('useTimer must be used within a TimerProvider');
    return context;
};
_s(useTimer, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const TimerProvider = ({ children })=>{
    _s1();
    const { settings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$settings$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])(); // 🔥 FIX 2: GET USER
    const { currentCycle, currentPhaseIndex, currentPhase, advancePhase, resetCycle, audioLibrary, endOfCycleSound } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$cycle$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCycle"])();
    const { logSession } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$history$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHistory"])(); // 🔥 FIX 3: USE logSession
    const [isActive, setIsActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [cyclesCompleted, setCyclesCompleted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [sessionPhaseRecords, setSessionPhaseRecords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const getDuration = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TimerProvider.useCallback[getDuration]": ()=>{
            return currentPhase?.duration ? currentPhase.duration * 60 : 0;
        }
    }["TimerProvider.useCallback[getDuration]"], [
        currentPhase
    ]);
    const [timeLeft, setTimeLeft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(getDuration());
    const intervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const soundRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const sessionsUntilLongRestRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(5);
    const playSound = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TimerProvider.useCallback[playSound]": (soundUrl)=>{
            if (!settings.playSounds) return;
            const urlToPlay = soundUrl || currentPhase?.soundFile?.url || audioLibrary[0]?.url;
            if (urlToPlay) {
                if (soundRef.current) {
                    soundRef.current.stop();
                    soundRef.current.unload();
                    soundRef.current = null;
                }
                const sound = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$howler$2f$dist$2f$howler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Howl"]({
                    src: [
                        urlToPlay
                    ],
                    html5: true,
                    volume: 0.8,
                    onload: {
                        "TimerProvider.useCallback[playSound]": ()=>{
                            console.log('Sound loaded!');
                            sound.play();
                        }
                    }["TimerProvider.useCallback[playSound]"],
                    onerror: {
                        "TimerProvider.useCallback[playSound]": (id, error)=>{
                            console.error('Howler error:', error);
                            const fallback = new Audio(urlToPlay);
                            fallback.volume = 0.8;
                            fallback.play().catch({
                                "TimerProvider.useCallback[playSound]": (e)=>console.error('Fallback error:', e)
                            }["TimerProvider.useCallback[playSound]"]);
                        }
                    }["TimerProvider.useCallback[playSound]"]
                });
                soundRef.current = sound;
            }
        }
    }["TimerProvider.useCallback[playSound]"], [
        settings.playSounds,
        currentPhase,
        audioLibrary
    ]); // 🔥 FIX 5: ADD DEPS
    // Main timer tick
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TimerProvider.useEffect": ()=>{
            if (isActive) {
                intervalRef.current = setInterval({
                    "TimerProvider.useEffect": ()=>{
                        setTimeLeft({
                            "TimerProvider.useEffect": (prev)=>prev > 0 ? prev - 1 : 0
                        }["TimerProvider.useEffect"]);
                    }
                }["TimerProvider.useEffect"], 1000);
            } else if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            return ({
                "TimerProvider.useEffect": ()=>{
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            })["TimerProvider.useEffect"];
        }
    }["TimerProvider.useEffect"], [
        isActive
    ]);
    // Phase end logic
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TimerProvider.useEffect": ()=>{
            if (timeLeft > 0 || !isActive) return;
            setIsActive(false);
            setSessionPhaseRecords({
                "TimerProvider.useEffect": (prev)=>[
                        ...prev,
                        {
                            title: currentPhase.title,
                            duration: currentPhase.duration,
                            completionStatus: 'completed'
                        }
                    ]
            }["TimerProvider.useEffect"]);
            const isLastPhase = currentPhaseIndex >= (currentCycle?.phases.length || 0) - 1;
            if (isLastPhase) {
                const newCyclesCompleted = cyclesCompleted + 1;
                setCyclesCompleted(newCyclesCompleted);
                if (sessionsUntilLongRestRef.current > 0 && newCyclesCompleted >= sessionsUntilLongRestRef.current) {
                    // 🔥 FULL SESSION COMPLETE
                    playSound(endOfCycleSound?.url);
                    logSession(currentCycle, 'completed'); // 🔥 FIX 4: CORRECT CALL
                    setSessionPhaseRecords([]);
                    setCurrentPhaseIndex(0);
                } else {
                    playSound();
                    setCurrentPhaseIndex(0);
                    setIsActive(true);
                }
            } else {
                playSound();
                advancePhase();
                setIsActive(true);
            }
        }
    }["TimerProvider.useEffect"], [
        timeLeft,
        isActive,
        playSound
    ]); // 🔥 FIX 5: ADD DEP
    // Reset timer on phase change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TimerProvider.useEffect": ()=>{
            setTimeLeft(getDuration());
        }
    }["TimerProvider.useEffect"], [
        currentPhase,
        currentCycle,
        getDuration
    ]);
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "TimerProvider.useCallback[reset]": ()=>{
            setIsActive(false);
            resetCycle();
            setCyclesCompleted(0);
            setSessionPhaseRecords([]);
            setTimeLeft(getDuration());
        }
    }["TimerProvider.useCallback[reset]"], [
        resetCycle,
        getDuration
    ]);
    const startPause = (sessionsUntilLongRest)=>{
        sessionsUntilLongRestRef.current = sessionsUntilLongRest;
        if (cyclesCompleted >= sessionsUntilLongRest && sessionsUntilLongRest > 0) {
            reset();
        }
        setIsActive((prev)=>!prev);
    };
    const skip = (sessionsUntilLongRest)=>{
        if (!currentCycle || !currentPhase) return;
        sessionsUntilLongRestRef.current = sessionsUntilLongRest;
        setIsActive(false);
        setSessionPhaseRecords((prev)=>[
                ...prev,
                {
                    title: currentPhase.title,
                    duration: currentPhase.duration,
                    completionStatus: 'skipped'
                }
            ]);
        const isLastPhase = currentPhaseIndex >= currentCycle.phases.length - 1;
        if (isLastPhase) {
            const newCyclesCompleted = cyclesCompleted + 1;
            setCyclesCompleted(newCyclesCompleted);
            if (sessionsUntilLongRestRef.current > 0 && newCyclesCompleted >= sessionsUntilLongRestRef.current) {
                playSound(endOfCycleSound?.url);
                setIsActive(false);
                setCurrentPhaseIndex(0);
            } else {
                playSound();
                setCurrentPhaseIndex(0);
                setIsActive(true);
            }
        } else {
            playSound();
            advancePhase();
            setIsActive(true);
        }
    };
    const value = {
        timeLeft,
        isActive,
        cyclesCompleted,
        sessionPhaseRecords,
        startPause,
        reset,
        skip
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TimerContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/timer-context.tsx",
        lineNumber: 191,
        columnNumber: 5
    }, this);
};
_s1(TimerProvider, "pXZDEqhFpyyD3VqLKAsPMicYcDk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$settings$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettings"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$cycle$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCycle"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$history$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHistory"]
    ];
});
_c = TimerProvider;
var _c;
__turbopack_context__.k.register(_c, "TimerProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/providers.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/app/providers.tsx - FINAL STACK
__turbopack_context__.s({
    "default": (()=>ClientProviders)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$cycle$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/cycle-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$history$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/history-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$timer$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/timer-context.tsx [app-client] (ecmascript)"); // ✅
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$settings$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/settings-context.tsx [app-client] (ecmascript)"); // ✅ If exists
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function CycleBridge({ children }) {
    _s();
    const { currentCycle } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$cycle$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCycle"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$history$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HistoryProvider"], {
        currentCycle: currentCycle,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/providers.tsx",
        lineNumber: 13,
        columnNumber: 10
    }, this);
}
_s(CycleBridge, "dakqBFH8S6TRZuI0pcuwW60G52g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$cycle$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCycle"]
    ];
});
_c = CycleBridge;
function ClientProviders({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$settings$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SettingsProvider"], {
            children: [
                " ",
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$cycle$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CycleProvider"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CycleBridge, {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$timer$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TimerProvider"], {
                            children: [
                                " ",
                                children
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/providers.tsx",
                            lineNumber: 22,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/providers.tsx",
                        lineNumber: 21,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/providers.tsx",
                    lineNumber: 20,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/providers.tsx",
            lineNumber: 19,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/providers.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
_c1 = ClientProviders;
var _c, _c1;
__turbopack_context__.k.register(_c, "CycleBridge");
__turbopack_context__.k.register(_c1, "ClientProviders");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_f5eadb87._.js.map