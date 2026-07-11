const fs = require('fs');
let code = fs.readFileSync('src/components/LegalPage.tsx', 'utf8');
code = code.replace(
  /className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-p:leading-relaxed"/,
  'className="markdown-legal max-w-none"'
);
fs.writeFileSync('src/components/LegalPage.tsx', code);
