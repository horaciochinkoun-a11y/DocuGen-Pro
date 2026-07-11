const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace handleSetShowLegalDoc with onShowLegalDoc inside the footer of DocumentationGenerator
code = code.replace(
  /<footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-neutral-200 dark:border-neutral-800 mt-auto flex flex-col justify-center w-full">[\s\S]*?<\/footer>/,
  `<footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-neutral-200 dark:border-neutral-800 mt-auto flex flex-col justify-center w-full">
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
            <button onClick={() => onShowLegalDoc('cgu')} className="hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">CGU</button>
            <button onClick={() => onShowLegalDoc('privacy')} className="hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">Confidentialité</button>
            <button onClick={() => onShowLegalDoc('mentions')} className="hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">Mentions Légales</button>
            <button onClick={() => onShowLegalDoc('ai')} className="hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">Charte IA</button>
            <button onClick={() => onShowLegalDoc('local_data')} className="hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">Données Locales</button>
            
            <span className="hidden sm:inline">|</span>
            
            <span>Powered by Horacio Chinkoun</span>
          </div>
        </div>
      </footer>`
);

fs.writeFileSync('src/App.tsx', code);
