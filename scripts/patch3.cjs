const fs = require('fs');
let code = fs.readFileSync('src/components/LegalPage.tsx', 'utf8');

code = code.replace(
  /<\/div>\n    <\/div>/,
  `</div>\n      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-neutral-200 dark:border-neutral-800 mt-12 flex flex-col justify-center w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              © 2026 DocuGen Pro. All rights reserved by Horacio Chinkoun.
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 italic">
              DocuGen Pro est la propriété personnelle de Horacio Chinkoun.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-500 flex-wrap justify-center">
            <span>Powered by Horacio Chinkoun</span>
          </div>
        </div>
      </footer>\n    </div>`
);

fs.writeFileSync('src/components/LegalPage.tsx', code);
