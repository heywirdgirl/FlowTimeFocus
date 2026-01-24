#!/bin/bash

echo "🚀 Starting Phase 1 Migration..."

# Batch 1: UI Components
echo "📦 Moving UI components..."
mv src/components/ui/* src/shared/components/ui/ 2>/dev/null || echo "UI components moved or not found"

# Batch 2: Lib utilities
echo "📚 Moving lib utilities..."
mv src/lib/utils.ts src/shared/lib/
mv src/lib/firebase.ts src/shared/lib/
mv src/lib/placeholder-images.json src/shared/lib/
mv src/lib/placeholder-images.ts src/shared/lib/

# Batch 3: Hooks
echo "🪝 Moving hooks..."
mv src/hooks/use-mobile.tsx src/shared/hooks/
mv src/hooks/use-toast.ts src/shared/hooks/

# Batch 4: Layout & Theme components
echo "🎨 Moving layout components..."
mv src/components/app/header.tsx src/shared/components/layout/ 2>/dev/null
mv src/components/app/footer.tsx src/shared/components/layout/ 2>/dev/null
mv src/components/app/theme-provider.tsx src/shared/components/theme/ 2>/dev/null

# Keep types.ts for now (will handle in later phase)
echo "📝 Keeping types.ts for Phase 5..."
cp src/lib/types.ts src/shared/types/index.ts

echo "✅ Phase 1 Migration Complete!"
echo "⚠️  Next: Update import paths in tsconfig.json"