import fs from 'fs';

const files = [
  'src/app/dashboard/analytics/page.tsx', 
  'src/app/dashboard/page.tsx', 
  'src/app/dashboard/tokens/page.tsx', 
  'src/app/dashboard/watermarks/page.tsx', 
  'src/app/view/pdf/page.tsx', 
  'src/app/view/video/page.tsx', 
  'src/app/(marketing)/docs/page.tsx'
];

files.forEach(f => {
  let text = fs.readFileSync(f, 'utf8');
  // Match a backslash followed by a backtick
  let newText = text.replaceAll('\\\\`', '\`');
  if (text !== newText) {
    fs.writeFileSync(f, newText, 'utf8');
    console.log('Fixed', f);
  }
});
