const fs = require('fs');
let code = fs.readFileSync('src/components/LegalPage.tsx', 'utf8');
code = code.replace(
  /<h1 className="text-3xl font-black text-neutral-900 dark:text-white mb-8 tracking-tight">\{title\}<\/h1>/,
  ''
);
fs.writeFileSync('src/components/LegalPage.tsx', code);
