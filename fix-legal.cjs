const fs = require('fs');
let code = fs.readFileSync('src/components/LegalPage.tsx', 'utf8');

// Use the title
code = code.replace(
  /<div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-p:leading-relaxed">/,
  `<h1 className="text-3xl font-black text-neutral-900 dark:text-white mb-8 tracking-tight">{title}</h1>
          <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-p:leading-relaxed">`
);

fs.writeFileSync('src/components/LegalPage.tsx', code);
