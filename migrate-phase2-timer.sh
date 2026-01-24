#!/bin/bash

echo "🚀 Starting Phase 2: Timer Feature Migration..."

# Di chuyển files
echo "📦 Moving timer files..."

# Machine
cp src/ai/timer-machine.ts src/features/timer/machines/timer-machine.ts

# Store
cp src/store/useTimerStore.ts src/features/timer/store/timer-store.ts

# Component
cp src/components/app/timer-display.tsx src/features/timer/components/timer-display.tsx

echo "✅ Files copied to new structure"
echo "⚠️  Old files kept for safety - delete manually after verification"
echo "📝 Next: Provide code for refactoring"
