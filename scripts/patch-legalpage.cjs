const fs = require('fs');
let code = fs.readFileSync('src/components/LegalPage.tsx', 'utf8');
code = code.replace(
  /interface LegalPageProps \{\n  docType: 'cgu' \| 'privacy' \| 'mentions' \| 'ai' \| 'local_data';\n  onBack: \(\) => void;\n  theme: 'light' \| 'dark';\n\}/,
  `interface LegalPageProps {\n  docType: 'cgu' | 'privacy' | 'mentions' | 'ai' | 'local_data';\n  onBack: () => void;\n  onNavigate?: (doc: 'cgu' | 'privacy' | 'mentions' | 'ai' | 'local_data') => void;\n  theme: 'light' | 'dark';\n}`
);

code = code.replace(
  /export default function LegalPage\(\{ docType, onBack, theme \}: LegalPageProps\) \{/,
  `export default function LegalPage({ docType, onBack, onNavigate, theme }: LegalPageProps) {`
);

code = code.replace(
  /<div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-500 flex-wrap justify-center">\s*<span>Powered by Horacio Chinkoun<\/span>\s*<\/div>/,
  `<div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-xs font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-500 flex-wrap justify-center">
            {onNavigate && (
              <>
                <button type="button" onClick={() => onNavigate('cgu')} className="hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">CGU</button>
                <button type="button" onClick={() => onNavigate('privacy')} className="hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">Confidentialité</button>
                <button type="button" onClick={() => onNavigate('mentions')} className="hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">Mentions Légales</button>
                <button type="button" onClick={() => onNavigate('ai')} className="hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">Charte IA</button>
                <button type="button" onClick={() => onNavigate('local_data')} className="hover:text-neutral-900 dark:hover:text-white transition-colors duration-200">Données Locales</button>
                <span className="hidden sm:inline">|</span>
              </>
            )}
            <span>Powered by Horacio Chinkoun</span>
          </div>`
);

fs.writeFileSync('src/components/LegalPage.tsx', code);
