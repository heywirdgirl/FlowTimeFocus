
// verify-imports.js
const fs = require('fs');
const path = require('path');

const oldPatterns = [
  /@\/components\/ui\//,
  /@\/lib\/utils/,
  /@\/lib\/firebase/,
  /@\/hooks\/use-mobile/,
  /@\/hooks\/use-toast/,
  /@\/components\/app\/header/,
  /@\/components\/app\/footer/,
  /@\/components\/app\/theme-provider/,
];

function findOldImports(dirPath, issues = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      if (!['node_modules', '.next', '.git'].includes(file)) {
        findOldImports(filePath, issues);
      }
    } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      oldPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          issues.push({
            file: filePath,
            pattern: pattern.toString()
          });
        }
      });
    }
  });

  return issues;
}

console.log('🔍 Verifying imports...\n');
const issues = findOldImports(path.join(__dirname, 'src'));

if (issues.length === 0) {
  console.log('✅ No old import patterns found!');
} else {
  console.log('⚠️  Found old import patterns:');
  issues.forEach(({ file, pattern }) => {
    console.log(`   ${file} - ${pattern}`);
  });
}
