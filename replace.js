const fs = require('fs');
const path = require('path');

const replacer = [
  // Hover glass panel states
  [/hover:glass-panel-3/g, 'hover:bg-paper-3-glass'],
  [/hover:glass-panel-2/g, 'hover:bg-paper-2-glass'],
  [/hover:glass-panel/g, 'hover:bg-paper-glass'],

  // Glass panel states
  [/glass-panel-3/g, 'bg-paper-3-glass backdrop-blur-sm'],
  [/glass-panel-2/g, 'bg-paper-2-glass backdrop-blur'],
  [/glass-panel/g, 'bg-paper-glass backdrop-blur-md'],

  // Backgrounds
  [/bg-\[var\(--color-paper-3\)\u002f40\]/g, 'bg-paper-3-glass backdrop-blur-sm'], // special case for AdminTab px-6
  [/bg-\[var\(--color-paper-3\)\u002f30\]/g, 'bg-paper-3-glass backdrop-blur-sm'],
  [/bg-\[var\(--color-paper-3\)\u002f55\]/g, 'bg-paper-3-glass backdrop-blur-sm'],
  [/bg-\[var\(--color-paper-3\)\]/g, 'bg-paper-3'],
  [/bg-\[var\(--color-paper-2\)\]/g, 'bg-paper-2'],
  [/bg-\[var\(--color-paper\)\]/g, 'bg-paper'],
  [/bg-\[var\(--color-accent-bg\)\]/g, 'bg-accent-bg'],
  [/bg-\[var\(--color-accent\)\]/g, 'bg-accent'],
  [/hover:bg-\[var\(--color-accent-hover\)\]/g, 'hover:bg-accent-hover'],
  [/bg-\[var\(--color-success\)\]/g, 'bg-success'],
  [/bg-\[var\(--color-success-bg\)\]/g, 'bg-success-bg'],
  [/bg-\[var\(--color-error\)\]/g, 'bg-error'],
  [/bg-\[var\(--color-error-bg\)\]/g, 'bg-error-bg'],
  [/bg-\[var\(--color-warning\)\]/g, 'bg-warning'],
  [/bg-\[var\(--color-warning-bg\)\]/g, 'bg-warning-bg'],

  // Text colors
  [/text-\[var\(--color-ink-2\)\]/g, 'text-ink-2'],
  [/text-\[var\(--color-ink\)\]/g, 'text-ink'],
  [/text-\[var\(--color-accent\)\]/g, 'text-accent'],
  [/text-\[var\(--color-success\)\]/g, 'text-success'],
  [/text-\[var\(--color-error\)\]/g, 'text-error'],
  [/text-\[var\(--color-warning\)\]/g, 'text-warning'],

  // Borders & Rings
  [/border-\[var\(--color-rule-strong\)\]/g, 'border-rule-strong'],
  [/border-\[var\(--color-rule\)\]/g, 'border-rule'],
  [/border-\[var\(--color-accent\)\]/g, 'border-accent'],
  [/border-\[var\(--color-success-border\)\]/g, 'border-success-border'],
  [/border-\[var\(--color-error-border\)\]/g, 'border-error-border'],
  [/border-\[var\(--color-warning-border\)\]/g, 'border-warning-border'],
  [/ring-\[var\(--color-accent\)\]/g, 'ring-accent'],
];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        walk(fullPath);
      }
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const [regex, replacement] of replacer) {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

walk(path.join(__dirname, 'src'));
console.log('Done replacement!');
