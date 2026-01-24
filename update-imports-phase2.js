const fs = require('fs');
const path = require('path');

const importMappings = [
  // Timer machine
  {
    pattern: /from\s+['"]@\/ai\/timer-machine['"]/g,
    replacement: 'from "@/features/timer"'
  },
  // Timer store
  {
    pattern: /from\s+['"]@\/store\/useTimerStore['"]/g,
    replacement: 'from "@/features/timer"'
  },
  // Timer display component
  {
    pattern: /from\s+['"]@\/components\/app\/timer-display['"]/g,
    replacement: 'from "@/features/timer"'
  },
  // Individual imports (less common but handle them)
  {
    pattern: /import\s+{\s*timerMachine\s*}\s+from\s+['"]@\/ai\/timer-machine['"]/g,
    replacement: 'import { timerMachine } from "@/features/timer"'
  },
  {
    pattern: /import\s+{\s*useTimerStore\s*}\s+from\s+['"]@\/store\/useTimerStore['"]/g,
    replacement: 'import { useTimerStore } from "@/features/timer"'
  },
  {
    pattern: /import\s+{\s*TimerDisplay\s*}\s+from\s+['"]@\/components\/app\/timer-display['"]/g,
    replacement: 'import { TimerDisplay } from "@/features/timer"'
  },
];

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!['node_modules', '.next', '.git', 'features'].includes(file)) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
      }
    } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
      arrayOfFiles.push(filePath);
    }
  });
  return arrayOfFiles;
}

function updateImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changesMade = 0;

  importMappings.forEach(({ pattern, replacement }) => {
    const matches = content.match(pattern);
    if (matches) {
      changesMade += matches.length;
      content = content.replace(pattern, replacement);
    }
  });

  if (changesMade > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${changesMade} import(s) in: ${filePath}`);
    return true;
  }
  return false;
}

console.log('🚀 Starting Phase 2 Import Update...\n');

const srcPath = path.join(__dirname, 'src');
const allFiles = getAllFiles(srcPath);

let totalFilesUpdated = 0;

allFiles.forEach(file => {
  const updated = updateImportsInFile(file);
  if (updated) totalFilesUpdated++;
});

console.log('\n📊 Summary:');
console.log(`   Files scanned: ${allFiles.length}`);
console.log(`   Files updated: ${totalFilesUpdated}`);
console.log('\n✅ Phase 2 Import Update Complete!');
