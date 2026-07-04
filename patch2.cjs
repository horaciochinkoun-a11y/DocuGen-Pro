const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /\{currentView === 'home' \? \([\s\S]*?\/>\n\s*\)\}/s,
  `{currentView === 'home' && (
          <LandingPage 
            onStart={() => {
              window.history.pushState({ view: 'app' }, '');
              setCurrentView('app');
            }} 
            theme={theme} 
            toggleTheme={toggleTheme}
            onShowLegalDoc={handleSetShowLegalDoc}
          />
        )}
        {currentView === 'app' && (
          <DocumentationGenerator 
            onNavigateHome={() => {
              if (window.history.state?.view === 'app') {
                window.history.back();
              } else {
                window.history.pushState({ view: 'home' }, '');
                setCurrentView('home');
              }
            }} 
            theme={theme} 
            toggleTheme={toggleTheme}
            designSystem={designSystem}
            setDesignSystem={setDesignSystem}
            showSettings={showSettings}
            setShowSettings={handleSetShowSettings}
            showHistory={showHistory}
            setShowHistory={handleSetShowHistory}
            showReleaseNotes={showReleaseNotes}
            setShowReleaseNotes={handleSetShowReleaseNotes}
            onShowLegalDoc={handleSetShowLegalDoc}
          />
        )}
        {currentView === 'legal' && showLegalDoc && (
          <LegalPage 
            docType={showLegalDoc}
            onBack={() => handleSetShowLegalDoc(null)}
            theme={theme}
          />
        )}`
);

code = code.replace(
  /\s*{\/\* Legal Document Modal \*\/}[\s\S]*?<\/AnimatePresence>\s*<\/div>\s*<\/ErrorBoundary>\s*\);\s*}/s,
  `\n      </div>\n    </ErrorBoundary>\n  );\n}`
);

fs.writeFileSync('src/App.tsx', code);
