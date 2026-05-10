// fix-all-exports.js
import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walk(filePath, callback);
    } else if (file.endsWith('.tsx')) {
      callback(filePath);
    }
  });
}

const srcDir = path.join(process.cwd(), 'src');

walk(srcDir, filePath => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace "export const ComponentName =" with "export default function ComponentName("
  const updated = content.replace(
    /export const (\w+)\s*=\s*\((.*?)\)\s*=>/s,
    'export default function $1($2)'
  );

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✔ Converted ${filePath} to default export`);
  }
});
