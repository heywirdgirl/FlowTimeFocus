
const fs = require('fs');
const path = require('path');

// Định nghĩa mapping từ old path → new path
const importMappings = [
  // UI Components
  {
    pattern: /from\s+['"]@\/components\/ui\/([^'"]+)['"]/g,
    replacement: 'from "@/shared/components/ui/$1"'
  },
  
  // Lib utilities
  {
    pattern: /from\s+['"]@\/lib\/utils['"]/g,
    replacement: 'from "@/shared/lib/utils"'
  },
  {
    pattern: /from\s+['"]@\/lib\/firebase['"]/g,
    replacement: 'from "@/shared/lib/firebase"'
  },
  {
    pattern: /from\s+['"]@\/lib\/placeholder-images['"]/g,
    replacement: 'from "@/shared/lib/placeholder-images"'
  },
  {
    pattern: /from\s+['"]@\/lib\/types['"]/g,
    replacement: 'from "@/shared/types"'
  },
  
  // Hooks
  {
    pattern: /from\s+['"]@\/hooks\/use-mobile['"]/g,
    replacement: 'from "@/shared/hooks/use-mobile"'
  },
  {
    pattern: /from\s+['"]@\/hooks\/use-toast['"]/g,
    replacement: 'from "@/shared/hooks/use-toast"'
  },
  
  // Layout components
  {
    pattern: /from\s+['"]@\/components\/app\/header['"]/g,
    replacement: 'from "@/shared/components/layout/header"'
  },
  {
    pattern: /from\s+['"]@\/components\/app\/footer['"]/g,
    replacement: 'from "@/shared/components/layout/footer"'
  },
  
  // Theme
  {
    pattern: /from\s+['"]@\/components\/app\/theme-provider['"]/g,
    replacement: 'from "@/shared/components/theme/theme-provider"'
  },
];

// Hàm đệ quy tìm tất cả file .ts, .tsx, .js, .jsx
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      // Skip node_modules, .next, .git
      if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(file)) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
      }
    } else {
      // Chỉ xử lý file TypeScript/JavaScript
      if (/\.(ts|tsx|js|jsx)$/.test(file)) {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}

// Hàm replace imports trong 1 file
function updateImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
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

// Main execution
console.log('🚀 Starting Phase 1 Import Update...\n');

const srcPath = path.join(__dirname, 'src');
const allFiles = getAllFiles(srcPath);

let totalFilesUpdated = 0;
let totalImportsUpdated = 0;

allFiles.forEach(file => {
  const updated = updateImportsInFile(file);
  if (updated) {
    totalFilesUpdated++;
  }
});

console.log('\n📊 Summary:');
console.log(`   Files scanned: ${allFiles.length}`);
console.log(`   Files updated: ${totalFilesUpdated}`);
console.log('\n✅ Phase 1 Import Update Complete!');
console.log('⚠️  Please review changes and test your app.');
